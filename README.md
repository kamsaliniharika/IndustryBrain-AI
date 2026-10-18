# IndustryBrain-AI 🧠

### AI-Powered Intelligent Document Assistant

IndustryBrain-AI is an AI-powered web application that allows users to upload documents, extract text, perform semantic searches, and ask questions about their documents using Generative AI.

The application combines document processing, vector search, and AI-powered question answering to make document analysis easier and faster.

## 🚀 Live Demo

- **Frontend:** https://industrybrain-frontend.onrender.com
- **Backend:** https://industrybrain-ai.onrender.com

## ✨ Features

- User registration and login
- Password hashing
- Bearer-token authentication
- User-specific document access
- PDF, DOCX, and TXT document uploads
- Text extraction from uploaded documents
- OCR support for scanned PDF pages
- Document preview and deletion
- Document chunking for efficient retrieval
- Semantic search using vector embeddings
- FAISS-based similarity search
- AI-powered question answering
- Gemini-powered document understanding
- Responsive web interface
- PostgreSQL database support
- SQLite support for local development

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

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

### Database

- PostgreSQL with Supabase
- SQLite for local development

### Deployment and Version Control

- Render
- Git
- GitHub

## 🏗️ System Architecture

The application follows a frontend-backend architecture. The frontend communicates with the Flask backend through REST APIs.

```text
                     ┌──────────────────────┐
                     │         USER         │
                     └──────────┬───────────┘
                                │
                                ▼
                  ┌───────────────────────────┐
                  │     React + Vite          │
                  │       Frontend             │
                  │ Login, Upload, Search,     │
                  │ Documents, Settings, Chat  │
                  └─────────────┬─────────────┘
                                │
                                │ REST API
                                ▼
                  ┌───────────────────────────┐
                  │      Flask Backend        │
                  │ Authentication and APIs   │
                  └─────────────┬─────────────┘
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
                 ▼              ▼              ▼
       ┌────────────────┐ ┌─────────────┐ ┌────────────────┐
       │    Document    │ │  Gemini AI  │ │    Database    │
       │   Processing   │ │ Embeddings  │ │ PostgreSQL /   │
       │ PDF/DOCX/TXT   │ │ AI Answers  │ │ SQLite         │
       │ OCR Extraction │ └──────┬──────┘ └────────────────┘
       └───────┬────────┘        │
               │                 │
               ▼                 ▼
       ┌────────────────────────────────┐
       │       Text Chunking            │
       │   and Semantic Retrieval       │
       └────────────────┬───────────────┘
                        │
                        ▼
                ┌─────────────────┐
                │ FAISS Vector    │
                │ Similarity      │
                │ Search          │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Relevant Chunks │
                │ + Gemini Answer │
                └─────────────────┘
```

### Architecture Workflow

1. The user interacts with the React frontend.
2. The frontend sends requests to the Flask backend.
3. The backend handles authentication and document-related operations.
4. Uploaded documents are processed to extract readable text.
5. Extracted text is divided into smaller chunks.
6. Gemini embeddings are used for semantic retrieval.
7. FAISS searches for relevant document content.
8. Relevant content is used to help Gemini generate an answer.
9. User and document metadata are stored in the configured database.



## 📂 Project Structure

```text
IndustryBrain-AI/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── uploads/
│   └── users.db
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── index.html
│
├── .gitignore
├── .python-version
├── package.json
├── package-lock.json
├── render.yaml
└── README.md
```

**Security:** Do not commit database files, API keys, or secrets to GitHub.

## ⚙️ Local Installation

### Prerequisites

Install the following tools:

- Python 3.10 or a compatible version for the project's dependencies
- Node.js and npm
- Git
- Google Gemini API key

Tesseract OCR must also be installed and configured if OCR-based document extraction is required.

### 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/kamsaliniharika/IndustryBrain-AI.git
cd IndustryBrain-AI
```

### 2. Set Up the Backend

Create a Python virtual environment from the project root:

```bash
python -m venv backend/venv
```

Activate it on Windows PowerShell:

```powershell
.\backend\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r backend/requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
```

If PostgreSQL is supported and configured in the backend, add the database connection string:

```env
DATABASE_URL=your_postgresql_connection_string
```

For local development, SQLite may be used when the backend is configured to use it.

**Security:** Never commit API keys, database passwords, access tokens, or `.env` files to GitHub.

### 4. Start the Backend

From the project root, run:

```bash
python backend/app.py
```

The backend's local address is commonly:

```text
http://127.0.0.1:5000
```

The actual port depends on the backend configuration.

### 5. Set Up and Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in the terminal.

## 🔐 Environment Variables

Configure the required variables in your local environment or deployment platform.

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Authenticates requests to the Google Gemini API |
| `DATABASE_URL` | PostgreSQL connection string, when PostgreSQL is enabled |
| `DATABASE_PATH` | Optional custom SQLite database path, if supported by the backend |
| `PORT` | Port supplied by the deployment platform |

Only configure variables that are supported by the current backend code. Store secrets in environment settings rather than in source files.

## ☁️ Deployment

The application is deployed using Render.

- **Frontend:** https://industrybrain-frontend.onrender.com
- **Backend:** https://industrybrain-ai.onrender.com

### Deployment Overview

1. Push the project code to GitHub.
2. Configure the backend web service on Render.
3. Set the required build and start commands.
4. Configure the Gemini API key in the backend environment.
5. Configure PostgreSQL through Supabase if the backend is using PostgreSQL.
6. Deploy the frontend separately.
7. Ensure the frontend API base URL points to the deployed backend.
8. Test signup, login, document upload, search, AI chat, and logout.

**Database note:** PostgreSQL deployment requires the backend code and database configuration to support PostgreSQL correctly. Adding `DATABASE_URL` alone does not convert SQLite-based code into PostgreSQL-compatible code.

## 📖 How to Use

1. Open the application.
2. Create an account or sign in.
3. Upload a PDF, DOCX, or TXT document.
4. View the uploaded document.
5. Extract and process the document content.
6. Search for information using natural-language queries.
7. Ask AI questions about the document.
8. Review the generated answers.
9. Delete documents when they are no longer needed.
10. Log out when finished.

## 🔒 Security and Data Handling

- Passwords should be stored as hashes rather than plain text.
- Authentication uses bearer tokens.
- Document access should be restricted by user identity.
- API keys and database credentials should be stored in environment variables.
- Never commit secrets or private credentials to GitHub.
- Uploaded files and in-memory search indexes may require reprocessing after a server restart, depending on storage configuration.
- Persistent database and file storage should be configured appropriately for production use.

## 🚧 Future Enhancements

- Persistent vector storage
- Support for additional document formats
- Faster document processing
- Improved processing progress indicators
- Advanced search and filtering
- Enhanced document management
- Improved error handling
- Automated testing and monitoring
- Usage analytics and performance monitoring
- Improved user experience

## 👩‍💻 Author

**Kamsali Niharika**

- **GitHub:** https://github.com/kamsaliniharika
- **LinkedIn:** https://www.linkedin.com/in/kamsali-niharika-304495275

## 📄 License

No open-source license has been specified yet.

Before distributing the project as open-source software, add a `LICENSE` file that clearly states the terms under which others may use, modify, and distribute the code.
