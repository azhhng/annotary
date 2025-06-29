import { useState } from 'react'
import booksData from '../data/books.json'

export function useBooks() {
  const [books, setBooks] = useState(booksData.books)
  const [editingBook, setEditingBook] = useState(null)

  const addBook = (newBook) => {
    setBooks(prev => [...prev, newBook])
  }

  const updateBook = (updatedBook) => {
    setBooks(prev => prev.map(book =>
      book.id === updatedBook.id ? updatedBook : book
    ))
    setEditingBook(null)
  }

  const deleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(prev => prev.filter(book => book.id !== bookId))
    }
  }

  const startEditing = (book) => {
    setEditingBook(book)
  }

  const cancelEditing = () => {
    setEditingBook(null)
  }

  return {
    books,
    editingBook,
    addBook,
    updateBook,
    deleteBook,
    startEditing,
    cancelEditing
  }
}