import { useEffect, useState } from "react";
import {
  Search as SearchIcon,
  Sparkles,
  FileText,
  BrainCircuit,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Zap,
  Database,
  XCircle,
} from "lucide-react";

import { semanticSearch } from "../services/api";
import Navbar from "../components/Navbar";
import "./Search.css";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filename, setFilename] = useState(
    localStorage.getItem("industrybrain_filename") || ""
  );

  useEffect(() => {
    const updateDocument = () => {
      setFilename(
        localStorage.getItem("industrybrain_filename") || ""
      );
      setResults([]);
      setQuery("");
      setError("");
    };

    window.addEventListener(
      "industrybrain_document_changed",
      updateDocument
    );

    window.addEventListener("storage", updateDocument);

    return () => {
      window.removeEventListener(
        "industrybrain_document_changed",
        updateDocument
      );

      window.removeEventListener("storage", updateDocument);
    };
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    if (!filename) {
      setError("Please upload a document first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResults([]);

      const data = await semanticSearch(
        query.trim(),
        filename
      );

      setResults(data.results || []);
    } catch (err) {
      setError(
        err.message || "Semantic search failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      handleSearch();
    }
  };

  const openChat = () => {
    window.location.href = "/chat";
  };

  const useExample = (text) => {
    setQuery(text);
    setError("");
  };

  return (
    <div className="search-page">
      <Navbar />

      <main className="search-main">

        {/* HERO */}
        <section className="search-hero">
          <div className="search-hero-copy">
            <div className="search-label">
              <Sparkles size={13} />
              AI-POWERED SEARCH
            </div>

            <h1>
              Search your documents
              <span> intelligently.</span>
            </h1>

            <p>
              Find relevant information from your uploaded documents
              using semantic AI search. Ask naturally and let
              IndustryBrain AI find the right context.
            </p>
          </div>

          <div className="search-hero-status">
            <div className="search-hero-status-icon">
              <BrainCircuit size={20} />
            </div>

            <div>
              <strong>Semantic Intelligence</strong>
              <span>Meaning-aware document search</span>
            </div>

            <div className="search-live">
              <i />
              Active
            </div>
          </div>
        </section>

        {/* SEARCH PANEL */}
        <section className="search-panel">

          <div className="search-panel-header">
            <div className="search-panel-title">
              <div className="search-panel-icon">
                <SearchIcon size={19} />
              </div>

              <div>
                <h2>Semantic Search</h2>
                <p>
                  Search by meaning, not just keywords.
                </p>
              </div>
            </div>

            <div className="search-status">
              <span className="status-dot" />
              AI Search Active
            </div>
          </div>

          <div className="search-box">
            <div className="search-icon">
              <SearchIcon size={22} />
            </div>

            <input
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask something about your document..."
              aria-label="Search your document"
            />

            {query && (
              <button
                type="button"
                className="clear-search"
                onClick={() => {
                  setQuery("");
                  setError("");
                }}
                aria-label="Clear search"
              >
                <XCircle size={17} />
              </button>
            )}

            <button
              className="search-submit"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="search-loader" />
                  Searching...
                </>
              ) : (
                <>
                  Search
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>

          <div className="search-examples">
            <span>Try asking:</span>

            <button
              onClick={() =>
                useExample("What is this document about?")
              }
            >
              What is this document about?
            </button>

            <button
              onClick={() =>
                useExample("Explain the main concepts")
              }
            >
              Explain the main concepts
            </button>

            <button
              onClick={() =>
                useExample("Show important information")
              }
            >
              Show important information
            </button>
          </div>

          {filename ? (
            <div className="search-document">
              <div className="document-icon">
                <FileText size={19} />
              </div>

              <div>
                <small>SEARCHING IN</small>
                <strong>{filename}</strong>
              </div>

              <div className="document-ready">
                <CheckCircle2 size={14} />
                Ready
              </div>
            </div>
          ) : (
            <div className="search-document search-no-document">
              <div className="document-icon">
                <Database size={18} />
              </div>

              <div>
                <small>KNOWLEDGE BASE</small>
                <strong>No document selected</strong>
              </div>
            </div>
          )}
        </section>

        {/* ERROR */}
        {error && (
          <div className="search-error">
            <XCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        {/* RESULTS */}
        {results.length > 0 && (
          <section className="search-results">

            <div className="results-header">
              <div>
                <div className="search-label">
                  <Sparkles size={13} />
                  SEARCH RESULTS
                </div>

                <h2>Relevant Information</h2>

                <p>
                  Found {results.length} relevant sections
                  from your document.
                </p>
              </div>

              <button
                className="open-chat-button"
                onClick={openChat}
              >
                <MessageSquare size={16} />
                Ask AI about this document
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="results-list">
              {results.map((result, index) => (
                <div
                  className="result-card"
                  key={index}
                >
                  <div className="result-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="result-content">
                    <div className="result-card-heading">
                      <span>RELEVANT CONTEXT</span>
                      <Sparkles size={14} />
                    </div>

                    <p>{result.text}</p>

                    <div className="result-meta">
                      <span>
                        <CheckCircle2 size={11} />
                        Semantic Match
                      </span>

                      <span>
                        Distance:{" "}
                        {Number(
                          result.distance
                        ).toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </section>
        )}

        {/* EMPTY / FEATURES */}
        {!loading &&
          !error &&
          results.length === 0 && (
            <section className="search-features">

              <div className="features-intro">
                <div className="search-label">
                  <Zap size={13} />
                  POWERFUL DOCUMENT INTELLIGENCE
                </div>

                <h2>
                  Go beyond traditional search
                </h2>

                <p>
                  IndustryBrain AI understands the meaning
                  behind your questions and retrieves the
                  most relevant information from your documents.
                </p>
              </div>

              <div className="feature-grid">

                <div className="feature-card">
                  <div className="feature-icon">
                    <BrainCircuit size={21} />
                  </div>

                  <h3>Semantic Understanding</h3>

                  <p>
                    Search using natural language.
                    IndustryBrain AI finds information
                    based on meaning and context.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <SearchIcon size={21} />
                  </div>

                  <h3>Relevant Results</h3>

                  <p>
                    Get the most relevant sections of
                    your document instead of manually
                    searching through pages.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <MessageSquare size={21} />
                  </div>

                  <h3>Ask AI</h3>

                  <p>
                    Found something interesting?
                    Continue the conversation and ask
                    AI questions about your document.
                  </p>
                </div>

              </div>

              <div className="search-tip">
                <div className="tip-icon">
                  <Lightbulb size={20} />
                </div>

                <div>
                  <strong>Search tip</strong>

                  <p>
                    Try asking a complete question instead
                    of entering only a single keyword.
                  </p>
                </div>
              </div>

            </section>
          )}

      </main>
    </div>
  );
}

export default Search;
