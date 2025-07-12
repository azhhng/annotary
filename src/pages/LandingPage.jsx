import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/home");
    } else {
      navigate("/auth");
    }
  };

  const handleViewCommunity = () => {
    navigate("/home");
  };

  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Annotary</h1>
        <p className="hero-subtitle">
          Your personal reading journal and community for book lovers.
        </p>

        <div className="cta-buttons">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleGetStarted}
          >
            {user ? "Go to community" : "Get started"}
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={handleViewCommunity}
          >
            View community
          </button>
        </div>
      </div>

      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <h3>📚 Track Your Reading</h3>
            <p>
              Keep a personal journal of all the books you've read, are reading,
              or want to read. Add your thoughts, ratings, and notes.
            </p>
          </div>

          <div className="feature-card">
            <h3>✍️ Write Reviews</h3>
            <p>
              Share your thoughts on books with detailed reviews and ratings.
              Help others discover their next great read.
            </p>
          </div>

          <div className="feature-card">
            <h3>😊 Express with Emojis</h3>
            <p>
              Choose emojis to visually represent your books and express how
              they made you feel. Make your reading journal uniquely yours.
            </p>
          </div>

          <div className="feature-card">
            <h3>🏆 Track Achievements</h3>
            <p>
              Set reading goals and earn achievements as you continue your reading journey.
            </p>
          </div>

          <div className="feature-card">
            <h3>📖 Import from Goodreads</h3>
            <p>
              Already have a Goodreads account? Import your existing
              book collection to get started quickly.
            </p>
          </div>

          <div className="feature-card">
            <h3>👥 Community Feed</h3>
            <p>
              Stay connected with other readers through a shared community
              feed of recent reviews and book discussions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
