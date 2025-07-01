import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthForm from "../components/AuthForm";

function Homepage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;
    document.documentElement.style.setProperty("--font-color", "#ffffff");
    document.title = "Reading Journal";

    return () => {
      // Cleanup will be handled by individual journal pages
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/${username.trim()}`);
    }
  };

  if (loading) {
    return (
      <div className="homepage">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="homepage">
        <div className="homepage-content">
          <header className="homepage-header">
            <h1>Reading Journal</h1>
            <p>Track your reading journey</p>
          </header>
          <div style={{ marginTop: "2rem" }}>
            <AuthForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <div className="homepage-content">
        <header className="homepage-header">
          <h1>Reading Journal</h1>
          <p>Track your reading journey</p>
        </header>

        <main className="homepage-main">
          <form onSubmit={handleSubmit} className="username-form">
            <h2>Enter a username to view their journal</h2>
            <div className="form-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                className="username-input"
                required
              />
              <button type="submit" className="go-btn">
                Go to Journal
              </button>
            </div>
          </form>

          <div className="quick-access">
            <h3>Quick Access</h3>
            <button
              onClick={() => navigate(`/${user.email.split('@')[0]}`)}
              className="my-journal-btn"
            >
              Go to My Journal
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Homepage;
