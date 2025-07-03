import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
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

  const fetchBooks = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('book_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedBooks = data.map(transformDbToBook);
      setBooks(transformedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const addBook = async (newBook) => {
    if (!user) return;

    try {
      const dbBook = transformBookToDb(newBook);
      const { data, error } = await supabase
        .from('book_entries')
        .insert([dbBook])
        .select()
        .single();

      if (error) throw error;

      const transformedBook = transformDbToBook(data);
      setBooks((prev) => [transformedBook, ...prev]);
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const updateBook = async (updatedBook) => {
    if (!user) return;

    try {
      const dbBook = transformBookToDb(updatedBook);
      const { data, error } = await supabase
        .from('book_entries')
        .update(dbBook)
        .eq('id', updatedBook.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const transformedBook = transformDbToBook(data);
      setBooks((prev) =>
        prev.map((book) => (book.id === updatedBook.id ? transformedBook : book))
      );
      setEditingBook(null);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const deleteBook = async (bookId) => {
    if (!user) return;

    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const { error } = await supabase
          .from('book_entries')
          .delete()
          .eq('id', bookId)
          .eq('user_id', user.id);

        if (error) throw error;

        setBooks((prev) => prev.filter((book) => book.id !== bookId));
      } catch (error) {
        console.error('Error deleting book:', error);
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
