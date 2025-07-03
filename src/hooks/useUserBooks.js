import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

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

  const fetchUserBooks = async () => {
    if (!username) return;

    try {
      setLoading(true);
      
      // First, get the user info by username
      const { data: journalerData, error: journalerError } = await supabase
        .from('journalers')
        .select('*')
        .eq('username', username)
        .single();

      if (journalerError) {
        console.error('Error fetching journaler:', journalerError);
        setUserInfo(null);
        setBooks([]);
        return;
      }

      setUserInfo(journalerData);

      // Then fetch their books
      const { data: bookData, error: bookError } = await supabase
        .from('book_entries')
        .select('*')
        .eq('user_id', journalerData.user_id)
        .eq('is_public', true) // Only show public books when viewing other users
        .order('created_at', { ascending: false });

      if (bookError) throw bookError;

      const transformedBooks = bookData.map(transformDbToBook);
      setBooks(transformedBooks);
    } catch (error) {
      console.error('Error fetching user books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBooks();
  }, [username]);

  return {
    books,
    loading,
    userInfo,
    refreshBooks: fetchUserBooks,
  };
}