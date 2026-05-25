export type Screen =
  | "shelf"
  | "daily"
  | "essence"
  | "about"
  | "settings"
  | "privacy"
  | "terms"
  | "community";

export type BookSlot =
  | "love_1"
  | "love_2"
  | "hate"
  | "conflicted"
  | "live_in"
  | "childhood_memory";

export type Book = {
  slot: BookSlot;
  label: string;
  question?: string;
  title: string;
  author: string;
  why: string;
};

export type ShelfBookInput = {
  slot: BookSlot;
  title: string;
  author: string;
  why: string;
};

export type ShelfSetupInput = {
  books: ShelfBookInput[];
  selfAnswers: TraitAnswers;
  selfAdjectives: string[];
};

export type TraitAnswerKey =
  | "socialEnergy"
  | "lifePerspective"
  | "birthOrder"
  | "reasoningStyle"
  | "personalityType"
  | "favoriteSeason"
  | "zodiacSign";

export type TraitAnswers = Record<TraitAnswerKey, string>;

export type TraitQuestion = {
  key: TraitAnswerKey;
  title: string;
  selfTitle?: string;
  othersTitle?: string;
  options: string[];
  wide?: boolean;
};

export type TraitAnswerResult = {
  question: string;
  self: string;
  strangers: Array<{ value: string; count: number }>;
};

export type AdjectiveCount = {
  word: string;
  count: number;
};

export type DescriptionInput = {
  profileId: string;
  answers: TraitAnswers;
  adjectives: string[];
};

export type ReportReason =
  | "adult_content"
  | "harassment"
  | "plot_spoilers"
  | "self_promotion"
  | "solicitation"
  | "other";

export type ProfileReveal = {
  answers: TraitAnswers;
  adjectives: string[];
};

export type ProfileToDescribe = {
  id: string;
  books: Book[];
};

export type EssenceResults = {
  answers: TraitAnswerResult[];
  selfAdjectives: string[];
  strangerAdjectives: AdjectiveCount[];
};
