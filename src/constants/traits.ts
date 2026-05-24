import type { TraitAnswerKey, TraitAnswers, TraitQuestion } from "../types";

export const zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export const traitQuestions: TraitQuestion[] = [
  {
    key: "socialEnergy",
    title: "Social energy",
    options: ["Introverted", "Ambiverted", "Extroverted"],
  },
  {
    key: "lifePerspective",
    title: "Life perspective",
    options: ["Optimistic", "Realistic", "Pessimistic"],
  },
  {
    key: "emotionalOutlook",
    title: "Emotional outlook",
    options: ["Romantic", "Idealistic", "Cynical"],
  },
  {
    key: "reasoningStyle",
    title: "Reasoning style",
    options: ["Emotional", "Logical"],
  },
  {
    key: "personalityType",
    title: "Personality type",
    options: ["Type A", "Type B"],
  },
  {
    key: "favoriteSeason",
    title: "Favorite season",
    options: ["Spring", "Summer", "Autumn", "Winter"],
  },
  {
    key: "zodiacSign",
    title: "Zodiac sign",
    selfTitle: "What is your zodiac sign?",
    othersTitle: "Zodiac guess",
    options: zodiacSigns,
    wide: true,
  },
];

// The Others tab leads with life perspective rather than social energy so the
// describer starts with something inferrable from book choices instead of a
// trait that requires meeting the person. Keep both orderings co-located.
const othersTraitOrder: TraitAnswerKey[] = [
  "lifePerspective",
  "emotionalOutlook",
  "reasoningStyle",
  "personalityType",
  "socialEnergy",
  "favoriteSeason",
  "zodiacSign",
];

export const othersTraitQuestions: TraitQuestion[] = othersTraitOrder
  .map((key) => traitQuestions.find((question) => question.key === key))
  .filter((question): question is TraitQuestion => question !== undefined);

export const defaultTraitAnswers: TraitAnswers = {
  socialEnergy: "Introverted",
  lifePerspective: "Realistic",
  emotionalOutlook: "Romantic",
  reasoningStyle: "Emotional",
  personalityType: "Type B",
  favoriteSeason: "Autumn",
  zodiacSign: "Cancer",
};
