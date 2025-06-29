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
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Rating:</strong> {book.rating % 1 === 0 ? '⭐'.repeat(book.rating) : '⭐'.repeat(Math.floor(book.rating)) + '⭐️'} ({book.rating})</p>
          {book.dateFinished && (
            <p><strong>Finished:</strong> {book.dateFinished}</p>
          )}
          {book.notes && (
            <p><strong>Notes:</strong> {book.notes}</p>
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