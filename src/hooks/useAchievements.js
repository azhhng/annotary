import { useState, useEffect, useCallback } from "react";
import { getAllAchievements } from "../constants/achievementConstants";

export function useAchievements() {
  const [userAchievements, setUserAchievements] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("userAchievements");
    if (stored) {
      setUserAchievements(JSON.parse(stored));
    }
  }, []);

  const saveAchievements = useCallback((achievements) => {
    setUserAchievements(achievements);
    localStorage.setItem("userAchievements", JSON.stringify(achievements));
  }, []);

  const isUnlocked = useCallback(
    (achievementId) => {
      return userAchievements.some(
        (achievement) => achievement.id === achievementId
      );
    },
    [userAchievements]
  );

  // Get progress for an achievement
  const getProgress = useCallback((achievementId, currentValue) => {
    const achievement = getAllAchievements().find(
      (a) => a.id === achievementId
    );
    if (!achievement) return 0;

    if (achievement.type === "emoji_set") {
      return Math.min(currentValue / achievement.target.length, 1);
    }

    return Math.min(currentValue / achievement.target, 1);
  }, []);

  const calculateStats = useCallback((books) => {
    const stats = {
      books_read: 0,
      reviews_written: 0,
      books_rated: 0,
      five_star_ratings: 0,
      unique_emojis: new Set(),
      emojis_used: [],
      horror_books: 0,
      mystery_books: 0,
      romance_books: 0,
      scifi_books: 0,
      fantasy_books: 0,
      fastest_read: null,
      weekly_reads: [],
    };

    books.forEach((book) => {
      // Basic counts - count all books (with or without finish date)
      stats.books_read++;

      if (book.notes && book.notes.trim()) {
        stats.reviews_written++;
      }

      if (book.rating !== null && book.rating !== undefined) {
        stats.books_rated++;
        if (book.rating === 5) {
          stats.five_star_ratings++;
        }
      }

      // Emoji tracking
      if (book.emojis && book.emojis.length > 0) {
        book.emojis.forEach((emoji) => {
          stats.emojis_used.push(emoji);
          stats.unique_emojis.add(emoji);
        });
      }

      // Genre tracking
      if (book.genres && book.genres.length > 0) {
        book.genres.forEach((genre) => {
          const lowerGenre = genre.toLowerCase();
          if (lowerGenre.includes("horror")) stats.horror_books++;
          if (lowerGenre.includes("mystery") || lowerGenre.includes("thriller"))
            stats.mystery_books++;
          if (lowerGenre.includes("romance")) stats.romance_books++;
          if (
            lowerGenre.includes("science fiction") ||
            lowerGenre.includes("sci-fi")
          )
            stats.scifi_books++;
          if (lowerGenre.includes("fantasy")) stats.fantasy_books++;
        });
      }

      // Speed reading calculation
      if (book.dateStarted && book.dateFinished) {
        const startDate = new Date(book.dateStarted);
        const finishDate = new Date(book.dateFinished);
        const daysDiff = Math.ceil(
          (finishDate - startDate) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 0 || daysDiff === 1) {
          if (!stats.fastest_read || daysDiff < stats.fastest_read) {
            stats.fastest_read = daysDiff;
          }
        }
      }
    });

    // Convert Set to number for unique emojis
    stats.unique_emojis = stats.unique_emojis.size;

    return stats;
  }, []);

  const checkAchievements = useCallback(
    (books) => {
      const stats = calculateStats(books);
      const newUnlocked = [];

      getAllAchievements().forEach((achievement) => {
        if (isUnlocked(achievement.id)) return;

        let unlocked = false;

        switch (achievement.type) {
          case "count":
            unlocked = stats[achievement.field] >= achievement.target;
            break;

          case "unique_count":
            unlocked = stats[achievement.field] >= achievement.target;
            break;

          case "emoji_set":
            const hasAllEmojis = achievement.target.every((emoji) =>
              stats.emojis_used.includes(emoji)
            );
            unlocked = hasAllEmojis;
            break;

          case "genre_count":
            unlocked = stats[achievement.field] >= achievement.target;
            break;

          case "same_day_read":
            unlocked = stats.fastest_read !== null && stats.fastest_read <= 1;
            break;

          case "rating_count":
            unlocked = stats[achievement.field] >= achievement.target;
            break;

          case "week_count":
            unlocked = stats.books_read >= achievement.target;
            break;

          default:
            break;
        }

        if (unlocked) {
          newUnlocked.push({
            ...achievement,
            unlockedAt: new Date().toISOString(),
          });
        }
      });

      if (newUnlocked.length > 0) {
        const updatedAchievements = [...userAchievements, ...newUnlocked];
        saveAchievements(updatedAchievements);
      }

      return { stats, newUnlocked };
    },
    [userAchievements, isUnlocked, calculateStats, saveAchievements]
  );

  // Get achievement progress for display
  const getAchievementProgress = useCallback(
    (achievementId, books) => {
      const achievement = getAllAchievements().find(
        (a) => a.id === achievementId
      );
      if (!achievement) return { current: 0, target: 1, percentage: 0 };

      const stats = calculateStats(books);
      let current = 0;

      switch (achievement.type) {
        case "count":
        case "unique_count":
        case "genre_count":
        case "rating_count":
          current = stats[achievement.field] || 0;
          break;

        case "emoji_set":
          current = achievement.target.filter((emoji) =>
            stats.emojis_used.includes(emoji)
          ).length;
          break;

        case "same_day_read":
          current =
            stats.fastest_read !== null && stats.fastest_read <= 1 ? 1 : 0;
          break;

        case "week_count":
          current = stats.books_read;
          break;

        default:
          current = 0;
          break;
      }

      const target =
        achievement.type === "emoji_set"
          ? achievement.target.length
          : achievement.target;
      const percentage = Math.min((current / target) * 100, 100);

      return { current, target, percentage };
    },
    [calculateStats]
  );

  // Initialize achievements based on existing books (call this once when books are loaded)
  const initializeAchievements = useCallback(
    (books) => {
      if (!books || books.length === 0) return;

      if (userAchievements.length === 0) {
        checkAchievements(books);
      }
    },
    [userAchievements, checkAchievements]
  );

  return {
    userAchievements,
    isUnlocked,
    getProgress,
    checkAchievements,
    getAchievementProgress,
    calculateStats,
    initializeAchievements,
  };
}
