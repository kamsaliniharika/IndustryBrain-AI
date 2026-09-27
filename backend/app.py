import os
import sqlite3
import secrets

from functools import wraps

from dotenv import load_dotenv
from google import genai

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

import fitz
from docx import Document

import pytesseract
from PIL import Image

from google.genai import types
import faiss
import numpy as np


app = Flask(__name__)
CORS(app)


# --------------------------------------------------
# Tesseract OCR Configuration
# --------------------------------------------------

if os.name == "nt":
    pytesseract.pytesseract.tesseract_cmd = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )


# --------------------------------------------------
# Configuration
# --------------------------------------------------

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")

gemini_client = genai.Client(
    api_key=gemini_api_key
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# --------------------------------------------------
# Gemini Embedding Configuration
# --------------------------------------------------

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIMENSION = 768
EMBEDDING_BATCH_SIZE = 32


def create_embeddings(texts, task_type="RETRIEVAL_DOCUMENT"):
    """
    Create embeddings with Gemini instead of loading a local
    SentenceTransformer/PyTorch model.
    """
    if isinstance(texts, str):
        texts = [texts]

    if not texts:
        return np.empty((0, EMBEDDING_DIMENSION), dtype="float32")

    all_embeddings = []

    for start in range(0, len(texts), EMBEDDING_BATCH_SIZE):
        batch = texts[start:start + EMBEDDING_BATCH_SIZE]

        result = gemini_client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=batch,
            config=types.EmbedContentConfig(
                task_type=task_type,
                output_dimensionality=EMBEDDING_DIMENSION,
            ),
        )

        all_embeddings.extend(
            embedding.values for embedding in result.embeddings
        )

    return np.asarray(all_embeddings, dtype="float32")


# --------------------------------------------------
# In-Memory Semantic Search Storage
# --------------------------------------------------

documents = {}

# --------------------------------------------------
# Authentication Database
# --------------------------------------------------
DATABASE = os.path.join(BASE_DIR, "users.db")

def init_auth_db():
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            token TEXT UNIQUE
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            UNIQUE(user_id, filename),
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    connection.commit()
    connection.close()

init_auth_db()

def get_auth_token():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    return auth_header.replace("Bearer ", "", 1).strip()

def get_current_user():
    token = get_auth_token()
    if not token:
        return None
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()
    cursor.execute("SELECT id, name, email FROM users WHERE token = ?", (token,))
    user = cursor.fetchone()
    connection.close()
    if not user:
        return None
    return {"id": user[0], "name": user[1], "email": user[2]}

def login_required(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401
        return function(*args, **kwargs)
    return wrapper

# --------------------------------------------------
# Authentication
# --------------------------------------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not name or not email or not password:
        return jsonify({"error": "Name, email and password are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    hashed_password = generate_password_hash(password)
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()
    try:
        cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, hashed_password))
        # Generate a token immediately so signup also creates an authenticated session.
        token = secrets.token_urlsafe(32)
        cursor.execute("UPDATE users SET token = ? WHERE id = ?", (token, cursor.lastrowid))
        connection.commit()

        return jsonify({
            "message": "Account created successfully",
            "token": token,
            "user": {
                "id": cursor.lastrowid,
                "name": name,
                "email": email
            }
        }), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "An account with this email already exists"}), 409
    except Exception as error:
        return jsonify({"error": f"Signup failed: {str(error)}"}), 500
    finally:
        connection.close()

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()
    cursor.execute("SELECT id, name, email, password FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    if not user or not check_password_hash(user[3], password):
        connection.close()
        return jsonify({"error": "Invalid email or password"}), 401
    token = secrets.token_urlsafe(32)
    cursor.execute("UPDATE users SET token = ? WHERE id = ?", (token, user[0]))
    connection.commit()
    connection.close()
    return jsonify({"message": "Login successful", "token": token, "user": {"id": user[0], "name": user[1], "email": user[2]}})

@app.route("/me", methods=["GET"])
@login_required
def current_user():
    return jsonify({"user": get_current_user()})

@app.route("/logout", methods=["POST"])
def logout():
    token = get_auth_token()
    if token:
        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()
        cursor.execute("UPDATE users SET token = NULL WHERE token = ?", (token,))
        connection.commit()
        connection.close()
    return jsonify({"message": "Logged out successfully"})


# --------------------------------------------------
# Helper Functions
# --------------------------------------------------

def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# --------------------------------------------------
# Document Text Extraction
# --------------------------------------------------

def extract_text_from_file(file_path):

    extension = file_path.rsplit(".", 1)[1].lower()


    # --------------------------------------------------
    # PDF
    # --------------------------------------------------

    if extension == "pdf":

        document = fitz.open(file_path)

        text = []

        # Normal PDF text extraction
        for page in document:

            page_text = page.get_text()

            if page_text.strip():
                text.append(page_text)

        extracted_text = "\n".join(text).strip()


        # OCR fallback for scanned PDFs
        if not extracted_text:

            ocr_text = []

            for page in document:

                pix = page.get_pixmap(
                    matrix=fitz.Matrix(2, 2)
                )

                image = Image.frombytes(
                    "RGB",
                    [pix.width, pix.height],
                    pix.samples
                )

                page_ocr = pytesseract.image_to_string(
                    image,
                    lang="eng"
                )

                if page_ocr.strip():
                    ocr_text.append(page_ocr)

            extracted_text = "\n".join(ocr_text).strip()

        document.close()

        return extracted_text


    # --------------------------------------------------
    # DOCX
    # --------------------------------------------------

    elif extension == "docx":

        document = Document(file_path)

        text = []

        for paragraph in document.paragraphs:

            if paragraph.text.strip():
                text.append(paragraph.text)

        return "\n".join(text).strip()


    # --------------------------------------------------
    # TXT
    # --------------------------------------------------

    elif extension == "txt":

        with open(
            file_path,
            "r",
            encoding="utf-8",
            errors="ignore"
        ) as file:

            return file.read().strip()


    return ""


# --------------------------------------------------
# Text Chunking
# --------------------------------------------------

def create_chunks(text, chunk_size=500, overlap=100):

    words = text.split()

    chunks = []

    start = 0

    while start < len(words):

        end = start + chunk_size

        chunk = " ".join(words[start:end])

        if chunk.strip():
            chunks.append(chunk)

        start += chunk_size - overlap

    return chunks


# --------------------------------------------------
# Create FAISS Index
# --------------------------------------------------

def create_faiss_index(filename, chunks):

    if not chunks:
        return

    print(f"Creating embeddings for {filename}...")

    embeddings = create_embeddings(
        chunks,
        task_type="RETRIEVAL_DOCUMENT"
    )

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    documents[filename] = {
        "chunks": chunks,
        "index": index
    }

    print(
        f"FAISS index created for {filename} "
        f"with {len(chunks)} chunks."
    )

# --------------------------------------------------
# Home
# --------------------------------------------------

@app.route("/")
def home():

    return jsonify({
        "message": "IndustryBrain AI Backend is running!"
    })


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.route("/health")
def health():

    return jsonify({
        "status": "ok"
    })


# --------------------------------------------------
# Upload Document
# --------------------------------------------------

@app.route("/upload", methods=["POST"])
@login_required
def upload_file():

    user = get_current_user()

    if "file" not in request.files:
        return jsonify({
            "error": "No file provided"
        }), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({
            "error": "No file selected"
        }), 400

    if not allowed_file(file.filename):
        return jsonify({
            "error": "Only PDF, DOCX, and TXT files are allowed"
        }), 400

    # Original filename shown to the user
    original_filename = secure_filename(file.filename)

    # User-specific physical filename
    stored_filename = f"{user['id']}_{original_filename}"

    file_path = os.path.join(
        app.config["UPLOAD_FOLDER"],
        stored_filename
    )

    try:
        file.save(file_path)

        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT OR REPLACE INTO user_documents
            (user_id, filename)
            VALUES (?, ?)
            """,
            (user["id"], original_filename)
        )

        connection.commit()
        connection.close()

        return jsonify({
            "message": "File uploaded successfully",
            "filename": original_filename
        }), 201

    except Exception as error:

        if os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({
            "error": f"File upload failed: {str(error)}"
        }), 500


# --------------------------------------------------
# User Document Helpers
# --------------------------------------------------

def get_user_document_path(user_id, filename):
    """Return the physical path for a user's uploaded document."""
    safe_filename = secure_filename(filename)
    stored_filename = f"{user_id}_{safe_filename}"
    return os.path.join(app.config["UPLOAD_FOLDER"], stored_filename)


def user_owns_document(user_id, filename):
    """Check whether the logged-in user owns the document."""
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()
    cursor.execute(
        "SELECT 1 FROM user_documents WHERE user_id = ? AND filename = ?",
        (user_id, secure_filename(filename))
    )
    result = cursor.fetchone()
    connection.close()
    return result is not None


def document_index_key(user_id, filename):
    """Create a unique in-memory FAISS key per user and document."""
    return f"{user_id}:{secure_filename(filename)}"


# --------------------------------------------------
# Extract Document Text
# --------------------------------------------------

@app.route("/extract/<filename>", methods=["GET"])
@login_required
def extract_document(filename):

    user = get_current_user()
    filename = secure_filename(filename)

    if not user_owns_document(user["id"], filename):
        return jsonify({
            "error": "Document not found or not accessible"
        }), 404

    file_path = get_user_document_path(user["id"], filename)

    if not os.path.exists(file_path):
        return jsonify({
            "error": "File not found"
        }), 404

    try:
        text = extract_text_from_file(file_path)

        return jsonify({
            "filename": filename,
            "text": text,
            "characters": len(text)
        })

    except Exception as error:
        return jsonify({
            "error": f"Could not extract document text: {str(error)}"
        }), 500


# --------------------------------------------------
# Create Document Index
# --------------------------------------------------

@app.route("/index/<filename>", methods=["POST"])
@login_required
def index_document(filename):

    user = get_current_user()
    filename = secure_filename(filename)

    if not user_owns_document(user["id"], filename):
        return jsonify({
            "error": "Document not found or not accessible"
        }), 404

    file_path = get_user_document_path(user["id"], filename)

    if not os.path.exists(file_path):
        return jsonify({
            "error": "File not found"
        }), 404

    try:
        text = extract_text_from_file(file_path)

        if not text:
            return jsonify({
                "error": "No text found in document"
            }), 400

        chunks = create_chunks(text)
        index_key = document_index_key(user["id"], filename)
        create_faiss_index(index_key, chunks)

        return jsonify({
            "message": "Document indexed successfully",
            "filename": filename,
            "chunks": len(chunks)
        })

    except Exception as error:
        return jsonify({
            "error": f"Could not index document: {str(error)}"
        }), 500


# --------------------------------------------------
# Semantic Search
# --------------------------------------------------

@app.route("/search", methods=["POST"])
@login_required
def semantic_search():

    user = get_current_user()
    data = request.get_json(silent=True) or {}

    query = data.get("query", "").strip()
    filename = secure_filename(data.get("filename", "").strip())

    if not query:
        return jsonify({
            "error": "Search query is required"
        }), 400

    if not filename:
        return jsonify({
            "error": "Filename is required"
        }), 400

    if not user_owns_document(user["id"], filename):
        return jsonify({
            "error": "Document not found or not accessible"
        }), 404

    index_key = document_index_key(user["id"], filename)

    if index_key not in documents:
        return jsonify({
            "error": "This document has not been indexed yet"
        }), 400

    try:
        document = documents[index_key]
        index = document["index"]
        chunks = document["chunks"]

        query_embedding = create_embeddings(
            [query],
            task_type="RETRIEVAL_QUERY"
        )

        distances, indices = index.search(
            query_embedding,
            min(5, len(chunks))
        )

        results = []
        for distance, chunk_index in zip(distances[0], indices[0]):
            if chunk_index >= 0:
                results.append({
                    "text": chunks[chunk_index],
                    "distance": float(distance)
                })

        return jsonify({
            "query": query,
            "filename": filename,
            "results": results
        })

    except Exception as error:
        return jsonify({
            "error": f"Search failed: {str(error)}"
        }), 500


# --------------------------------------------------
# Get Uploaded Documents
# --------------------------------------------------

@app.route("/documents", methods=["GET"])
@login_required
def get_documents():

    user = get_current_user()

    try:
        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()
        cursor.execute(
            "SELECT filename FROM user_documents WHERE user_id = ? ORDER BY id DESC",
            (user["id"],)
        )
        user_filenames = [row[0] for row in cursor.fetchall()]
        connection.close()

        document_list = []

        for filename in user_filenames:
            file_path = get_user_document_path(user["id"], filename)

            if not os.path.isfile(file_path):
                continue

            index_key = document_index_key(user["id"], filename)

            # Automatically create index if it is not in memory.
            if index_key not in documents:
                try:
                    text = extract_text_from_file(file_path)
                    if text.strip():
                        chunks = create_chunks(text)
                        create_faiss_index(index_key, chunks)
                except Exception as index_error:
                    print(
                        f"Could not index {filename}: {index_error}"
                    )

            document_list.append({
                "filename": filename,
                "size": os.path.getsize(file_path),
                "indexed": index_key in documents,
                "chunks": (
                    len(documents[index_key]["chunks"])
                    if index_key in documents
                    else 0
                )
            })

        return jsonify({
            "documents": document_list
        })

    except Exception as error:
        return jsonify({
            "error": f"Failed to get documents: {str(error)}"
        }), 500


# --------------------------------------------------
# Delete Document
# --------------------------------------------------

@app.route("/documents/<filename>", methods=["DELETE"])
@login_required
def delete_document(filename):

    user = get_current_user()
    filename = secure_filename(filename)

    if not user_owns_document(user["id"], filename):
        return jsonify({
            "error": "Document not found or not accessible"
        }), 404

    file_path = get_user_document_path(user["id"], filename)
    index_key = document_index_key(user["id"], filename)

    try:
        if os.path.exists(file_path):
            os.remove(file_path)

        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()
        cursor.execute(
            "DELETE FROM user_documents WHERE user_id = ? AND filename = ?",
            (user["id"], filename)
        )
        connection.commit()
        connection.close()

        documents.pop(index_key, None)

        return jsonify({
            "message": "Document deleted successfully",
            "filename": filename
        })

    except Exception as error:
        return jsonify({
            "error": f"Document deletion failed: {str(error)}"
        }), 500


# --------------------------------------------------
# Ask Gemini
# --------------------------------------------------

@app.route("/ask", methods=["POST"])
@login_required
def ask_gemini():

    user = get_current_user()
    data = request.get_json(silent=True) or {}

    query = data.get("query", "").strip()
    filename = secure_filename(data.get("filename", "").strip())

    if not query:
        return jsonify({
            "error": "Question is required"
        }), 400

    if not filename:
        return jsonify({
            "error": "Filename is required"
        }), 400

    if not user_owns_document(user["id"], filename):
        return jsonify({
            "error": "Document not found or not accessible"
        }), 404

    index_key = document_index_key(user["id"], filename)

    if index_key not in documents:
        return jsonify({
            "error": "This document has not been indexed yet"
        }), 400

    try:
        document = documents[index_key]
        index = document["index"]
        chunks = document["chunks"]

        # Create embedding for user's question
        query_embedding = create_embeddings(
            [query],
            task_type="RETRIEVAL_QUERY"
        )

        # Search relevant chunks from selected document
        distances, indices = index.search(
            query_embedding,
            min(5, len(chunks))
        )

        relevant_chunks = []
        for chunk_index in indices[0]:
            if chunk_index >= 0:
                relevant_chunks.append(chunks[chunk_index])

        context = "\n\n".join(relevant_chunks)

        prompt = f"""
You are IndustryBrain AI, an intelligent document assistant.

Answer the user's question using ONLY the information provided in the document context below.

If the answer is not present in the context, clearly say:
"I couldn't find that information in the uploaded document."

Do not invent information.

Document:
{filename}

Document Context:
{context}

User Question:
{query}

Answer clearly and concisely.
"""

        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return jsonify({
            "query": query,
            "filename": filename,
            "answer": response.text
        })

    except Exception as error:
        return jsonify({
            "error": f"AI answer generation failed: {str(error)}"
        }), 500

#Run Server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        debug=False,
        port=5000
    )