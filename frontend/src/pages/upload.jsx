import { useState } from "react";
import {
  UploadCloud,
  FileText,
  X,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
  BrainCircuit,
  FileCheck2,
} from "lucide-react";

import {
  uploadDocument,
  extractDocument,
  indexDocument,
} from "../services/api";

import Navbar from "../components/Navbar";
import "./Upload.css";

function Upload() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setMessage("File size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
    setMessage("");
    setExtractedText("");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const droppedFile = event.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleBrowse = (event) => {
    const selectedFile = event.target.files[0];
    handleFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setMessage("");
    setExtractedText("");

    localStorage.removeItem("industrybrain_filename");

    window.dispatchEvent(
      new Event("industrybrain_document_changed")
    );
  };

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setMessage("");
      setExtractedText("");

      const uploadResult = await uploadDocument(file);

      setMessage("Document uploaded. Extracting text...");

      const filename = uploadResult.filename;

      localStorage.setItem(
        "industrybrain_filename",
        filename
      );

      window.dispatchEvent(
        new Event("industrybrain_document_changed")
      );

      const extractionResult =
        await extractDocument(filename);

      await indexDocument(filename);

      if (extractionResult.characters > 0) {
        setExtractedText(extractionResult.text);

        setMessage(
          `Document processed successfully. ${extractionResult.characters} characters extracted.`
        );
      } else {
        setMessage(
          "Document uploaded, but no readable text was found in this document."
        );
      }
    } catch (error) {
      setMessage(
        error.message ||
          "Something went wrong while processing the document."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <Navbar />

      <main className="upload-main">
        <section className="upload-hero">
          <div className="upload-hero-copy">
            <span className="upload-label">
              <Sparkles size={13} />
              AI DOCUMENT ANALYSIS
            </span>

            <h1>
              Turn documents into
              <span> intelligent knowledge.</span>
            </h1>

            <p>
              Upload a document and let IndustryBrain AI extract,
              index, search and analyze the information inside it.
            </p>
          </div>

          <div className="upload-status-card">
            <div className="upload-status-icon">
              <BrainCircuit size={20} />
            </div>

            <div>
              <strong>IndustryBrain AI</strong>
              <span>Knowledge engine ready</span>
            </div>

            <div className="status-live">
              <i />
              Live
            </div>
          </div>
        </section>

        <section
          className={`upload-dropzone ${dragging ? "dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="upload-zone-glow" />

          <div className="upload-icon">
            <UploadCloud size={34} strokeWidth={1.7} />
          </div>

          <span className="upload-zone-eyebrow">
            KNOWLEDGE INGESTION
          </span>

          <h2>Drag & drop your document here</h2>

          <p>
            Or choose a file from your computer to begin analysis.
          </p>

          <label className="browse-button">
            <UploadCloud size={16} />
            Browse Files

            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleBrowse}
              hidden
            />
          </label>

          <div className="upload-formats">
            <span>PDF</span>
            <span>DOCX</span>
            <span>TXT</span>
            <b>Up to 10 MB</b>
          </div>
        </section>

        {file && (
          <section className="selected-file">
            <div className="file-icon">
              <FileText size={21} />
            </div>

            <div className="file-details">
              <strong>{file.name}</strong>
              <span>
                {(file.size / 1024 / 1024).toFixed(2)} MB
                <em>•</em>
                Ready for analysis
              </span>
            </div>

            <div className="file-ready">
              <CheckCircle2 size={16} />
              Ready
            </div>

            <button
              className="remove-file"
              onClick={removeFile}
              disabled={uploading}
              aria-label="Remove selected file"
            >
              <X size={17} />
            </button>
          </section>
        )}

        {file && (
          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={uploading}
          >
            <span>
              {uploading ? "Processing document..." : "Analyze Document"}
            </span>

            {uploading ? (
              <span className="button-loader" />
            ) : (
              <ArrowRight size={19} />
            )}
          </button>
        )}

        {message && (
          <div
            className={`upload-message ${
              message.includes("successfully") ? "success" : ""
            }`}
          >
            {message.includes("successfully") ? (
              <CheckCircle2 size={17} />
            ) : (
              <FileCheck2 size={17} />
            )}
            <span>{message}</span>
          </div>
        )}

        {extractedText && (
          <section className="extracted-text">
            <div className="extracted-header">
              <div>
                <span className="upload-label">
                  <CheckCircle2 size={13} />
                  EXTRACTION COMPLETE
                </span>

                <h3>Extracted Document Text</h3>
              </div>

              <span className="character-count">
                {extractedText.length.toLocaleString()} characters
              </span>
            </div>

            <div className="text-preview">
              {extractedText}
            </div>
          </section>
        )}

        <section className="upload-info">
          <div className="info-item">
            <div className="info-icon purple">
              <Sparkles size={18} />
            </div>

            <div>
              <strong>Smart Analysis</strong>
              <p>
                Extract meaningful information from your uploaded files.
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon cyan">
              <BrainCircuit size={18} />
            </div>

            <div>
              <strong>Ask AI</strong>
              <p>
                Ask questions and get grounded answers from your documents.
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon blue">
              <Search size={18} />
            </div>

            <div>
              <strong>Semantic Search</strong>
              <p>
                Find relevant information by meaning, not just keywords.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Upload;
