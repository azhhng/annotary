import { useState } from 'react'
import './App.css'
import booksData from './data/books.json'
import BookForm from './components/BookForm'

function App() {
  const [books, setBooks] = useState(booksData.books)
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [filters, setFilters] = useState({
    genre: '',
    rating: '',
    tag: '',
    author: ''
  })

  const [sortBy, setSortBy] = useState('')
  const [showFilters, setShowFilters] = useState(false)

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

  const handleDeleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(prev => prev.filter(book => book.id !== bookId))
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      genre: '',
      rating: '',
      tag: '',
      author: ''
    })
  }

  // filtering
  const uniqueGenres = [...new Set(books.map(book => book.genre).filter(Boolean))]
  const uniqueRatings = [...new Set(books.map(book => book.rating))].sort((a, b) => b - a)
  const uniqueTags = [...new Set(books.flatMap(book => book.tags || []))]
  const uniqueAuthors = [...new Set(books.map(book => book.author).filter(Boolean))].sort()

  const filteredBooks = books.filter(book => {
    const genreMatch = !filters.genre || book.genre === filters.genre
    const ratingMatch = !filters.rating || book.rating === parseFloat(filters.rating)
    const tagMatch = !filters.tag || (book.tags && book.tags.includes(filters.tag))
    const authorMatch = !filters.author || book.author === filters.author

    return genreMatch && ratingMatch && tagMatch && authorMatch
  })

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'title':
        return a.title.localeCompare(b.title)
      case 'author':
        const getLastName = (fullName) => {
          const names = fullName.trim().split(' ')
          return names[names.length - 1]
        }
        return getLastName(a.author).localeCompare(getLastName(b.author))
      case 'dateFinished':
        if (!a.dateFinished && !b.dateFinished) return 0
        if (!a.dateFinished) return 1
        if (!b.dateFinished) return -1
        return new Date(b.dateFinished) - new Date(a.dateFinished)
      default:
        return 0
    }
  })

  return (
    <div className="app">
      <header className="app-header">
        <h1>Alice's Reads</h1>
      </header>

      <main className="main-content">
        {showForm && (
          <div className="form-section">
            <h2>{editingBook ? 'Edit book' : 'Add book'}</h2>
            <BookForm
              onAddBook={handleAddBook}
              onUpdateBook={handleUpdateBook}
              onCancel={handleCancelEdit}
              editingBook={editingBook}
            />
          </div>
        )}

        <div className="books-section">
          {books.length === 0 ? (
            <p>No books yet. Add your first book!</p>
          ) : (
            <div className="books-container">
              <div className="sidebar">
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
                  {showForm ? 'Cancel' : 'Add book'}
                </button>

                <div className="filters">
                  <h4 className="filters-header" onClick={() => setShowFilters(!showFilters)}>
                    Filters {showFilters ? '▼' : '▶'}
                  </h4>

                  {showFilters && (
                    <div className="filters-content">

                  <div className="filter-group">
                    <label>Genre</label>
                    <select
                      value={filters.genre}
                      onChange={(e) => handleFilterChange('genre', e.target.value)}
                    >
                      <option value="">All genres</option>
                      {uniqueGenres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                    >
                      <option value="">All ratings</option>
                      {uniqueRatings.map(rating => (
                        <option key={rating} value={rating}>{rating} ⭐</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Tag</label>
                    <select
                      value={filters.tag}
                      onChange={(e) => handleFilterChange('tag', e.target.value)}
                    >
                      <option value="">All tags</option>
                      {uniqueTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Author</label>
                    <select
                      value={filters.author}
                      onChange={(e) => handleFilterChange('author', e.target.value)}
                    >
                      <option value="">All authors</option>
                      {uniqueAuthors.map(author => (
                        <option key={author} value={author}>{author}</option>
                      ))}
                    </select>
                  </div>

                  {(filters.genre || filters.rating || filters.tag || filters.author) && (
                    <button className="clear-filters-btn" onClick={clearFilters}>
                      Clear filters
                    </button>
                  )}

                  <div className="sort-section">
                    <h4>Sort</h4>
                    <div className="filter-group">
                      <label>Sort by</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="">No sorting</option>
                        <option value="rating">Rating (high to low)</option>
                        <option value="title">Book name (A-Z)</option>
                        <option value="author">Author name (A-Z)</option>
                        <option value="dateFinished">Finished date (recent first)</option>
                      </select>
                    </div>

                    {sortBy && (
                      <button className="clear-filters-btn" onClick={() => setSortBy('')}>
                        Clear sorting
                      </button>
                    )}
                  </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="books-grid">
                {sortedBooks.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-header">
                    <h3>{book.title}</h3>
                    <div className="book-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditBook(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteBook(book.id)}
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
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
