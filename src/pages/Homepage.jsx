import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useFeed } from "../hooks/useFeed";
import AuthForm from "../components/AuthForm";
import FeedItem from "../components/FeedItem";
import Navigation from "../components/Navigation";

function Homepage() {
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
      <div className="app">
        <header className="app-header">
          <h1>Annotary</h1>
          <p>Track your reading journey</p>
        </header>
        <div style={{ marginTop: "2rem" }}>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Annotary</h1>
      </header>

      <Navigation 
        activeTab="feed" 
        user={user} 
        showSearch={true}
      />

      <main className="main-content">
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
  );
}

export default Homepage;
