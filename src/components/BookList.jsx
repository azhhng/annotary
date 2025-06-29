function BookList({ books, onEditBook, onDeleteBook }) {
  return (
    <div className="books-grid">
      {books.length === 0 ? (
        <p>No books match your filters.</p>
      ) : (
        books.map(book => (
        <div key={book.id} className="book-card">
          <div className="book-header">
            <h3>{book.title}</h3>
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
          </div>
          <p><span className="property-label">Author</span><span className="property-content">{book.author}</span></p>
          <p><span className="property-label">Genre</span><span className="property-content">{book.genre}</span></p>
          <p><span className="property-label">Rating</span><span className="property-content">{book.rating}</span></p>
          {book.dateFinished && (
            <p><span className="property-label">Finished</span><span className="property-content">{new Date(book.dateFinished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
          )}
          {book.emojis && book.emojis.length > 0 && (
            <div className="emoji-section">
              <span className="property-label">Emojis</span>
              <div className="book-emojis">
                {book.emojis.map((emoji, index) => (
                  <span key={index} className="emoji">
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
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
              <p><span className="property-label">Notes</span><span className="property-content">{book.notes}</span></p>
            </div>
          )}
        </div>
        ))
      )}
    </div>
  )
}

export default BookList