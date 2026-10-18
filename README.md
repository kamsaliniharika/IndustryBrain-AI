# IndustryBrain-AI 🧠

### AI-Powered Intelligent Document Assistant

IndustryBrain-AI is an AI-powered web application that allows users to upload documents, extract text, perform semantic searches, and ask questions about their documents using Generative AI.

The application combines document processing, vector search, and AI-powered question answering to make document analysis easier and faster.

## 🚀 Live Demo

- **Frontend:** https://industrybrain-frontend.onrender.com
- **Backend:** https://industrybrain-ai.onrender.com

## ✨ Features

- User registration and login
- Secure password hashing
- User-specific document access
- PDF, DOCX, and TXT document uploads
- Text extraction from uploaded documents
- OCR support for scanned PDF pages
- Document preview and deletion
- Semantic search using vector embeddings
- AI-powered question answering
- Document chunking for efficient retrieval
- FAISS-based similarity search
- Responsive web interface
- PostgreSQL database support
- Local SQLite database support

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

## 🏗️ Architecture

The application follows a frontend-backend architecture.

1. The React frontend provides the user interface.
2. The Flask backend handles authentication and API requests.
3. Uploaded documents are processed to extract readable text.
4. Extracted text is split into smaller chunks.
5. Gemini generates embeddings for semantic retrieval.
6. FAISS searches for relevant document chunks.
7. Gemini generates answers using the retrieved context.
8. PostgreSQL stores user and document metadata.

## 📂 Project Structure

```text
IndustryBrain-AI/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── uploads/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   └── components/
│   ├── package.json
│   └── index.html
│
├── README.md
└── .gitignore