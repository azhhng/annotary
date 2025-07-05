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
export const RATING_OPTIONS = [null, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
export const RATING_LABELS = {
  null: "Not rated yet",
  0.5: "0.5",
  1: "1",
  1.5: "1.5", 
  2: "2",
  2.5: "2.5",
  3: "3",
  3.5: "3.5",
  4: "4", 
  4.5: "4.5",
  5: "5"
};

// Book status constants
export const BOOK_STATUS = {
  WANT_TO_READ: "want_to_read",
  CURRENTLY_READING: "currently_reading", 
  READ: "read",
  DNF: "dnf"
};

export const BOOK_STATUS_LABELS = {
  [BOOK_STATUS.WANT_TO_READ]: "Want to read",
  [BOOK_STATUS.CURRENTLY_READING]: "Currently reading",
  [BOOK_STATUS.READ]: "Read",
  [BOOK_STATUS.DNF]: "Did not finish"
};

export const BOOK_STATUS_OPTIONS = [
  BOOK_STATUS.WANT_TO_READ,
  BOOK_STATUS.CURRENTLY_READING,
  BOOK_STATUS.READ,
  BOOK_STATUS.DNF
];

// Default form values
export const DEFAULT_BOOK_FORM = {
  title: "",
  authors: [],
  genres: [],
  dateStarted: "",
  dateFinished: "",
  rating: null, // Default to "Not rated yet"
  notes: "",
  tags: [],
  emojis: [],
  isPublic: false,
  status: BOOK_STATUS.WANT_TO_READ, // Default to "Want to read"
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
