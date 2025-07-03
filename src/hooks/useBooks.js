import { useState, useEffect } from "react";
import { booksApi } from "../services/api";
import { useAuth } from "./useAuth";

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const transformDbToBook = (dbRow) => ({
    id: dbRow.id,
    title: dbRow.book_title,
    authors: dbRow.authors || [],
    genres: dbRow.genres || [],
    dateStarted: dbRow.date_started,
    dateFinished: dbRow.date_finished,
    rating: dbRow.rating,
    notes: dbRow.notes,
    tags: dbRow.tags || [],
    emojis: dbRow.emojis || [],
    isPublic: dbRow.is_public,
  });

  const transformBookToDb = (book) => ({
    book_title: book.title,
    authors: book.authors || [],
    genres: book.genres || [],
    date_started: book.dateStarted || null,
    date_finished: book.dateFinished || null,
    rating: book.rating,
    notes: book.notes,
    tags: book.tags || [],
    emojis: book.emojis || [],
    is_public: book.isPublic,
    user_id: user?.id,
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await booksApi.getBooks(user.id);
        const transformedBooks = data.map(transformDbToBook);
        setBooks(transformedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const addBook = async (newBook) => {
    if (!user) return;

    try {
      const dbBook = transformBookToDb(newBook);
      const data = await booksApi.createBook(dbBook);
      const transformedBook = transformDbToBook(data);
      setBooks((prev) => [transformedBook, ...prev]);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const updateBook = async (updatedBook) => {
    if (!user) return;

    try {
      const dbBook = transformBookToDb(updatedBook);
      const data = await booksApi.updateBook(updatedBook.id, user.id, dbBook);
      const transformedBook = transformDbToBook(data);
      setBooks((prev) =>
        prev.map((book) =>
          book.id === updatedBook.id ? transformedBook : book
        )
      );
      setEditingBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const deleteBook = async (bookId) => {
    if (!user) return;

    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await booksApi.deleteBook(bookId, user.id);
        setBooks((prev) => prev.filter((book) => book.id !== bookId));
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const startEditing = (book) => {
    setEditingBook(book);
  };

  const cancelEditing = () => {
    setEditingBook(null);
  };

  return {
    books,
    editingBook,
    loading,
    addBook,
    updateBook,
    deleteBook,
    startEditing,
    cancelEditing,
  };
}
