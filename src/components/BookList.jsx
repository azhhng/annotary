import { useMemo, memo } from "react";
import BookForm from "./BookForm";
import CollapsibleText from "./CollapsibleText";
import { BOOK_STATUS_LABELS } from "../constants/bookConstants";

function BookList({
  books,
  onEditBook,
  onDeleteBook,
  editingBook,
  onUpdateBook,
  onCancelEdit,
  showActions = true,
  showAddForm = false,
  onAddBook,
  onCancelAddForm,
}) {
  const formatDateRange = useMemo(() => {
    return (book) => {
      const formatDate = (dateStr) => {
        if (!dateStr) return "?";
        return new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      };

      if (!book.dateStarted && !book.dateFinished) {
        return null; // Don't show anything if no dates
      }

      const startDate = formatDate(book.dateStarted);
      const endDate = formatDate(book.dateFinished);

      return `${startDate} - ${endDate}`;
    };
  }, []);
  return (
    <div className="books-grid">
      {showAddForm && (
        <div key="add-book-form" className="book-card card">
          <div className="inline-edit-form">
            <BookForm
              onAddBook={onAddBook}
              onUpdateBook={() => {}} // not used in add mode
              onCancel={onCancelAddForm}
              editingBook={null}
            />
          </div>
        </div>
      )}

      {books.length === 0 && !showAddForm ? (
        <p>No books match your filters.</p>
      ) : (
        books.map((book) =>
          editingBook && editingBook.id === book.id ? (
            <div key={book.id} className="book-card card">
              <div className="inline-edit-form">
                <BookForm
                  onAddBook={() => {}} // not used in edit mode
                  onUpdateBook={onUpdateBook}
                  onCancel={onCancelEdit}
                  editingBook={editingBook}
                />
              </div>
            </div>
          ) : (
            <div key={book.id} className="book-card card">
              <div className="book-card-body">
                <div className="book-card-emojis">
                  {book.emojis &&
                    book.emojis.length > 0 &&
                    book.emojis.map((emoji, index) => (
                      <span key={index} className="book-emoji">
                        {emoji}
                      </span>
                    ))}
                </div>

                <div className="book-card-content">
                  <div className="book-header">
                    <h3 className="book-title">{book.title}</h3>
                    {showActions && (
                      <div className="book-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onEditBook(book)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-secondary btn-sm btn-danger"
                          onClick={() => onDeleteBook(book.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {book.authors && book.authors.length > 0 && (
                    <p className="book-authors">by {book.authors.join(", ")}</p>
                  )}

                  <div className="status-and-dates">
                    {book.status && (
                      <div className="status-badge">
                        <span
                          className={`status-indicator status-${book.status}`}
                        >
                          {book.status === "currently_reading" && "📖 "}
                          {book.status === "want_to_read" && "📚 "}
                          {book.status === "read" && "✅ "}
                          {book.status === "dnf" && "❌ "}
                          {BOOK_STATUS_LABELS[book.status]}
                        </span>
                      </div>
                    )}
                    {formatDateRange(book) && (
                      <p className="book-dates">{formatDateRange(book)}</p>
                    )}
                  </div>
                  {book.genres && book.genres.length > 0 && (
                    <p>
                      <span className="property-label">Genre(s)</span>
                      <span className="property-content">
                        {book.genres.join(", ")}
                      </span>
                    </p>
                  )}
                  {book.rating !== null && (
                    <p>
                      <span className="property-label">Rating</span>
                      <span className="property-content">
                        {book.rating}
                      </span>
                    </p>
                  )}
                  {book.tags && book.tags.length > 0 && (
                    <div className="tags-section">
                      <div className="tags-separator"></div>
                      <div className="book-tags">
                        {book.tags.map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {book.notes && (
                    <div className="notes-section">
                      <div className="notes-separator"></div>
                      <p>
                        <span className="property-label">Notes</span>
                        <span className="property-content">
                          <CollapsibleText text={book.notes} maxLength={250} />
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}

export default memo(BookList);
