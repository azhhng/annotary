import { useState, useEffect, useCallback } from "react";
import { feedApi } from "../services/api";

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
      const bookEntries = await feedApi.getFeed(50);
      
      const transformedItems = bookEntries.map(item => {
        if (item.journalers) {
          return transformDbToFeedItem(item);
        } else {
          return {
            ...transformDbToFeedItem(item),
            username: 'Anonymous'
          };
        }
      });
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
