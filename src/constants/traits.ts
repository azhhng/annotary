import type { TraitAnswers, TraitQuestion } from "../types";

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
    key: "birthOrder",
    title: "Birth order",
    selfTitle: "What birth order are you?",
    othersTitle: "What birth order are they?",
    options: ["Only", "Youngest", "Middle", "Eldest"],
  },
  {
    key: "lifePerspective",
    title: "Life perspective",
    options: ["Optimistic", "Realistic", "Pessimistic"],
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
    key: "outsidePreference",
    title: "Preferred destination",
    options: ["City", "Beach", "Mountains"],
  },
  {
    key: "tastePreference",
    title: "Preferred taste",
    selfTitle: "What taste do you prefer?",
    othersTitle: "Preferred taste",
    options: ["Sweet", "Savory", "Sour"],
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

export const othersTraitQuestions: TraitQuestion[] = traitQuestions;

export function createEmptyTraitAnswers(
  questions: TraitQuestion[] = traitQuestions,
): TraitAnswers {
  return Object.fromEntries(
    questions.map((question) => [question.key, ""]),
  ) as TraitAnswers;
}

export function hasAllTraitAnswers(
  answers: Partial<TraitAnswers> | null | undefined,
  questions: TraitQuestion[] = traitQuestions,
) {
  return questions.every((question) => {
    const answer = answers?.[question.key];

    return typeof answer === "string" && answer.trim().length > 0;
  });
}
