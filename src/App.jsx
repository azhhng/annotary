import { useState } from 'react'
import './App.css'
import BookForm from './components/BookForm'
import BookList from './components/BookList'
import ColorPicker from './components/ColorPicker'
import FilterSort from './components/FilterSort'
import { useBooks } from './hooks/useBooks'
import { useBookFilters } from './hooks/useBookFilters'
import { useTheme } from './hooks/useTheme'

function App() {
  const [showForm, setShowForm] = useState(false)
  const { bgColors, setBgColors, fontColor, setFontColor } = useTheme()

  const {
    books,
    editingBook,
    addBook,
    updateBook,
    deleteBook,
    startEditing,
    cancelEditing
  } = useBooks()

  const {
    filters,
    sortBy,
    filterOptions,
    sortedBooks,
    hasActiveFilters,
    handleFilterChange,
    clearFilters,
    setSortBy,
    clearSort
  } = useBookFilters(books)

  const handleAddBook = (newBook) => {
    addBook(newBook)
    setShowForm(false)
  }

  const handleUpdateBook = (updatedBook) => {
    updateBook(updatedBook)
    setShowForm(false)
  }

  const handleEditBook = (book) => {
    startEditing(book)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    cancelEditing()
    setShowForm(false)
  }

  const handleOpenAddForm = () => {
    cancelEditing()
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <ColorPicker
        bgColors={bgColors}
        setBgColors={setBgColors}
        fontColor={fontColor}
        setFontColor={setFontColor}
      />

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
                    handleOpenAddForm()
                  }
                }}
              >
                {showForm ? 'Cancel' : 'Add book'}
              </button>

              {books.length > 0 && (
                <FilterSort
                  filters={filters}
                  sortBy={sortBy}
                  filterOptions={filterOptions}
                  hasActiveFilters={hasActiveFilters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                  onSortChange={setSortBy}
                  onClearSort={clearSort}
                />
              )}
            </div>

            {books.length === 0 ? (
              <div className="books-grid">
                <p>No books yet. Add your first book!</p>
              </div>
            ) : (
              <BookList
                books={sortedBooks}
                onEditBook={handleEditBook}
                onDeleteBook={deleteBook}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
