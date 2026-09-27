import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      localStorage.setItem("industrybrain_token", data.token);
      localStorage.setItem("industrybrain_logged_in", "true");

      if (data.user) {
        localStorage.setItem(
          "industrybrain_user_email",
          data.user.email
        );

        localStorage.setItem(
          "industrybrain_user_name",
          data.user.name
        );
      }

      navigate("/documents");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("Google Sign-In is not configured yet.");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to IndustryBrain AI</p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="auth-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Continue with Google
        </button>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">Create Account</Link>
        </p>

        <p className="auth-back">
          <Link to="/">← Back to Home</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;