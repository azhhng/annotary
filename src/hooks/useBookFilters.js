import { useState, useMemo } from "react";

export function useBookFilters(books) {
  const [filters, setFilters] = useState({
    genre: "",
    rating: "",
    tag: "",
    author: "",
    emoji: "",
  });
  const [sortBy, setSortBy] = useState("");

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      genre: "",
      rating: "",
      tag: "",
      author: "",
      emoji: "",
    });
  };

  const clearSort = () => {
    setSortBy("");
  };

  const filterOptions = useMemo(
    () => ({
      genres: [...new Set(books.flatMap((book) => book.genres || []))].sort(),
      ratings: [...new Set(books.map((book) => book.rating))].sort(
        (a, b) => b - a
      ),
      tags: [...new Set(books.flatMap((book) => book.tags || []))],
      authors: [...new Set(books.flatMap((book) => book.authors || []))].sort(),
      emojis: [...new Set(books.flatMap((book) => book.emojis || []))],
    }),
    [books]
  );

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const genreMatch =
        !filters.genre || (book.genres && book.genres.includes(filters.genre));
      const ratingMatch =
        !filters.rating || book.rating === parseFloat(filters.rating);
      const tagMatch =
        !filters.tag || (book.tags && book.tags.includes(filters.tag));
      const authorMatch =
        !filters.author ||
        (book.authors && book.authors.includes(filters.author));
      const emojiMatch =
        !filters.emoji || (book.emojis && book.emojis.includes(filters.emoji));

      return genreMatch && ratingMatch && tagMatch && authorMatch && emojiMatch;
    });
  }, [books, filters]);

  const sortedBooks = useMemo(() => {
    const getLastName = (fullName) => {
      const names = fullName.trim().split(" ");
      return names[names.length - 1];
    };

    return [...filteredBooks].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "title":
          return a.title.localeCompare(b.title);
        case "author": {
          const aAuthor = a.authors?.[0] || "";
          const bAuthor = b.authors?.[0] || "";
          return getLastName(aAuthor).localeCompare(getLastName(bAuthor));
        }
        case "dateFinished":
          if (!a.dateFinished && !b.dateFinished) return 0;
          if (!a.dateFinished) return 1;
          if (!b.dateFinished) return -1;
          return new Date(b.dateFinished) - new Date(a.dateFinished);
        default:
          return 0;
      }
    });
  }, [filteredBooks, sortBy]);

  const hasActiveFilters =
    filters.genre ||
    filters.rating ||
    filters.tag ||
    filters.author ||
    filters.emoji;

  return {
    filters,
    sortBy,
    filterOptions,
    sortedBooks,
    hasActiveFilters,
    handleFilterChange,
    clearFilters,
    setSortBy,
    clearSort,
  };
}
