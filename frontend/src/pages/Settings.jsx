import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  Palette,
  Database,
  Bell,
  LockKeyhole,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Settings as SettingsIcon,
  Moon,
  Sun,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    localStorage.getItem("industrybrain_theme") || "dark"
  );

  const userName =
    localStorage.getItem("industrybrain_user_name") || "IndustryBrain User";

  const userEmail =
    localStorage.getItem("industrybrain_user_email") || "Account email";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("industrybrain_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    localStorage.removeItem("industrybrain_token");
    localStorage.removeItem("industrybrain_logged_in");
    localStorage.removeItem("industrybrain_user_email");
    localStorage.removeItem("industrybrain_user_name");
    localStorage.removeItem("industrybrain_filename");

    window.dispatchEvent(new Event("industrybrain_document_changed"));
    navigate("/login");
  };

  return (
    <div className="settings-page">
      <Navbar />

      <main className="settings-main">
        <section className="settings-hero">
          <div>
            <div className="settings-label">
              <SettingsIcon size={13} />
              WORKSPACE SETTINGS
            </div>

            <h1>
              Control your
              <span> workspace.</span>
            </h1>

            <p>
              Manage your IndustryBrain AI account, appearance,
              security and knowledge workspace preferences.
            </p>
          </div>

          <div className="settings-status">
            <div className="settings-status-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <strong>IndustryBrain AI</strong>
              <span>Workspace settings</span>
            </div>
            <div className="settings-live">
              <i />
              Active
            </div>
          </div>
        </section>

        <section className="settings-layout">
          <div className="settings-content">

            {/* Profile */}
            <section className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-title">
                  <div className="settings-icon purple">
                    <UserRound size={19} />
                  </div>
                  <div>
                    <h2>Profile</h2>
                    <p>Your IndustryBrain AI account information.</p>
                  </div>
                </div>
                <span className="settings-badge">
                  <CheckCircle2 size={12} />
                  Account
                </span>
              </div>

              <div className="profile-panel">
                <div className="profile-avatar">
                  {userName.charAt(0).toUpperCase()}
                </div>

                <div className="profile-info">
                  <strong>{userName}</strong>
                  <span>
                    <Mail size={13} />
                    {userEmail}
                  </span>
                </div>
              </div>
            </section>

            {/* Appearance */}
            <section className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-title">
                  <div className="settings-icon cyan">
                    <Palette size={19} />
                  </div>
                  <div>
                    <h2>Appearance</h2>
                    <p>Choose how IndustryBrain AI looks for you.</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="settings-option"
                onClick={toggleTheme}
              >
                <div className="option-icon">
                  {theme === "dark" ? (
                    <Moon size={18} />
                  ) : (
                    <Sun size={18} />
                  )}
                </div>

                <div className="option-copy">
                  <strong>Interface theme</strong>
                  <span>
                    Currently using {theme === "dark" ? "Dark" : "Light"} mode.
                  </span>
                </div>

                <div className="theme-switch">
                  <span className={theme === "dark" ? "active" : ""}>
                    Dark
                  </span>
                  <span className={theme === "light" ? "active" : ""}>
                    Light
                  </span>
                </div>

                <ChevronRight size={17} />
              </button>
            </section>

            {/* Knowledge */}
            <section className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-title">
                  <div className="settings-icon green">
                    <Database size={19} />
                  </div>
                  <div>
                    <h2>Knowledge Workspace</h2>
                    <p>Manage your document intelligence workspace.</p>
                  </div>
                </div>
              </div>

              <div className="settings-option-row">
                <div className="option-icon">
                  <FileText size={18} />
                </div>
                <div className="option-copy">
                  <strong>Document processing</strong>
                  <span>
                    Uploaded documents are processed and indexed for AI search.
                  </span>
                </div>
                <span className="ready-state">
                  <i />
                  Ready
                </span>
              </div>

              <div className="settings-option-row">
                <div className="option-icon">
                  <Sparkles size={18} />
                </div>
                <div className="option-copy">
                  <strong>Semantic intelligence</strong>
                  <span>
                    Search and AI responses use your indexed document context.
                  </span>
                </div>
                <span className="ready-state">
                  <i />
                  Active
                </span>
              </div>
            </section>

            {/* Security */}
            <section className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-title">
                  <div className="settings-icon blue">
                    <ShieldCheck size={19} />
                  </div>
                  <div>
                    <h2>Security</h2>
                    <p>Account and workspace protection.</p>
                  </div>
                </div>
              </div>

              <div className="security-grid">
                <div className="security-item">
                  <LockKeyhole size={18} />
                  <div>
                    <strong>Protected account</strong>
                    <span>Authenticated workspace access</span>
                  </div>
                </div>

                <div className="security-item">
                  <ShieldCheck size={18} />
                  <div>
                    <strong>Private knowledge base</strong>
                    <span>Your workspace documents remain account-specific</span>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside className="settings-sidebar">
            <div className="settings-side-card">
              <div className="side-card-icon">
                <Bell size={19} />
              </div>
              <strong>Workspace status</strong>
              <p>Your AI workspace is ready to use.</p>

              <div className="side-status">
                <span><i /> AI Engine</span>
                <b>Ready</b>
              </div>

              <div className="side-status">
                <span><i /> Semantic Search</span>
                <b>Active</b>
              </div>

              <div className="side-status">
                <span><i /> Document Processing</span>
                <b>Ready</b>
              </div>
            </div>

            <div className="settings-side-card upgrade">
              <div className="side-card-icon purple-bg">
                <Sparkles size={19} />
              </div>
              <strong>IndustryBrain AI</strong>
              <p>
                Your intelligent document workspace for searching,
                understanding and asking questions.
              </p>

              <button
                type="button"
                onClick={() => navigate("/documents")}
              >
                Open Knowledge Base
                <ChevronRight size={15} />
              </button>
            </div>

            <button
              type="button"
              className="logout-settings"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Sign out of IndustryBrain AI
            </button>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Settings;
