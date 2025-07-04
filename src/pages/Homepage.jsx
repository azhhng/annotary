import { useFeed } from "../hooks/useFeed";
import FeedItem from "../components/FeedItem";

function Homepage() {
  const { feedItems, loading: feedLoading } = useFeed();

  if (feedLoading) {
    return (
      <div className="loading">
        <p>Loading...</p>
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
