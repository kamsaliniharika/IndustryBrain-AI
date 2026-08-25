import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          Industry<span>Brain</span> AI
        </div>

        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/upload" className="nav-button">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero">

        <div className="hero-content">

          <div className="badge">
            AI-Powered Document Intelligence
          </div>

          <h1>
            Understand Your
            <span> Documents Smarter.</span>
          </h1>

          <p>
            IndustryBrain AI helps you upload, process and understand
            information from multiple file formats using intelligent AI.
          </p>

          <div className="hero-buttons">
            <Link to="/upload" className="primary-button">
              Upload Documents →
            </Link>

            <Link to="/login" className="secondary-button">
              Sign In
            </Link>
          </div>

        </div>

        {/* Right side visual */}
        <div className="hero-visual">

          <div className="document-card card-one">
            <div className="file-icon">PDF</div>
            <div>
              <strong>Reports.pdf</strong>
              <small>Document</small>
            </div>
          </div>

          <div className="document-card card-two">
            <div className="file-icon">DOC</div>
            <div>
              <strong>Research.docx</strong>
              <small>Document</small>
            </div>
          </div>

          <div className="ai-card">
            <div className="ai-circle">✦</div>
            <div>
              <strong>IndustryBrain AI</strong>
              <small>Analyzing your documents...</small>
            </div>
          </div>

        </div>

      </main>

      {/* Features */}
      <section className="features">

        <div className="feature-card">
          <div className="feature-icon">📄</div>
          <h3>Multi-Format</h3>
          <p>
            Work with PDF, DOCX, Excel, images, text and other file formats.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3>AI Intelligence</h3>
          <p>
            Extract meaningful information and ask questions about your data.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔐</div>
          <h3>Privacy Focused</h3>
          <p>
            Designed with security, authorization and privacy in mind.
          </p>
        </div>

      </section>

    </div>
  );
}

export default Home;