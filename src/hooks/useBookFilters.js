import { useState, useMemo } from "react";

export function useBookFilters(books) {
  const [filters, setFilters] = useState({
    genre: "",
    rating: "",
    tag: "",
    author: "",
    emoji: "",
    status: "",
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
      status: "",
    });
  };

  const clearSort = () => {
    setSortBy("");
  };

  const filterOptions = useMemo(() => {
    if (!books.length) {
      return {
        genres: [],
        ratings: [],
        tags: [],
        authors: [],
        emojis: [],
        statuses: [],
      };
    }

    const genreSet = new Set();
    const ratingSet = new Set();
    const tagSet = new Set();
    const authorSet = new Set();
    const emojiSet = new Set();
    const statusSet = new Set();

    for (const book of books) {
      if (book.genres) {
        for (const genre of book.genres) {
          genreSet.add(genre);
        }
      }
      if (book.rating !== undefined && book.rating !== null) {
        ratingSet.add(book.rating);
      } else if (book.rating === null) {
        ratingSet.add("Not rated yet");
      }
      if (book.tags) {
        for (const tag of book.tags) {
          tagSet.add(tag);
        }
      }
      if (book.authors) {
        for (const author of book.authors) {
          authorSet.add(author);
        }
      }
      if (book.emojis) {
        for (const emoji of book.emojis) {
          emojiSet.add(emoji);
        }
      }
      if (book.status) {
        statusSet.add(book.status);
      }
    }

    return {
      genres: Array.from(genreSet).sort(),
      ratings: Array.from(ratingSet).sort((a, b) => b - a),
      tags: Array.from(tagSet),
      authors: Array.from(authorSet).sort(),
      emojis: Array.from(emojiSet),
      statuses: Array.from(statusSet),
    };
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const genreMatch =
        !filters.genre || (book.genres && book.genres.includes(filters.genre));
      const ratingMatch =
        !filters.rating ||
        (filters.rating === "Not rated yet" && book.rating === null) ||
        (filters.rating !== "Not rated yet" &&
          book.rating === parseFloat(filters.rating));
      const tagMatch =
        !filters.tag || (book.tags && book.tags.includes(filters.tag));
      const authorMatch =
        !filters.author ||
        (book.authors && book.authors.includes(filters.author));
      const emojiMatch =
        !filters.emoji || (book.emojis && book.emojis.includes(filters.emoji));
      const statusMatch =
        !filters.status || book.status === filters.status;

      return genreMatch && ratingMatch && tagMatch && authorMatch && emojiMatch && statusMatch;
    });
  }, [books, filters]);

  const sortedBooks = useMemo(() => {
    const getLastName = (fullName) => {
      const names = fullName.trim().split(" ");
      return names[names.length - 1];
    };

    const getTitleForSorting = (title) => {
      return title.replace(/^(The\s+)/i, "").trim();
    };

    return [...filteredBooks].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          // Handle null ratings in sorting - put unrated books at the end
          if (a.rating === null && b.rating === null) return 0;
          if (a.rating === null) return 1;
          if (b.rating === null) return -1;
          return b.rating - a.rating;
        case "title":
          return getTitleForSorting(a.title).localeCompare(
            getTitleForSorting(b.title)
          );
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
    filters.emoji ||
    filters.status;

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
