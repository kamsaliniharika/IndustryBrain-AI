import { useEffect, useState } from "react";
import {
  getDocuments,
  deleteDocument,
  extractDocument,
} from "../services/api";

import {
  FileText,
  Database,
  Sparkles,
  Upload,
  Search,
  MessageSquare,
  Eye,
  Trash2,
  ArrowUpRight,
  CheckCircle2,
  X,
  FileSearch,
} from "lucide-react";

import Navbar from "../components/Navbar";
import "./Documents.css";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");
  const [previewing, setPreviewing] = useState("");
  const [preview, setPreview] = useState(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const openChat = (filename) => {
    localStorage.setItem("industrybrain_filename", filename);

    window.dispatchEvent(
      new Event("industrybrain_document_changed")
    );

    window.location.href = "/chat";
  };

  const handlePreview = async (filename) => {
    try {
      setPreviewing(filename);
      setError("");

      const data = await extractDocument(filename);

      setPreview({
        filename,
        text: data.text || "",
      });
    } catch (err) {
      setError(err.message || "Failed to preview document.");
    } finally {
      setPreviewing("");
    }
  };

  const closePreview = () => {
    setPreview(null);
  };

  const handleDelete = async (filename) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(filename);
      setError("");

      await deleteDocument(filename);

      setDocuments((currentDocuments) =>
        currentDocuments.filter(
          (document) => document.filename !== filename
        )
      );

      const selectedDocument = localStorage.getItem(
        "industrybrain_filename"
      );

      if (selectedDocument === filename) {
        localStorage.removeItem("industrybrain_filename");

        window.dispatchEvent(
          new Event("industrybrain_document_changed")
        );
      }
    } catch (err) {
      setError(err.message || "Failed to delete document.");
    } finally {
      setDeleting("");
    }
  };

  const totalChunks = documents.reduce(
    (total, document) => total + (document.chunks || 0),
    0
  );

  return (
    <div className="documents-page">
      <Navbar />

      <main className="dashboard-main">

        {/* Dashboard Hero */}
        <section className="dashboard-hero">

          <div>
            <div className="dashboard-eyebrow">
              <Sparkles size={14} />
              AI DOCUMENT WORKSPACE
            </div>

            <h1>
              Your knowledge,
              <span> intelligently organized.</span>
            </h1>

            <p>
              Manage your documents, search information,
              and ask AI questions from one intelligent workspace.
            </p>
          </div>

          <a href="/upload" className="dashboard-upload-btn">
            <Upload size={17} />
            Upload Document
            <ArrowUpRight size={16} />
          </a>

        </section>

        {/* Error */}
        {error && (
          <div className="dashboard-error">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stats */}
        <section className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon purple">
              <FileText size={21} />
            </div>

            <div>
              <span>Total Documents</span>
              <strong>{loading ? "—" : documents.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cyan">
              <Database size={21} />
            </div>

            <div>
              <span>Indexed Content</span>
              <strong>
                {loading ? "—" : totalChunks}
              </strong>
              <small>chunks available</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Sparkles size={21} />
            </div>

            <div>
              <span>AI Search</span>
              <strong className="active-text">
                ACTIVE
              </strong>
              <small>semantic intelligence</small>
            </div>
          </div>

        </section>

        {/* Quick Actions */}
        <section className="quick-actions">

          <a href="/upload" className="quick-card">
            <div className="quick-icon purple">
              <Upload size={19} />
            </div>

            <div>
              <strong>Upload</strong>
              <span>Add a new document</span>
            </div>

            <ArrowUpRight size={17} />
          </a>

          <a href="/search" className="quick-card">
            <div className="quick-icon cyan">
              <Search size={19} />
            </div>

            <div>
              <strong>Semantic Search</strong>
              <span>Find relevant information</span>
            </div>

            <ArrowUpRight size={17} />
          </a>

          <a href="/chat" className="quick-card">
            <div className="quick-icon blue">
              <MessageSquare size={19} />
            </div>

            <div>
              <strong>Ask AI</strong>
              <span>Chat with your documents</span>
            </div>

            <ArrowUpRight size={17} />
          </a>

        </section>

        {/* Documents */}
        <section className="documents-section">

          <div className="section-heading">

            <div>
              <span className="section-kicker">
                KNOWLEDGE BASE
              </span>

              <h2>Recent Documents</h2>

              <p>
                Your uploaded documents and indexed knowledge.
              </p>
            </div>

            {documents.length > 0 && (
              <span className="document-count">
                {documents.length}{" "}
                {documents.length === 1
                  ? "document"
                  : "documents"}
              </span>
            )}

          </div>

          {loading && (
            <div className="dashboard-empty">
              <div className="loading-spinner"></div>
              <h3>Loading your documents</h3>
              <p>
                Preparing your AI knowledge workspace...
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            documents.length === 0 && (
              <div className="dashboard-empty">

                <div className="empty-dashboard-icon">
                  <FileSearch size={30} />
                </div>

                <h3>Your knowledge base is empty</h3>

                <p>
                  Upload your first PDF, DOCX, or TXT file
                  to start using IndustryBrain AI.
                </p>

                <a
                  href="/upload"
                  className="empty-upload-btn"
                >
                  <Upload size={17} />
                  Upload your first document
                </a>

              </div>
            )}

          {!loading &&
            !error &&
            documents.length > 0 && (
              <div className="documents-table">

                <div className="table-header">
                  <span>DOCUMENT</span>
                  <span>CONTENT</span>
                  <span>SIZE</span>
                  <span>STATUS</span>
                  <span>ACTIONS</span>
                </div>

                {documents.map((document) => (

                  <div
                    className="document-row"
                    key={document.filename}
                  >

                    <div className="document-name-cell">

                      <div className="document-main-icon">
                        <FileText size={20} />
                      </div>

                      <div>
                        <strong>
                          {document.filename}
                        </strong>

                        <span>
                          AI-ready document
                        </span>
                      </div>

                    </div>

                    <div className="table-value">
                      <strong>
                        {document.chunks || 0}
                      </strong>
                      <span>chunks</span>
                    </div>

                    <div className="table-value">
                      <strong>
                        {(
                          document.size /
                          1024 /
                          1024
                        ).toFixed(2)}
                      </strong>
                      <span>MB</span>
                    </div>

                    <div>
                      <span className="indexed-badge">
                        <CheckCircle2 size={13} />
                        Indexed
                      </span>
                    </div>

                    <div className="row-actions">

                      <button
                        className="row-preview"
                        onClick={() =>
                          handlePreview(
                            document.filename
                          )
                        }
                        disabled={
                          previewing ===
                          document.filename
                        }
                        title="Preview document"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="row-chat"
                        onClick={() =>
                          openChat(
                            document.filename
                          )
                        }
                        title="Open AI chat"
                      >
                        <MessageSquare size={16} />
                      </button>

                      <button
                        className="row-delete"
                        onClick={() =>
                          handleDelete(
                            document.filename
                          )
                        }
                        disabled={
                          deleting ===
                          document.filename
                        }
                        title="Delete document"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}

        </section>

        {/* Bottom AI Banner */}
        <section className="ai-dashboard-banner">

          <div className="ai-banner-icon">
            <Sparkles size={23} />
          </div>

          <div>
            <span>INDUSTRYBRAIN AI</span>
            <h3>
              Turn your documents into an intelligent
              knowledge base.
            </h3>
          </div>

          <a href="/chat">
            Ask AI
            <ArrowUpRight size={16} />
          </a>

        </section>

        {/* Preview Modal */}
        {preview && (
          <div
            className="document-preview-overlay"
            onClick={closePreview}
          >
            <div
              className="document-preview-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="document-preview-header">

                <div>
                  <span className="upload-label">
                    DOCUMENT PREVIEW
                  </span>

                  <h2>
                    {preview.filename}
                  </h2>
                </div>

                <button
                  className="document-preview-close"
                  onClick={closePreview}
                >
                  <X size={18} />
                </button>

              </div>

              <div className="document-preview-content">

                {preview.text ? (
                  <pre>{preview.text}</pre>
                ) : (
                  <p>
                    No text could be extracted from
                    this document.
                  </p>
                )}

              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Documents;