import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFeed } from "../hooks/useFeed";
import AuthForm from "../components/AuthForm";
import FeedItem from "../components/FeedItem";

function Homepage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { feedItems, loading: feedLoading } = useFeed();

  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;
    document.documentElement.style.setProperty("--font-color", "#ffffff");
    document.title = "Annotary";

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

  if (loading || feedLoading) {
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
            <h1>Annotary</h1>
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
          <h1>Annotary</h1>
          <p>Latest book reviews from the community</p>
        </header>

        <div className="homepage-nav">
          <button
            onClick={() => navigate(`/${user.email.split('@')[0]}`)}
            className="my-journal-btn"
          >
            Go to My Journal
          </button>
          <form onSubmit={handleSubmit} className="search-form">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Search username..."
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Go
            </button>
          </form>
        </div>

        <main className="homepage-main">
          <div className="feed-container">
            {feedItems.length === 0 ? (
              <div className="no-reviews">
                <p>No book reviews yet. Be the first to add one!</p>
              </div>
            ) : (
              <div className="feed-items">
                {feedItems.map((item) => (
                  <FeedItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Homepage;
