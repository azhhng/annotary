import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useFeed() {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const transformDbToFeedItem = (dbRow) => ({
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
    createdAt: dbRow.created_at,
    userId: dbRow.user_id,
    username: dbRow.journalers?.username || 'Anonymous',
  });

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);

      const { data: bookEntries, error: bookError } = await supabase
        .from('book_entries')
        .select(`
          *,
          journalers!inner(username)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (bookError) {
        console.error('Error fetching with journalers:', bookError);
        // Fallback: try without journalers table
        const { data: fallbackEntries, error: fallbackError } = await supabase
          .from('book_entries')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(50);

        if (fallbackError) throw fallbackError;

        const transformedItems = fallbackEntries.map(item => ({
          ...transformDbToFeedItem(item),
          username: 'Anonymous'
        }));
        setFeedItems(transformedItems);
        return;
      }

      const transformedItems = bookEntries.map(item => transformDbToFeedItem(item));
      setFeedItems(transformedItems);

    } catch (error) {
      console.error('Error fetching feed:', error);
      setFeedItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return {
    feedItems,
    loading,
    refreshFeed: fetchFeed,
  };
}
