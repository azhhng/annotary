import { useAuth } from "../hooks/useAuth";
import { useFeed } from "../hooks/useFeed";
import AuthForm from "../components/AuthForm";
import FeedItem from "../components/FeedItem";

function Homepage() {
  const { user, loading } = useAuth();
  const { feedItems, loading: feedLoading } = useFeed();


  if (loading || feedLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p style={{ marginBottom: "2rem", fontSize: "1.1rem" }}>
          Welcome! Browse the community feed or sign up to create your own journal.
        </p>
        <AuthForm />
      </div>
    );
  }

  return (
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
  );
}

export default Homepage;
