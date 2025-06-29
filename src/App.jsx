import { useState } from 'react'
import './App.css'
import booksData from './data/books.json'
import BookForm from './components/BookForm'

function App() {
  const [books, setBooks] = useState(booksData.books)
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)

  const handleAddBook = (newBook) => {
    setBooks(prev => [...prev, newBook])
    setShowForm(false)
  }

  const handleUpdateBook = (updatedBook) => {
    setBooks(prev => prev.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    ))
    setEditingBook(null)
    setShowForm(false)
  }

  const handleEditBook = (book) => {
    setEditingBook(book)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingBook(null)
    setShowForm(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 My Reading Journal</h1>
        <button 
          className="add-book-btn"
          onClick={() => {
            if (showForm && !editingBook) {
              setShowForm(false)
            } else if (showForm && editingBook) {
              handleCancelEdit()
            } else {
              setEditingBook(null)
              setShowForm(true)
            }
          }}
        >
          {showForm ? 'Cancel' : 'Add new book'}
        </button>
      </header>

      <main className="main-content">
        {showForm && (
          <div className="form-section">
            <h2>{editingBook ? 'Edit book' : 'Add new book'}</h2>
            <BookForm 
              onAddBook={handleAddBook}
              onUpdateBook={handleUpdateBook}
              onCancel={handleCancelEdit}
              editingBook={editingBook}
            />
          </div>
        )}

        <div className="books-section">
          <h2>My Books ({books.length})</h2>
          {books.length === 0 ? (
            <p>No books yet. Add your first book!</p>
          ) : (
            <div className="books-grid">
              {books.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-header">
                    <h3>{book.title}</h3>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditBook(book)}
                    >
                      Edit
                    </button>
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
          )}
        </div>
      </main>
    </div>
  )
}

export default App
