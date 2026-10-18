# IndustryBrain-AI 🧠

### AI-Powered Intelligent Document Assistant

IndustryBrain-AI is an AI-powered web application that allows users to upload documents, extract text, perform semantic searches, and ask questions about their documents using Generative AI.

## 🚀 Live Demo

- **Frontend:** https://industrybrain-frontend.onrender.com
- **Backend:** https://industrybrain-ai.onrender.com

## ✨ Features

- User registration and login
- Password hashing
- User-specific document access
- PDF, DOCX, and TXT document uploads
- Text extraction from uploaded documents
- OCR support for scanned PDF pages
- Document preview and deletion
- Semantic search using vector embeddings
- AI-powered question answering
- FAISS-based similarity search
- PostgreSQL database support
- Local SQLite database support

## 🛠️ Technology Stack

### Frontend
- React
- Vite
- JavaScript
- HTML and CSS

### Backend
- Python
- Flask
- Flask-CORS
- Waitress

### AI and Document Processing
- Google Gemini API
- Gemini Embeddings
- FAISS
- NumPy
- PyMuPDF
- python-docx
- Tesseract OCR
- Pillow

### Database and Deployment
- PostgreSQL
- Supabase
- SQLite
- Render
- GitHub

## 🏗️ How It Works

1. Users register and log in.
2. Users upload PDF, DOCX, or TXT documents.
3. The backend extracts readable text.
4. The text is divided into smaller chunks.
5. Gemini generates embeddings.
6. FAISS retrieves relevant document content.
7. Gemini answers questions using the retrieved content.

## ⚙️ Local Installation

### Prerequisites

- Python
- Node.js and npm
- Git
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/kamsaliniharika/IndustryBrain-AI.git
cd IndustryBrain-AI
```

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend folder.

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

If PostgreSQL is configured, set `DATABASE_URL` in your environment.

For local SQLite development, use the database configuration supported by the backend.

**Never upload API keys or database passwords to GitHub.**

### 4. Run the Backend

From the project root, run:

```bash
python backend/app.py
```

### 5. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite.

## ☁️ Deployment

- **Frontend:** https://industrybrain-frontend.onrender.com
- **Backend:** https://industrybrain-ai.onrender.com

The application is deployed using Render. The backend can use PostgreSQL through Supabase when correctly configured.

## 📖 How to Use

1. Create an account.
2. Log in to the application.
3. Upload a document.
4. View the uploaded document.
5. Search for relevant information.
6. Ask AI questions about the document.
7. Delete documents when no longer needed.
8. Log out when finished.

## 🔒 Security

- Passwords are hashed.
- Authentication uses bearer tokens.
- Documents are associated with individual users.
- API keys and database credentials should be stored in environment variables.
- Never commit secrets to GitHub.

## 🚧 Future Enhancements

- Persistent vector storage
- Support for more document formats
- Improved processing progress indicators
- Advanced search and filtering
- Automated testing and monitoring

## 👩‍💻 Author

**Kamsali Niharika**

- **GitHub:** https://github.com/kamsaliniharika
- **LinkedIn:** https://www.linkedin.com/in/kamsali-niharika-304495275

## 📄 License

No open-source license has been specified yet.
