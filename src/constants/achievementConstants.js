export const ACHIEVEMENT_CATEGORIES = {
  READING: "reading",
  EMOJI: "emoji",
  SOCIAL: "social",
  SPEED: "speed",
  GENRE: "genre",
  MILESTONE: "milestone",
};

export const ACHIEVEMENTS = {
  // Reading milestones
  FIRST_BOOK: {
    id: "first_book",
    name: "First Steps",
    description: "Read your first book",
    category: ACHIEVEMENT_CATEGORIES.READING,
    icon: "📚",
    target: 1,
    type: "count",
    field: "books_read",
  },
  FIVE_BOOKS: {
    id: "five_books",
    name: "Bookworm",
    description: "Read 5 books",
    category: ACHIEVEMENT_CATEGORIES.READING,
    icon: "📖",
    target: 5,
    type: "count",
    field: "books_read",
  },
  TEN_BOOKS: {
    id: "ten_books",
    name: "Dedicated Reader",
    description: "Read 10 books",
    category: ACHIEVEMENT_CATEGORIES.READING,
    icon: "📗",
    target: 10,
    type: "count",
    field: "books_read",
  },
  TWENTY_FIVE_BOOKS: {
    id: "twenty_five_books",
    name: "Library Regular",
    description: "Read 25 books",
    category: ACHIEVEMENT_CATEGORIES.READING,
    icon: "📘",
    target: 25,
    type: "count",
    field: "books_read",
  },
  FIFTY_BOOKS: {
    id: "fifty_books",
    name: "Bibliophile",
    description: "Read 50 books",
    category: ACHIEVEMENT_CATEGORIES.READING,
    icon: "📙",
    target: 50,
    type: "count",
    field: "books_read",
  },
  HUNDRED_BOOKS: {
    id: "hundred_books",
    name: "Book Master",
    description: "Read 100 books",
    category: ACHIEVEMENT_CATEGORIES.READING,
    icon: "🏆",
    target: 100,
    type: "count",
    field: "books_read",
  },

  // Emoji achievements
  FARM_ANIMALS: {
    id: "farm_animals",
    name: "Down on the Farm",
    description: "Use cow, pig, and chicken emojis in reviews",
    category: ACHIEVEMENT_CATEGORIES.EMOJI,
    icon: "🐄",
    target: ["🐄", "🐷", "🐔"],
    type: "emoji_set",
    field: "emojis_used",
  },
  WEATHER_MASTER: {
    id: "weather_master",
    name: "Weather Reporter",
    description: "Use sun, rain, and snow emojis in reviews",
    category: ACHIEVEMENT_CATEGORIES.EMOJI,
    icon: "🌤️",
    target: ["☀️", "🌧️", "❄️"],
    type: "emoji_set",
    field: "emojis_used",
  },
  EMOJI_ENTHUSIAST: {
    id: "emoji_enthusiast",
    name: "Emoji Enthusiast",
    description: "Use 20 different emojis in reviews",
    category: ACHIEVEMENT_CATEGORIES.EMOJI,
    icon: "😊",
    target: 20,
    type: "unique_count",
    field: "unique_emojis",
  },

  // Genre achievements
  HORROR_FAN: {
    id: "horror_fan",
    name: "Horror Aficionado",
    description: "Read 5 horror books",
    category: ACHIEVEMENT_CATEGORIES.GENRE,
    icon: "👻",
    target: 5,
    type: "genre_count",
    field: "horror_books",
  },
  MYSTERY_SOLVER: {
    id: "mystery_solver",
    name: "Mystery Solver",
    description: "Read 5 mystery books",
    category: ACHIEVEMENT_CATEGORIES.GENRE,
    icon: "🕵️",
    target: 5,
    type: "genre_count",
    field: "mystery_books",
  },
  ROMANCE_READER: {
    id: "romance_reader",
    name: "Hopeless Romantic",
    description: "Read 5 romance books",
    category: ACHIEVEMENT_CATEGORIES.GENRE,
    icon: "💕",
    target: 5,
    type: "genre_count",
    field: "romance_books",
  },
  SCIFI_EXPLORER: {
    id: "scifi_explorer",
    name: "Space Explorer",
    description: "Read 5 science fiction books",
    category: ACHIEVEMENT_CATEGORIES.GENRE,
    icon: "🚀",
    target: 5,
    type: "genre_count",
    field: "scifi_books",
  },
  FANTASY_ADVENTURER: {
    id: "fantasy_adventurer",
    name: "Fantasy Adventurer",
    description: "Read 5 fantasy books",
    category: ACHIEVEMENT_CATEGORIES.GENRE,
    icon: "🐉",
    target: 5,
    type: "genre_count",
    field: "fantasy_books",
  },

  // Speed reading achievements
  SPEED_READER: {
    id: "speed_reader",
    name: "Speed Reader",
    description: "Read a book in 1 day",
    category: ACHIEVEMENT_CATEGORIES.SPEED,
    icon: "⚡",
    target: 1,
    type: "same_day_read",
    field: "fastest_read",
  },
  MARATHON_READER: {
    id: "marathon_reader",
    name: "Marathon Reader",
    description: "Read 3 books in one week",
    category: ACHIEVEMENT_CATEGORIES.SPEED,
    icon: "🏃",
    target: 3,
    type: "week_count",
    field: "weekly_reads",
  },

  // Social achievements
  FIRST_REVIEW: {
    id: "first_review",
    name: "First Thoughts",
    description: "Write your first review",
    category: ACHIEVEMENT_CATEGORIES.SOCIAL,
    icon: "✍️",
    target: 1,
    type: "count",
    field: "reviews_written",
  },
  DETAILED_REVIEWER: {
    id: "detailed_reviewer",
    name: "Detailed Reviewer",
    description: "Write 10 reviews",
    category: ACHIEVEMENT_CATEGORIES.SOCIAL,
    icon: "📝",
    target: 10,
    type: "count",
    field: "reviews_written",
  },
  PROLIFIC_REVIEWER: {
    id: "prolific_reviewer",
    name: "Prolific Reviewer",
    description: "Write 25 reviews",
    category: ACHIEVEMENT_CATEGORIES.SOCIAL,
    icon: "🖊️",
    target: 25,
    type: "count",
    field: "reviews_written",
  },

  // Rating achievements
  CRITIC: {
    id: "critic",
    name: "The Critic",
    description: "Rate 20 books",
    category: ACHIEVEMENT_CATEGORIES.SOCIAL,
    icon: "⭐",
    target: 20,
    type: "count",
    field: "books_rated",
  },
  GENEROUS_RATER: {
    id: "generous_rater",
    name: "Generous Rater",
    description: "Give 5 five-star ratings",
    category: ACHIEVEMENT_CATEGORIES.SOCIAL,
    icon: "🌟",
    target: 5,
    type: "rating_count",
    field: "five_star_ratings",
  },
};

// Helper function to get achievements by category
export const getAchievementsByCategory = (category) => {
  return Object.values(ACHIEVEMENTS).filter(
    (achievement) => achievement.category === category
  );
};

// Helper function to get all achievements as an array
export const getAllAchievements = () => {
  return Object.values(ACHIEVEMENTS);
};

// Helper function to get achievement by ID
export const getAchievementById = (id) => {
  return Object.values(ACHIEVEMENTS).find(
    (achievement) => achievement.id === id
  );
};
