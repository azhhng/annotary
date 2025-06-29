function BookList({ books, onEditBook, onDeleteBook }) {
  if (books.length === 0) {
    return <p>No books match your filters.</p>
  }

  return (
    <div className="books-grid">
      {books.map(book => (
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
          <p><span className="property-label">Rating</span><span className="property-content">{book.rating % 1 === 0 ? '⭐'.repeat(book.rating) : '⭐'.repeat(Math.floor(book.rating)) + '⭐️'} ({book.rating})</span></p>
          {book.dateFinished && (
            <p><span className="property-label">Finished</span><span className="property-content">{book.dateFinished}</span></p>
          )}
          {book.notes && (
            <p><span className="property-label">Notes</span><span className="property-content">{book.notes}</span></p>
          )}
          {book.tags && book.tags.length > 0 && (
            <div className="book-tags">
              {book.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default BookList