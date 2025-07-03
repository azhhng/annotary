import { useMemo, memo } from "react";
import BookForm from "./BookForm";
import CollapsibleText from "./CollapsibleText";

function BookList({
  books,
  onEditBook,
  onDeleteBook,
  editingBook,
  onUpdateBook,
  onCancelEdit,
  showActions = true,
}) {
  const formattedDates = useMemo(() => {
    const dateCache = new Map();

    books.forEach((book) => {
      if (book.dateFinished && !dateCache.has(book.dateFinished)) {
        dateCache.set(
          book.dateFinished,
          new Date(book.dateFinished).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
      }
    });

    return dateCache;
  }, [books]);
  return (
    <div className="books-grid">
      {books.length === 0 ? (
        <p>No books match your filters.</p>
      ) : (
        books.map((book) =>
          editingBook && editingBook.id === book.id ? (
            <div key={book.id} className="book-card">
              <div className="inline-edit-form">
                <h3>Edit book</h3>
                <BookForm
                  onAddBook={() => {}} // not used in edit mode
                  onUpdateBook={onUpdateBook}
                  onCancel={onCancelEdit}
                  editingBook={editingBook}
                />
              </div>
            </div>
          ) : (
            <div key={book.id} className="book-card">
              <div className="book-card-body">
                {book.emojis && book.emojis.length > 0 && (
                  <div className="book-card-emojis">
                    {book.emojis.map((emoji, index) => (
                      <span key={index} className="book-emoji">
                        {emoji}
                      </span>
                    ))}
                  </div>
                )}

                <div className="book-card-content">
                  <div className="book-header">
                    <h3>{book.title}</h3>
                    {showActions && (
                      <div className="book-actions">
                        <button
                          className="edit-btn"
                          onClick={() => onEditBook(book)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => onDeleteBook(book.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p>
                    <span className="property-label">Author(s)</span>
                    <span className="property-content">
                      {book.authors?.join(", ") || "Unknown"}
                    </span>
                  </p>
                  <p>
                    <span className="property-label">Genre(s)</span>
                    <span className="property-content">
                      {book.genres?.join(", ") || "Unknown"}
                    </span>
                  </p>
                  <p>
                    <span className="property-label">Rating</span>
                    <span className="property-content">{book.rating}</span>
                  </p>
                  {book.dateFinished && (
                    <p>
                      <span className="property-label">Finished</span>
                      <span className="property-content">
                        {formattedDates.get(book.dateFinished)}
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
