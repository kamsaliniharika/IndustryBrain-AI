import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  FileText,
  Send,
  Trash2,
  Search,
  MessageSquare,
  BookOpen,
  ShieldCheck,
  Lightbulb,
  X,
  BarChart3,
  Eye,
  Upload,
  ChevronRight,
  CheckCircle2,
  BrainCircuit,
  FileSearch,
  TrendingUp,
  Zap,
  Lock,
} from "lucide-react";

import { semanticSearch, askGemini } from "../services/api";
import Navbar from "../components/Navbar";
import "./Chat.css";

function Chat() {
  const [filename, setFilename] = useState(
    localStorage.getItem("industrybrain_filename") || ""
  );

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef(null);

  /* -----------------------------------------
     DOCUMENT CHANGE LISTENER
  ----------------------------------------- */

  useEffect(() => {
    const updateDocument = () => {
      const newFilename =
        localStorage.getItem("industrybrain_filename") || "";

      setFilename(newFilename);
      setMessages([]);
      setSearchResults([]);
      setQuestion("");
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

  /* -----------------------------------------
     AUTO SCROLL
  ----------------------------------------- */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* -----------------------------------------
     ASK AI
  ----------------------------------------- */

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    if (!filename) {
      setError("Please upload and index a document first.");
      return;
    }

    const currentQuestion = question.trim();

    try {
      setLoading(true);
      setError("");

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: currentQuestion,
        },
      ]);

      setQuestion("");

      const searchData = await semanticSearch(
        currentQuestion,
        filename
      );

      setSearchResults(searchData.results || []);

      const answerData = await askGemini(
        currentQuestion,
        filename
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            answerData.answer ||
            "I couldn't generate an answer.",
        },
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while generating the answer."
      );
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------
     ENTER KEY
  ----------------------------------------- */

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !loading
    ) {
      event.preventDefault();
      handleAsk();
    }
  };

  /* -----------------------------------------
     CLEAR CHAT
  ----------------------------------------- */

  const clearChat = () => {
    setMessages([]);
    setSearchResults([]);
    setError("");
  };

  /* -----------------------------------------
     SUGGESTIONS
  ----------------------------------------- */

  const suggestions = [
    {
      icon: <FileText size={17} />,
      text: "What is this document about?",
    },
    {
      icon: <Lightbulb size={17} />,
      text: "Explain the main concepts",
    },
    {
      icon: <BookOpen size={17} />,
      text: "Summarize the important points",
    },
  ];

  const useSuggestion = (text) => {
    setQuestion(text);
  };

  /* -----------------------------------------
     NAVIGATION
  ----------------------------------------- */

  const goTo = (path) => {
    window.location.href = path;
  };

  /* -----------------------------------------
     UI
  ----------------------------------------- */

  return (
    <div className="chat-page">
      <Navbar />

      <main className="ai-chat-main">

        {/* =====================================
            HERO
        ===================================== */}

        <section className="ai-chat-header">

          <div className="ai-chat-heading">

            <div className="ai-chat-kicker">
              <Sparkles size={14} />
              AI DOCUMENT ASSISTANT
            </div>

            <h1>
              Ask your documents
              <span> anything.</span>
            </h1>

            <p>
              Get instant, accurate answers from your
              documents using the power of AI.
            </p>

            <div className="chat-trust-pills">

              <div className="chat-trust-pill">
                <Sparkles size={15} />
                Powered by Gemini AI
              </div>

              <div className="chat-trust-pill">
                <Search size={15} />
                Semantic Search
              </div>

              <div className="chat-trust-pill">
                <ShieldCheck size={15} />
                100% Private & Secure
              </div>

            </div>

          </div>

          {/* HERO VISUAL */}

          <div className="chat-hero-visual">

            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="hero-file hero-pdf">
              <FileText size={20} />
              <span>PDF</span>
            </div>

            <div className="hero-file hero-docx">
              <FileText size={20} />
              <span>DOCX</span>
            </div>

            <div className="hero-file hero-xlsx">
              <BarChart3 size={20} />
              <span>XLSX</span>
            </div>

            <div className="hero-brain">
              <BrainCircuit size={42} />
            </div>

            <div className="hero-insight-card">
              <Sparkles size={15} />

              <div>
                <strong>Insights</strong>
                <span>Answers from your documents</span>
              </div>
            </div>

          </div>

        </section>


        {/* =====================================
            WORKSPACE
        ===================================== */}

        <section className="chat-workspace">

          {/* ===================================
              MAIN COLUMN
          =================================== */}

          <div className="chat-workspace-main">

            {/* ACTIVE DOCUMENT */}

            <div className="active-document">

              <div className="active-document-left">

                <div className="active-file-icon">
                  <FileText size={21} />
                </div>

                <div className="active-document-info">

                  <span>ACTIVE DOCUMENT</span>

                  <strong>
                    {filename || "No document selected"}
                  </strong>

                </div>

              </div>

              <div className="active-document-meta">

                {filename && (
                  <span className="indexed-status">
                    Indexed
                  </span>
                )}

                <div
                  className={
                    filename
                      ? "document-status ready"
                      : "document-status"
                  }
                >
                  <span />
                  {filename
                    ? "Ready for questions"
                    : "Upload a document"}
                </div>

                <button
                  className="change-document"
                  onClick={() => goTo("/documents")}
                >
                  Change
                </button>

              </div>

            </div>


            {/* CHAT PANEL */}

            <div className="ai-chat-panel">

              {/* PANEL HEADER */}

              <div className="ai-chat-panel-header">

                <div className="ai-chat-agent">

                  <div className="agent-avatar">
                    <BrainCircuit size={20} />
                  </div>

                  <div>
                    <h2>IndustryBrain AI</h2>

                    <span>
                      Your intelligent document assistant
                    </span>
                  </div>

                </div>

                {messages.length > 0 && (
                  <button
                    className="clear-chat-btn"
                    onClick={clearChat}
                  >
                    <Trash2 size={14} />
                    Clear Chat
                  </button>
                )}

              </div>


              {/* CHAT BODY */}

              <div className="ai-chat-body">

                {messages.length === 0 && !loading ? (

                  <div className="chat-welcome">

                    <div className="chat-welcome-icon">
                      <Sparkles size={28} />
                    </div>

                    <h3>
                      👋 Hello! I'm IndustryBrain AI.
                    </h3>

                    <p>
                      Ask me anything about your document.
                      I'll search the most relevant sections
                      and give you accurate, context-aware
                      answers.
                    </p>

                    <div className="suggestions">

                      {suggestions.map(
                        (suggestion, index) => (

                          <button
                            key={index}
                            onClick={() =>
                              useSuggestion(
                                suggestion.text
                              )
                            }
                          >

                            <span>
                              {suggestion.icon}
                            </span>

                            <strong>
                              {suggestion.text}
                            </strong>

                          </button>

                        )
                      )}

                    </div>

                  </div>

                ) : (

                  <div className="messages-list">

                    {messages.map(
                      (message, index) => (

                        <div
                          className={`chat-message ${message.role}`}
                          key={index}
                        >

                          {message.role ===
                            "assistant" && (

                            <div className="assistant-avatar">
                              <Sparkles size={15} />
                            </div>

                          )}

                          <div className="message-wrapper">

                            <span className="message-role">

                              {message.role === "user"
                                ? "You"
                                : "IndustryBrain AI"}

                            </span>

                            <div className="message-bubble">
                              {message.text}
                            </div>

                          </div>

                        </div>

                      )
                    )}

                    {loading && (

                      <div className="chat-message assistant">

                        <div className="assistant-avatar">
                          <Sparkles size={15} />
                        </div>

                        <div className="message-wrapper">

                          <span className="message-role">
                            IndustryBrain AI
                          </span>

                          <div className="message-bubble typing">

                            <span />
                            <span />
                            <span />

                          </div>

                        </div>

                      </div>

                    )}

                    <div ref={chatEndRef} />

                  </div>

                )}

              </div>


              {/* RETRIEVED CONTEXT */}

              {searchResults.length > 0 && (

                <div className="retrieved-context">

                  <div className="context-heading">

                    <div>

                      <span>
                        RETRIEVED CONTEXT
                      </span>

                      <h3>
                        Relevant document sections
                      </h3>

                    </div>

                    <div className="context-count">
                      {searchResults.length} sections
                    </div>

                  </div>

                  <div className="context-list">

                    {searchResults.map(
                      (result, index) => (

                        <div
                          className="context-item"
                          key={index}
                        >

                          <div className="context-index">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          <div className="context-content">

                            <p>
                              {result.text}
                            </p>

                            <span>
                              Semantic distance{" "}
                              {Number(
                                result.distance
                              ).toFixed(4)}
                            </span>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* ERROR */}

              {error && (

                <div className="chat-error">

                  <span>!</span>

                  <p>{error}</p>

                  <button
                    onClick={() => setError("")}
                  >
                    <X size={14} />
                  </button>

                </div>

              )}


              {/* COMPOSER */}

              <div className="chat-composer">

                <div className="composer-attachment">
                  <Search size={18} />
                </div>

                <textarea
                  value={question}
                  onChange={(event) =>
                    setQuestion(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={
                    filename
                      ? "Ask anything about your document..."
                      : "Upload a document first..."
                  }
                  disabled={!filename || loading}
                  rows="1"
                />

                <button
                  className="ask-ai-btn"
                  onClick={handleAsk}
                  disabled={
                    !filename ||
                    !question.trim() ||
                    loading
                  }
                >

                  {loading ? (
                    "Thinking..."
                  ) : (
                    <>
                      Send
                      <Send size={15} />
                    </>
                  )}

                </button>

              </div>

              <div className="composer-hint">
                Press Enter to send&nbsp; • &nbsp;
                Shift + Enter for a new line
              </div>

            </div>


            {/* =================================
                EXPLORE FEATURES
            ================================= */}

            <section className="explore-section">

              <div className="explore-heading">

                <div>
                  <h2>
                    Explore What You Can Do
                  </h2>

                  <p>
                    Powerful features to get the most
                    from your documents
                  </p>
                </div>

                <div className="explore-arrows">

                  <button>
                    ‹
                  </button>

                  <button>
                    ›
                  </button>

                </div>

              </div>


              <div className="explore-grid">

                {/* ASK */}

                <div className="explore-card blue">

                  <div className="explore-icon">
                    <MessageSquare size={20} />
                  </div>

                  <div className="explore-card-content">

                    <h3>
                      Ask Questions
                    </h3>

                    <p>
                      Get instant answers in natural
                      language
                    </p>

                  </div>

                  <div className="explore-arrow">
                    <ChevronRight size={17} />
                  </div>

                </div>


                {/* SEARCH */}

                <div className="explore-card purple">

                  <div className="explore-icon">
                    <FileSearch size={20} />
                  </div>

                  <div className="explore-card-content">

                    <h3>
                      Find Information
                    </h3>

                    <p>
                      Search and discover key insights
                      across your document
                    </p>

                  </div>

                  <div className="explore-arrow">
                    <ChevronRight size={17} />
                  </div>

                </div>


                {/* SUMMARY */}

                <div className="explore-card green">

                  <div className="explore-icon">
                    <FileText size={20} />
                  </div>

                  <div className="explore-card-content">

                    <h3>
                      Generate Summaries
                    </h3>

                    <p>
                      Get concise summaries of complex
                      content
                    </p>

                  </div>

                  <div className="explore-arrow">
                    <ChevronRight size={17} />
                  </div>

                </div>


                {/* INSIGHTS */}

                <div className="explore-card orange">

                  <div className="explore-icon">
                    <Lightbulb size={20} />
                  </div>

                  <div className="explore-card-content">

                    <h3>
                      Extract Insights
                    </h3>

                    <p>
                      Discover important information
                      and key takeaways
                    </p>

                  </div>

                  <div className="explore-arrow">
                    <ChevronRight size={17} />
                  </div>

                </div>

              </div>

              <div className="explore-dots">

                <span className="active" />
                <span />
                <span />

              </div>

            </section>

          </div>


          {/* ===================================
              RIGHT SIDEBAR
          =================================== */}

          <aside className="chat-right-sidebar">

            {/* DOCUMENT INSIGHTS */}

            <div className="side-card">

              <div className="side-card-header">

                <div className="side-title">

                  <div className="side-title-icon green">
                    <BarChart3 size={18} />
                  </div>

                  <strong>
                    Document Insights
                  </strong>

                </div>

                <ChevronRight size={17} />

              </div>


              <div className="insight-stat">

                <div className="insight-icon purple">
                  <FileText size={17} />
                </div>

                <div>
                  <strong>
                    {searchResults.length > 0
                      ? searchResults.length
                      : "—"}
                  </strong>

                  <span>
                    Relevant Sections
                  </span>
                </div>

              </div>


              <div className="insight-stat">

                <div className="insight-icon blue">
                  <BookOpen size={17} />
                </div>

                <div>
                  <strong>
                    {filename ? "Indexed" : "—"}
                  </strong>

                  <span>
                    Document Status
                  </span>
                </div>

              </div>


              <div className="insight-stat">

                <div className="insight-icon cyan">
                  <TrendingUp size={17} />
                </div>

                <div>
                  <strong>
                    {searchResults.length
                      ? "Active"
                      : "Ready"}
                  </strong>

                  <span>
                    Semantic Search
                  </span>
                </div>

              </div>


              <div className="insight-stat">

                <div className="insight-icon green">
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <strong className="ready-text">
                    Ready
                  </strong>

                  <span>
                    For AI Questions
                  </span>
                </div>

              </div>

            </div>


            {/* QUICK ACTIONS */}

            <div className="side-card quick-actions">

              <div className="side-card-header">

                <div className="side-title">

                  <div className="side-title-icon yellow">
                    <Zap size={18} />
                  </div>

                  <strong>
                    Quick Actions
                  </strong>

                </div>

                <ChevronRight size={17} />

              </div>


              <button
                type="button"
                className="quick-action"
                onClick={() => goTo("/documents")}
              >
                <Eye size={17} />
                <span>
                  View Document
                </span>
                <ChevronRight size={15} />
              </button>


              <button
                type="button"
                className="quick-action"
                onClick={() => goTo("/search")}
              >
                <Search size={17} />
                <span>
                  Search Content
                </span>
                <ChevronRight size={15} />
              </button>


              <button
                type="button"
                className="quick-action"
                onClick={() => goTo("/upload")}
              >
                <Upload size={17} />
                <span>
                  Upload New Document
                </span>
                <ChevronRight size={15} />
              </button>


              <button
                type="button"
                className="quick-action"
                onClick={() => goTo("/documents")}
              >
                <BarChart3 size={17} />
                <span>
                  View Analytics
                </span>
                <ChevronRight size={15} />
              </button>

            </div>


            {/* QUOTE */}

            <div className="chat-quote-card">

              <div className="quote-icon">
                “
              </div>

              <p>
                Turn your documents into knowledge.
              </p>

              <span>
                — IndustryBrain AI
              </span>

            </div>


            {/* SECURITY */}

            <div className="chat-security-card">

              <div className="security-icon">
                <Lock size={17} />
              </div>

              <div>
                <strong>
                  Your knowledge stays private
                </strong>

                <span>
                  Documents are isolated to your
                  account.
                </span>
              </div>

            </div>

          </aside>

        </section>

      </main>
    </div>
  );
}

export default Chat;
