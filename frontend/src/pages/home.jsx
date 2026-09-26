import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Play, Moon, Sun, Sparkles, Upload, Search, MessageSquare,
  FileText, ShieldCheck, BarChart3, Database, BrainCircuit, CheckCircle2,
  ChevronLeft, ChevronRight, Zap, LockKeyhole, FileSearch, Network,
  TrendingUp, FileSpreadsheet, FileType2, Bot, Layers3
} from "lucide-react";
import "./Home.css";

const showcase = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    title: "See your knowledge at a glance",
    text: "Monitor documents, indexed content and AI activity from one intelligent workspace."
  },
  {
    id: "chat",
    label: "AI Chat",
    icon: MessageSquare,
    title: "Ask your documents anything",
    text: "Get contextual answers grounded in the documents you have uploaded."
  },
  {
    id: "search",
    label: "Smart Search",
    icon: Search,
    title: "Find information by meaning",
    text: "Discover relevant content even when the exact words are not present."
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    title: "Build your knowledge base",
    text: "Upload, organize and index your documents for instant discovery."
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    title: "Understand your knowledge",
    text: "Track document coverage, indexed content and information activity."
  }
];

function Home() {
  const [documentCount, setDocumentCount] = useState(0);
  const [indexedCount, setIndexedCount] = useState(0);
  const [active, setActive] = useState(0);

  // Theme state
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("industrybrain_theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return true;
  });

  // Public landing page: protected document statistics are not loaded
  // until the user enters the authenticated workspace.

  // Apply theme globally
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );

    localStorage.setItem(
      "industrybrain_theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  useEffect(() => {
    const timer = setInterval(
      () => setActive((v) => (v + 1) % showcase.length),
      5000
    );

    return () => clearInterval(timer);
  }, []);

  const next = () =>
    setActive((v) => (v + 1) % showcase.length);

  const prev = () =>
    setActive(
      (v) => (v - 1 + showcase.length) % showcase.length
    );

  return (
    <div className="home-page">
      <div className="home-bg">
        <span />
        <span />
        <span />
      </div>

      <header className="landing-nav">
        <a href="#home" className="landing-brand">
          <span className="brand-mark">
            <Sparkles size={20} />
          </span>

          <span>
            <strong>IndustryBrain AI</strong>
            <small>Document Intelligence</small>
          </span>
        </a>

        <nav>
          <a className="nav-active" href="#home">
            Home
          </a>
          <a href="#features">
            Features
          </a>
          <a href="#workflow">
            How it Works
          </a>
          <a href="#pricing">
            Pricing
          </a>
          <a href="#about">
            About
          </a>
        </nav>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={() => setDark((v) => !v)}
            aria-label={
              dark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              dark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {dark ? (
              <Sun size={17} />
            ) : (
              <Moon size={17} />
            )}
          </button>

          <a href="/login" className="nav-login">
            Login
          </a>

          <a href="/signup" className="nav-start">
            Get Started <ArrowRight size={15} />
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="eyebrow">
              <span />
              AI-POWERED DOCUMENT INTELLIGENCE
            </div>

            <h1>
              Your Documents.
              <br />
              <em>Smarter Answers.</em>
            </h1>

            <p>
              Upload your documents, ask questions in natural
              language, and get accurate, context-aware answers
              powered by AI.
            </p>

            <div className="hero-buttons">
              <a href="/signup" className="primary-btn">
                Get Started Free <ArrowRight size={17} />
              </a>

              <a href="#showcase" className="secondary-btn">
                <Play size={15} /> Watch Demo
              </a>
            </div>

            <div className="trust-points">
              <span>
                <CheckCircle2 /> No credit card required
              </span>

              <span>
                <CheckCircle2 /> Secure & private
              </span>

              <span>
                <CheckCircle2 /> Powered by Gemini AI
              </span>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
          >
            <ProductWindow
              documentCount={documentCount}
              indexedCount={indexedCount}
            />

            <motion.div
              className="float-note note-one"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity
              }}
            >
              <CheckCircle2 />

              <span>
                <b>Document Indexed</b>
                <small>Ready for AI search</small>
              </span>
            </motion.div>

            <motion.div
              className="float-note note-two"
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity
              }}
            >
              <BrainCircuit />

              <span>
                <b>AI Analysis</b>
                <small>Understanding context...</small>
              </span>
            </motion.div>
          </motion.div>
        </section>

        <section className="showcase" id="showcase">
          <div className="showcase-head">
            <div>
              <div className="eyebrow centered">
                PRODUCT EXPERIENCE
              </div>

              <h2>
                One platform. <em>Every answer.</em>
              </h2>

              <p>
                Explore the workspace your users will interact
                with every day.
              </p>
            </div>
          </div>

          <div className="showcase-tabs">
            {showcase.map((item, i) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  className={active === i ? "selected" : ""}
                  onClick={() => setActive(i)}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="showcase-stage">
            <button
              className="slide-arrow left"
              onClick={prev}
            >
              <ChevronLeft />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={showcase[active].id}
                className="showcase-slide"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                <div className="showcase-text">
                  <span>0{active + 1}</span>

                  <div className="eyebrow">
                    {showcase[active].label}
                  </div>

                  <h3>{showcase[active].title}</h3>

                  <p>{showcase[active].text}</p>

                  <a href="/signup">
                    Explore workspace{" "}
                    <ArrowRight size={15} />
                  </a>
                </div>

                <ShowcasePreview
                  type={showcase[active].id}
                  documentCount={documentCount}
                  indexedCount={indexedCount}
                />
              </motion.div>
            </AnimatePresence>

            <button
              className="slide-arrow right"
              onClick={next}
            >
              <ChevronRight />
            </button>

            <div className="dots">
              {showcase.map((_, i) => (
                <button
                  key={i}
                  className={active === i ? "active" : ""}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="trusted">
          <span>
            TRUSTED BY LEARNERS, PROFESSIONALS AND TEAMS
          </span>

          <div>
            <b>Microsoft</b>
            <b>Google</b>
            <b>amazon</b>
            <b>Meta</b>
            <b>IBM</b>
            <b>accenture</b>
            <b>Deloitte.</b>
          </div>
        </section>

        <section className="features" id="features">
          <div className="section-heading">
            <div className="eyebrow centered">
              POWERFUL FEATURES
            </div>

            <h2>
              Everything you need to work <em>smarter</em>
            </h2>

            <p>
              IndustryBrain combines AI, semantic search and
              document intelligence to help you extract insights
              from your knowledge in seconds.
            </p>
          </div>

          <div className="feature-grid">
            <Feature
              icon={<Sparkles />}
              title="AI-Powered Chat"
              text="Get accurate answers from your documents using Gemini AI."
            />

            <Feature
              icon={<Search />}
              title="Semantic Search"
              text="Find relevant information quickly with meaning-aware search."
            />

            <Feature
              icon={<FileText />}
              title="Multiple Document Support"
              text="Upload and work with supported PDF, DOCX and TXT documents."
            />

            <Feature
              icon={<ShieldCheck />}
              title="Private & Secure"
              text="Your documents stay separated inside your private workspace."
            />

            <Feature
              icon={<BarChart3 />}
              title="Document Analytics"
              text="Understand indexed content and knowledge activity at a glance."
            />

            <Feature
              icon={<BrainCircuit />}
              title="Context-Aware Answers"
              text="AI responses are grounded in the relevant retrieved document context."
            />
          </div>
        </section>

        <section className="stats-band">
          <Stat
            icon={<FileText />}
            value={`${Math.max(indexedCount, 0)}`}
            label="Documents Indexed"
          />

          <Stat
            icon={<BrainCircuit />}
            value="AI"
            label="Powered Answers"
          />

          <Stat
            icon={<Zap />}
            value="10x"
            label="Faster Information Access"
          />

          <Stat
            icon={<LockKeyhole />}
            value="100%"
            label="Private Workspace"
          />
        </section>

        <section className="workflow" id="workflow">
          <div className="section-heading">
            <div className="eyebrow">
              SIMPLE WORKFLOW
            </div>

            <h2>
              From documents to <em>knowledge.</em>
            </h2>

            <p>
              Four simple steps connect your files to an
              intelligent interface.
            </p>
          </div>

          <div className="workflow-grid">
            <Step
              n="01"
              icon={<Upload />}
              title="Upload"
              text="Add your documents to your workspace."
            />

            <Step
              n="02"
              icon={<Layers3 />}
              title="Index"
              text="Content is processed into searchable knowledge."
            />

            <Step
              n="03"
              icon={<Search />}
              title="Discover"
              text="Find relevant information using semantic search."
            />

            <Step
              n="04"
              icon={<Bot />}
              title="Ask AI"
              text="Get contextual answers from your documents."
            />
          </div>
        </section>

        <section className="knowledge" id="about">
          <div className="knowledge-copy">
            <div className="eyebrow">
              YOUR KNOWLEDGE LAYER
            </div>

            <h2>
              Turn scattered files into{" "}
              <em>useful knowledge.</em>
            </h2>

            <p>
              IndustryBrain gives your documents an intelligent
              interface. Upload files, retrieve relevant context
              and interact with it naturally instead of manually
              searching through pages.
            </p>

            <div className="check-list">
              <span>
                <CheckCircle2 /> Summarize documents
              </span>

              <span>
                <CheckCircle2 /> Extract insights
              </span>

              <span>
                <CheckCircle2 /> Answer questions
              </span>

              <span>
                <CheckCircle2 /> Find information
              </span>
            </div>
          </div>

          <KnowledgeEngine />
        </section>

        <section className="pricing-teaser" id="pricing">
          <div className="eyebrow centered">
            READY TO EXPLORE?
          </div>

          <h2>
            Start turning documents into <em>answers.</em>
          </h2>

          <p>
            Begin with IndustryBrain AI and build your own
            intelligent document workspace.
          </p>

          <a href="/signup" className="primary-btn">
            Get Started Free <ArrowRight size={17} />
          </a>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-brand">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>

          <span>
            <strong>IndustryBrain AI</strong>
            <small>Document Intelligence Platform</small>
          </span>
        </div>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#workflow">How it Works</a>
          <a href="/login">Login</a>
        </div>

        <p>© 2026 IndustryBrain AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

function KnowledgeEngine() {
  const inputs = [
    { type: "pdf", label: "PDF", x: "4%", y: "14%" },
    { type: "doc", label: "DOCX", x: "18%", y: "72%" },
    { type: "xls", label: "XLSX", x: "72%", y: "10%" },
    { type: "txt", label: "TXT", x: "76%", y: "70%" }
  ];

  return (
    <motion.div
      className="knowledge-engine"
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7 }}
    >
      <div className="engine-orbit orbit-one" />
      <div className="engine-orbit orbit-two" />

      <svg
        className="engine-lines"
        viewBox="0 0 600 430"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M70 85 C180 110 205 190 265 215" />
        <path d="M115 350 C200 330 215 270 265 225" />
        <path d="M530 75 C420 100 395 185 335 215" />
        <path d="M500 345 C405 325 390 270 335 225" />
      </svg>

      {inputs.map((item, index) => (
        <motion.div
          key={item.type}
          className={`engine-file ${item.type}`}
          style={{
            left: item.x,
            top: item.y
          }}
          animate={{
            y: [0, index % 2 ? 8 : -8, 0]
          }}
          transition={{
            duration: 4 + index * 0.4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FileText size={17} />
          <span>{item.label}</span>
        </motion.div>
      ))}

      <motion.div
        className="engine-core"
        animate={{
          boxShadow: [
            "0 0 28px rgba(112,94,255,.18)",
            "0 0 58px rgba(34,201,255,.32)",
            "0 0 28px rgba(112,94,255,.18)"
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      >
        <div className="engine-core-icon">
          <BrainCircuit size={34} />
        </div>

        <strong>IndustryBrain</strong>
        <span>Knowledge Engine</span>

        <small>
          <i /> Processing knowledge
        </small>
      </motion.div>

      <div className="engine-output output-one">
        <Sparkles size={14} />
        <span>Summarize</span>
      </div>

      <div className="engine-output output-two">
        <FileSearch size={14} />
        <span>Find Information</span>
      </div>

      <div className="engine-output output-three">
        <TrendingUp size={14} />
        <span>Extract Insights</span>
      </div>

      <div className="engine-output output-four">
        <MessageSquare size={14} />
        <span>Answer Questions</span>
      </div>

      <div className="engine-status">
        <span>
          <CheckCircle2 size={14} /> 1,284 chunks indexed
        </span>

        <b>AI READY</b>
      </div>
    </motion.div>
  );
}

function ProductWindow({ documentCount, indexedCount }) {
  const sideItems = [
    { label: "Dashboard", icon: BarChart3 },
    { label: "Documents", icon: FileText },
    { label: "Upload", icon: Upload },
    { label: "Search", icon: Search },
    { label: "Chat", icon: MessageSquare },
    { label: "Analytics", icon: BarChart3 }
  ];

  return (
    <div className="product-window">
      <div className="window-bar">
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>

        <span>
          <Sparkles size={13} />
          IndustryBrain AI
        </span>

        <small>
          <b />
          AI Active
        </small>
      </div>

      <div className="product-body">
        <aside>
          <div className="side-logo">
            <Sparkles size={16} />
          </div>

          {sideItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`side-link ${
                  index === 4 ? "active" : ""
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </aside>

        <div className="product-main">
          <div className="main-top">
            <div>
              <small>AI DOCUMENTS</small>

              <h3>
                Ask your documents <em>anything.</em>
              </h3>

              <p>
                Get instant, accurate answers from your knowledge.
              </p>
            </div>

            <div className="avatar">N</div>
          </div>

          <div className="product-pills">
            <span>
              <Sparkles />
              Powered by Gemini AI
            </span>

            <span>
              <Search />
              Semantic Search
            </span>
          </div>

          <div className="product-file">
            <div className="file-icon">
              <FileText />
            </div>

            <div>
              <b>Power_BI_Complete_Notes_Guide.pdf</b>

              <small>
                Indexed • {Math.max(indexedCount, 0)} documents •{" "}
                <i /> Ready
              </small>
            </div>
          </div>

          <div className="assistant-card">
            <div className="assistant-avatar">
              <BrainCircuit />
            </div>

            <div>
              <b>IndustryBrain AI</b>

              <p>
                What would you like to know about your documents?
              </p>

              <div className="suggestions">
                <span>What is this document about?</span>
                <span>Explain the main concepts</span>
              </div>
            </div>
          </div>

          <div className="ask-box">
            <span>Ask anything about your document...</span>

            <button type="button">
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="insight-panel">
          <small>DOCUMENT INSIGHTS</small>

          <b>{documentCount}</b>
          <span>Total Documents</span>

          <b>{indexedCount}</b>
          <span>Indexed Documents</span>

          <b>96%</b>
          <span>Content Coverage</span>

          <strong>
            <CheckCircle2 />
            Ready
          </strong>
        </div>
      </div>
    </div>
  );
}

function ShowcasePreview({
  type,
  documentCount,
  indexedCount
}) {
  if (type === "chat")
    return (
      <div className="mock chat-mock">
        <MockHeader
          title="AI Assistant"
          sub="Document Chat"
        />

        <div className="chat-msg user">
          What are the key concepts in this document?
        </div>

        <div className="chat-msg ai">
          <span>
            <BrainCircuit />
          </span>

          <div>
            <b>IndustryBrain AI</b>

            <p>
              Based on the indexed content, the document focuses
              on data analysis, business intelligence and
              decision-making.
            </p>

            <small>
              <FileText /> Business Analytics.pdf
            </small>
          </div>
        </div>

        <div className="mock-input">
          Ask another question... <ArrowRight />
        </div>
      </div>
    );

  if (type === "search")
    return (
      <div className="mock">
        <MockHeader
          title="Semantic Search"
          sub="Meaning-aware discovery"
        />

        <div className="searchbar">
          <Search /> how does semantic search work?
          <kbd>⌘ K</kbd>
        </div>

        <div className="result-title">
          RELEVANT KNOWLEDGE
        </div>

        {[
          "Semantic Search Overview",
          "Information Retrieval",
          "Knowledge Discovery"
        ].map((x, i) => (
          <div className="result" key={x}>
            <FileSearch />

            <div>
              <b>{x}</b>

              <p>
                Find relevant information based on meaning and
                context...
              </p>

              <small>
                {i
                  ? "AI Documentation.pdf"
                  : "Business Analytics.pdf"}{" "}
                • {94 - i * 5}% relevant
              </small>
            </div>
          </div>
        ))}
      </div>
    );

  if (type === "documents")
    return (
      <div className="mock">
        <MockHeader
          title="Your Documents"
          sub="Knowledge Base"
        />

        <div className="doc-summary">
          <div>
            <b>{documentCount}</b>
            <small>Total Documents</small>
          </div>

          <div>
            <b>{indexedCount}</b>
            <small>Indexed</small>
          </div>

          <div>
            <b>100%</b>
            <small>Search Ready</small>
          </div>
        </div>

        {[
          "Business Analytics.pdf",
          "SQL Reference.pdf",
          "Python Notes.pdf"
        ].map((x) => (
          <div className="doc-row" key={x}>
            <FileText />

            <div>
              <b>{x}</b>
              <small>PDF • Indexed and ready</small>
            </div>

            <CheckCircle2 />
          </div>
        ))}
      </div>
    );

  if (type === "analytics")
    return (
      <div className="mock">
        <MockHeader
          title="Document Analytics"
          sub="Knowledge activity"
        />

        <div className="analytics-cards">
          <div>
            <small>Documents</small>
            <b>{documentCount}</b>
          </div>

          <div>
            <small>Indexed</small>
            <b>{indexedCount}</b>
          </div>

          <div>
            <small>AI Search</small>
            <b>Active</b>
          </div>
        </div>

        <div className="big-bars">
          {[35, 52, 45, 68, 58, 78, 65, 91, 82].map(
            (h, i) => (
              <i
                key={i}
                style={{ height: `${h}%` }}
              />
            )
          )}
        </div>
      </div>
    );

  return (
    <div className="mock">
      <MockHeader
        title="Knowledge Overview"
        sub="Workspace"
      />

      <div className="analytics-cards">
        <div>
          <small>Documents</small>
          <b>{documentCount}</b>
        </div>

        <div>
          <small>Indexed Content</small>
          <b>{indexedCount}</b>
        </div>

        <div>
          <small>AI Search</small>
          <b>Active</b>
        </div>
      </div>

      <div className="overview-bottom">
        <div className="big-bars">
          {[32, 48, 40, 65, 55, 72, 64, 83, 92].map(
            (h, i) => (
              <i
                key={i}
                style={{ height: `${h}%` }}
              />
            )
          )}
        </div>

        <div className="mini-ai">
          <BrainCircuit />
          <b>AI Assistant</b>
          <span>Ask your knowledge anything.</span>
        </div>
      </div>
    </div>
  );
}

function MockHeader({ title, sub }) {
  return (
    <div className="mock-head">
      <div>
        <small>{sub}</small>
        <b>{title}</b>
      </div>

      <Sparkles />
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <motion.article
      className="feature-card"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
    >
      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>
      <p>{text}</p>

      <ArrowRight
        className="feature-arrow"
        size={16}
      />
    </motion.article>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="stat">
      <div>{icon}</div>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

function Step({ n, icon, title, text }) {
  return (
    <div className="step">
      <small>{n}</small>
      <div className="step-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function FileTile({ type, x, y }) {
  const data = {
    pdf: ["PDF", FileText],
    doc: ["W", FileType2],
    xls: ["X", FileSpreadsheet],
    txt: ["TXT", FileType2]
  }[type];

  const Icon = data[1];

  return (
    <div
      className={`file-tile ${type}`}
      style={{
        left: x,
        top: y
      }}
    >
      <Icon size={18} />
      <b>{data[0]}</b>
    </div>
  );
}

export default Home;