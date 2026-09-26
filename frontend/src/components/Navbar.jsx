import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Brain,
  LayoutDashboard,
  FileText,
  UploadCloud,
  Search,
  MessageSquare,
  Settings,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(
    localStorage.getItem("industrybrain_theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("industrybrain_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const logout = () => {
    localStorage.removeItem("industrybrain_token");
    localStorage.removeItem("industrybrain_logged_in");
    localStorage.removeItem("industrybrain_user_email");
    localStorage.removeItem("industrybrain_user_name");
    localStorage.removeItem("industrybrain_filename");

    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Documents",
      path: "/documents",
      icon: FileText,
    },
    {
      label: "Upload",
      path: "/upload",
      icon: UploadCloud,
    },
    {
      label: "Search",
      path: "/search",
      icon: Search,
    },
    {
      label: "Chat",
      path: "/chat",
      icon: MessageSquare,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <header className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <div className="navbar-logo">
          <Brain size={23} strokeWidth={2.2} />
        </div>

        <div className="navbar-brand-copy">
          <span className="navbar-brand-text">
            IndustryBrain AI
          </span>

          <span className="navbar-brand-subtitle">
            Document Intelligence
          </span>
        </div>
      </Link>

      <nav className="navbar-links">
        {navItems.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`navbar-link ${
              location.pathname === path ? "active" : ""
            }`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="navbar-actions">
        <button
          type="button"
          className="navbar-theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${
            theme === "dark" ? "light" : "dark"
          } mode`}
          title={`Switch to ${
            theme === "dark" ? "light" : "dark"
          } mode`}
        >
          {theme === "dark" ? (
            <Sun size={17} />
          ) : (
            <Moon size={17} />
          )}
        </button>

        <Link to="/upload" className="navbar-upload">
          <UploadCloud size={16} />
          <span>+ Upload</span>
        </Link>

        <button
          type="button"
          className="navbar-logout"
          onClick={logout}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
