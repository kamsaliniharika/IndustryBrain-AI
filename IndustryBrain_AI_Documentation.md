# IndustryBrain-AI 🧠
## Technical Documentation

### 1. Project Overview
IndustryBrain-AI is an AI-powered web application that allows users to upload documents, extract text, perform semantic searches, and ask questions about their documents using Generative AI.

### 2. Objectives
- Upload PDF, DOCX, and TXT documents.
- Extract text from uploaded documents.
- Generate embeddings using Google Gemini.
- Retrieve relevant content using FAISS semantic search.
- Answer questions based on document context.
- Provide user authentication and document management.

### 3. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Python, Flask |
| AI Model | Google Gemini |
| Embeddings | Gemini Embeddings |
| Vector Search | FAISS |
| Database | SQLite / PostgreSQL |
| Deployment | Render |

### 4. Main Modules
- User Registration and Login
- Document Upload
- Text Extraction and OCR
- Document Indexing
- Semantic Search
- AI Question Answering
- Document Management

### 5. System Workflow
1. User logs in to the application.
2. User uploads a supported document.
3. The backend extracts text from the document.
4. Extracted text is split into smaller chunks.
5. Gemini generates embeddings for the chunks.
6. FAISS retrieves relevant document content.
7. Gemini generates an answer using the retrieved context.

### 6. Deployment
Frontend and backend are deployed using Render.

- Frontend: https://industrybrain-frontend.onrender.com
- Backend: https://industrybrain-ai.onrender.com

### 7. Security
- Passwords are hashed before storage.
- Protected API endpoints use authentication tokens.
- API keys should be stored in environment variables.
- Sensitive credentials should never be committed to GitHub.

### 8. Future Enhancements
- Improved document management
- Support for additional document formats
- Enhanced search and retrieval
- Better error handling and user experience
