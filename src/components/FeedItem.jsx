import { memo } from "react";
import { useNavigate } from "react-router-dom";

function FeedItem({ item }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const handleUserClick = () => {
    navigate(`/${item.username}`);
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="feed-item">
      <div className="feed-item-body">
        {item.emojis && item.emojis.length > 0 && (
          <div className="feed-item-emojis">
            {item.emojis.map((emoji, index) => (
              <span key={index} className="feed-emoji">
                {emoji}
              </span>
            ))}
          </div>
        )}

        <div className="feed-item-content">
          <div className="feed-item-header">
            <button
              className="btn-link"
              onClick={handleUserClick}
              title={`Go to ${item.username}'s journal`}
              style={{ fontWeight: 'bold', textDecoration: 'none' }}
            >
              @{item.username}
            </button>
            <span className="feed-item-date">{formatDate(item.createdAt)}</span>
          </div>

          <h3 className="book-title">{item.title}</h3>

          {item.authors && item.authors.length > 0 && (
            <p className="book-authors">by {item.authors.join(", ")}</p>
          )}

          {item.genres && item.genres.length > 0 && (
            <div className="book-genres">
              {item.genres.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          )}

          {item.rating && (
            <div className="book-rating">
              <span className="stars">{renderStars(item.rating)}</span>
              <span className="rating-text">({item.rating}/5)</span>
            </div>
          )}

          {item.dateFinished && (
            <p className="completion-date">
              Finished: {formatDate(item.dateFinished)}
            </p>
          )}

          {item.notes && (
            <div className="book-notes">
              <p>
                {item.notes.length > 200
                  ? `${item.notes.substring(0, 200)}...`
                  : item.notes}
              </p>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="book-tags">
              {item.tags.map((tag, index) => (
                <span key={index} className="user-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(FeedItem);
