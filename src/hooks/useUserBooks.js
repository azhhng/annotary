import { useState, useEffect, useCallback } from "react";
import { booksApi, journalersApi } from "../services/api";

export function useUserBooks(username) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

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

  const fetchUserBooks = useCallback(async () => {
    if (!username) return;

    try {
      setLoading(true);
      
      const journalerData = await journalersApi.getJournalerByUsername(username);
      setUserInfo(journalerData);

      const bookData = await booksApi.getPublicBooks(journalerData.user_id);
      const transformedBooks = bookData.map(transformDbToBook);
      setBooks(transformedBooks);
    } catch (error) {
      console.error('Error fetching user books:', error);
      setUserInfo(null);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const journalerData = await journalersApi.getJournalerByUsername(username);
        setUserInfo(journalerData);

        const bookData = await booksApi.getPublicBooks(journalerData.user_id);
        const transformedBooks = bookData.map(transformDbToBook);
        setBooks(transformedBooks);
      } catch (error) {
        console.error('Error fetching user books:', error);
        setUserInfo(null);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return {
    books,
    loading,
    userInfo,
    refreshBooks: fetchUserBooks,
  };
}