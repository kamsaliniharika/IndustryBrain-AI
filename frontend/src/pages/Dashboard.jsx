import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  Database,
  Search,
  MessageSquare,
  Upload,
  ArrowUpRight,
  Sparkles,
  Brain,
  Activity,
  ChevronRight,
  FileSearch,
  Zap,
  ShieldCheck,
  Settings,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const userName =
    localStorage.getItem("industrybrain_user_name") || "there";

  const firstName = userName.split(" ")[0];

  return (
    <div className="dashboard-page">

      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="dashboard-sidebar">

        {/* BRAND */}
        <div
          className="dashboard-brand"
          onClick={() => navigate("/")}
        >
          <div className="dashboard-brand-icon">
            <Brain size={21} />
          </div>

          <div className="dashboard-brand-copy">
            <strong>IndustryBrain AI</strong>
            <span>Document Intelligence</span>
          </div>
        </div>

        {/* MENU */}
        <div className="sidebar-menu">

          {/* Dashboard */}
          <button
            type="button"
            className="sidebar-item active"
            onClick={() => navigate("/dashboard")}
          >
            <Brain size={18} />
            <span>Dashboard</span>
          </button>

          {/* Documents */}
          <button
            type="button"
            className="sidebar-item"
            onClick={() => navigate("/documents")}
          >
            <FileText size={18} />
            <span>Documents</span>
          </button>

          {/* Upload */}
          <button
            type="button"
            className="sidebar-item"
            onClick={() => navigate("/upload")}
          >
            <Upload size={18} />
            <span>Upload</span>
          </button>

          {/* Search */}
          <button
            type="button"
            className="sidebar-item"
            onClick={() => navigate("/search")}
          >
            <Search size={18} />
            <span>Search</span>
          </button>

          {/* Chat */}
          <button
            type="button"
            className="sidebar-item"
            onClick={() => navigate("/chat")}
          >
            <MessageSquare size={18} />
            <span>Chat</span>
          </button>

          {/* Analytics */}
          <button
            type="button"
            className="sidebar-item"
            onClick={() => {
              // Analytics page can be connected later
            }}
          >
            <Activity size={18} />
            <span>Analytics</span>
          </button>

          {/* SETTINGS — FIXED */}
          <button
            type="button"
            className="sidebar-item"
            onClick={() => navigate("/settings")}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>

        </div>

        {/* ================= SIDEBAR BOTTOM ================= */}
        <div className="sidebar-bottom">

          <div className="upgrade-card">

            <div className="upgrade-icon">
              <Sparkles size={20} />
            </div>

            <h4>Upgrade to Pro</h4>

            <p>
              Unlock more powerful AI features.
            </p>

            <div className="upgrade-feature">
              <ShieldCheck size={13} />
              Unlimited documents
            </div>

            <div className="upgrade-feature">
              <ShieldCheck size={13} />
              Advanced AI models
            </div>

            <div className="upgrade-feature">
              <ShieldCheck size={13} />
              Higher limits
            </div>

            <button
              type="button"
              className="upgrade-button"
            >
              Upgrade Now
              <ArrowUpRight size={15} />
            </button>

          </div>

          <div className="sidebar-version">

            <Brain size={14} />

            <div>
              <strong>IndustryBrain AI</strong>
              <span>v1.0.0</span>
            </div>

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="dashboard-main">

        {/* ================= HERO ================= */}
        <section className="dashboard-hero">

          <div className="dashboard-hero-content">

            <div className="dashboard-eyebrow">
              <span className="dashboard-eyebrow-dot"></span>
              AI Knowledge Workspace
            </div>

            <h1>
              Welcome back,{" "}
              <span>{firstName}</span>
            </h1>

            <p>
              Manage your knowledge base, search your documents,
              and interact with your information using AI.
            </p>

          </div>

          <div className="dashboard-ai-status">

            <div className="status-icon">
              <Sparkles size={19} />
            </div>

            <div>
              <strong>IndustryBrain AI</strong>
              <span>Knowledge engine ready</span>
            </div>

            <div className="status-live">
              <span></span>
              Live
            </div>

          </div>

        </section>

        {/* ================= OVERVIEW ================= */}
        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <span className="section-label">
                OVERVIEW
              </span>

              <h2>Your workspace</h2>
            </div>

            <span className="section-subtitle">
              Your AI-powered knowledge activity
            </span>

          </div>

          <div className="dashboard-stats">

            {/* TOTAL DOCUMENTS */}
            <div className="dashboard-stat-card">

              <div className="stat-top">

                <div className="stat-icon purple">
                  <FileText size={20} />
                </div>

                <ArrowUpRight size={17} />

              </div>

              <div className="stat-value">
                —
              </div>

              <div className="stat-title">
                Total Documents
              </div>

              <p>
                Documents in your knowledge base
              </p>

            </div>

            {/* KNOWLEDGE BASE */}
            <div className="dashboard-stat-card">

              <div className="stat-top">

                <div className="stat-icon cyan">
                  <Database size={20} />
                </div>

                <ArrowUpRight size={17} />

              </div>

              <div className="stat-value">
                Ready
              </div>

              <div className="stat-title">
                Knowledge Base
              </div>

              <p>
                Your indexed content is ready for AI search
              </p>

            </div>

            {/* SEMANTIC SEARCH */}
            <div className="dashboard-stat-card">

              <div className="stat-top">

                <div className="stat-icon blue">
                  <Search size={20} />
                </div>

                <ArrowUpRight size={17} />

              </div>

              <div className="stat-value">
                AI
              </div>

              <div className="stat-title">
                Semantic Search
              </div>

              <p>
                Find information by meaning, not just keywords
              </p>

            </div>

            {/* AI ASSISTANT */}
            <div className="dashboard-stat-card">

              <div className="stat-top">

                <div className="stat-icon green">
                  <MessageSquare size={20} />
                </div>

                <ArrowUpRight size={17} />

              </div>

              <div className="stat-value">
                Active
              </div>

              <div className="stat-title">
                AI Assistant
              </div>

              <p>
                Ask questions across your documents
              </p>

            </div>

          </div>

        </section>

        {/* ================= MAIN GRID ================= */}
        <section className="dashboard-content-grid">

          {/* KNOWLEDGE BASE */}
          <div className="dashboard-panel knowledge-panel">

            <div className="panel-header">

              <div className="panel-heading">

                <div className="panel-icon purple">
                  <Database size={18} />
                </div>

                <div>
                  <h3>Knowledge Base</h3>
                  <span>
                    Your document intelligence layer
                  </span>
                </div>

              </div>

              <button
                type="button"
                className="panel-link"
                onClick={() => navigate("/documents")}
              >
                View all
                <ChevronRight size={15} />
              </button>

            </div>

            <div className="knowledge-visual">

              <div className="knowledge-orbit orbit-one"></div>
              <div className="knowledge-orbit orbit-two"></div>

              <div className="knowledge-core">
                <Brain size={30} />
                <span>AI</span>
              </div>

              <div className="knowledge-node node-one">
                <FileText size={17} />
              </div>

              <div className="knowledge-node node-two">
                <FileSearch size={17} />
              </div>

              <div className="knowledge-node node-three">
                <Database size={17} />
              </div>

              <div className="knowledge-node node-four">
                <MessageSquare size={17} />
              </div>

            </div>

            <div className="knowledge-footer">

              <div>
                <strong>
                  Documents → AI
                </strong>

                <span>
                  Upload documents and let IndustryBrain AI
                  turn them into searchable knowledge.
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/upload")}
                className="small-action"
              >
                <Upload size={15} />
                Add document
              </button>

            </div>

          </div>

          {/* QUICK ACTIONS */}
          <div className="dashboard-panel actions-panel">

            <div className="panel-header">

              <div className="panel-heading">

                <div className="panel-icon yellow">
                  <Zap size={18} />
                </div>

                <div>
                  <h3>Quick Actions</h3>
                  <span>
                    Jump into your workspace
                  </span>
                </div>

              </div>

            </div>

            <div className="dashboard-actions">

              <button
                type="button"
                onClick={() => navigate("/upload")}
                className="dashboard-action"
              >
                <div className="action-icon purple">
                  <Upload size={18} />
                </div>

                <div className="action-text">
                  <strong>
                    Upload Document
                  </strong>

                  <span>
                    Add PDF, DOCX, TXT and more
                  </span>
                </div>

                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/search")}
                className="dashboard-action"
              >
                <div className="action-icon cyan">
                  <Search size={18} />
                </div>

                <div className="action-text">
                  <strong>
                    Search Knowledge
                  </strong>

                  <span>
                    Find information using AI search
                  </span>
                </div>

                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/chat")}
                className="dashboard-action"
              >
                <div className="action-icon blue">
                  <MessageSquare size={18} />
                </div>

                <div className="action-text">
                  <strong>
                    Ask IndustryBrain AI
                  </strong>

                  <span>
                    Ask questions about your documents
                  </span>
                </div>

                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/documents")}
                className="dashboard-action"
              >
                <div className="action-icon green">
                  <FileText size={18} />
                </div>

                <div className="action-text">
                  <strong>
                    View Documents
                  </strong>

                  <span>
                    Manage your knowledge base
                  </span>
                </div>

                <ChevronRight size={17} />
              </button>

            </div>

          </div>

        </section>

        {/* ================= LOWER GRID ================= */}
        <section className="dashboard-lower-grid">

          {/* AI INTELLIGENCE */}
          <div className="dashboard-panel insights-panel">

            <div className="panel-header">

              <div className="panel-heading">

                <div className="panel-icon cyan">
                  <Sparkles size={18} />
                </div>

                <div>
                  <h3>AI Intelligence</h3>
                  <span>
                    What IndustryBrain can do
                  </span>
                </div>

              </div>

            </div>

            <div className="insight-items">

              <div className="insight-item">

                <div className="insight-number">
                  01
                </div>

                <div>
                  <strong>
                    Understand Documents
                  </strong>

                  <p>
                    Extract meaningful information from
                    your uploaded files.
                  </p>
                </div>

              </div>

              <div className="insight-item">

                <div className="insight-number">
                  02
                </div>

                <div>
                  <strong>
                    Find Information
                  </strong>

                  <p>
                    Search your knowledge base using
                    natural language.
                  </p>
                </div>

              </div>

              <div className="insight-item">

                <div className="insight-number">
                  03
                </div>

                <div>
                  <strong>
                    Ask Questions
                  </strong>

                  <p>
                    Get AI-powered answers grounded in
                    your documents.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* WORKSPACE STATUS */}
          <div className="dashboard-panel activity-panel">

            <div className="panel-header">

              <div className="panel-heading">

                <div className="panel-icon green">
                  <Activity size={18} />
                </div>

                <div>
                  <h3>
                    Workspace Status
                  </h3>

                  <span>
                    System overview
                  </span>
                </div>

              </div>

            </div>

            <div className="system-status">

              <div className="system-status-row">

                <div>
                  <span className="system-dot active"></span>
                  AI Engine
                </div>

                <strong>
                  Ready
                </strong>

              </div>

              <div className="system-status-row">

                <div>
                  <span className="system-dot active"></span>
                  Semantic Search
                </div>

                <strong>
                  Active
                </strong>

              </div>

              <div className="system-status-row">

                <div>
                  <span className="system-dot active"></span>
                  Document Processing
                </div>

                <strong>
                  Ready
                </strong>

              </div>

              <div className="system-status-row">

                <div>
                  <span className="system-dot secure"></span>
                  Workspace Security
                </div>

                <strong>
                  Protected
                </strong>

              </div>

            </div>

            <div className="security-note">

              <ShieldCheck size={17} />

              <span>
                Your knowledge workspace is isolated to
                your account.
              </span>

            </div>

          </div>

        </section>

        {/* ================= CTA ================= */}
        <section className="dashboard-cta">

          <div className="cta-glow"></div>

          <div className="cta-icon">
            <Brain size={25} />
          </div>

          <div className="cta-content">

            <span>
              READY TO EXPLORE?
            </span>

            <h2>
              Start working with your knowledge.
            </h2>

            <p>
              Upload a document and let IndustryBrain AI
              transform it into an intelligent workspace.
            </p>

          </div>

          <button
            type="button"
            onClick={() => navigate("/upload")}
            className="cta-button"
          >
            <Upload size={17} />
            Upload Document
            <ArrowUpRight size={17} />
          </button>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;