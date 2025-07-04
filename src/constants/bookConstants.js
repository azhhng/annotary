// Book form validation constants
export const VALIDATION_LIMITS = {
  MAX_GENRES: 5,
  MAX_TAGS: 15,
  MAX_EMOJIS: 3,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 6,
};

// Rating constants
export const RATING_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

// Default form values
export const DEFAULT_BOOK_FORM = {
  title: "",
  authors: [],
  genres: [],
  dateStarted: "",
  dateFinished: "",
  rating: 2.5,
  notes: "",
  tags: [],
  emojis: [],
  isPublic: false,
};

// Validation messages
export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: "Please fill in at least the title and one author",
  GENRE_DUPLICATE: "This genre is already added",
  GENRE_LIMIT: `Maximum of ${VALIDATION_LIMITS.MAX_GENRES} genres allowed`,
  TAG_DUPLICATE: "This tag is already added",
  TAG_LIMIT: `Maximum of ${VALIDATION_LIMITS.MAX_TAGS} tags allowed`,
  EMOJI_DUPLICATE: "This emoji is already added",
  EMOJI_LIMIT: `Maximum of ${VALIDATION_LIMITS.MAX_EMOJIS} emojis allowed`,
  EMOJI_FORMAT: "Please enter only emojis (no letters or numbers)",
};
