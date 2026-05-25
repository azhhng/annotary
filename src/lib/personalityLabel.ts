import type { TraitAnswerKey, TraitAnswers } from "../types";

const traitOrder: TraitAnswerKey[] = [
  "socialEnergy",
  "lifePerspective",
  "birthOrder",
  "reasoningStyle",
  "personalityType",
  "favoriteSeason",
  "zodiacSign",
];

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function articleFor(word: string) {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function joinWithAnd(words: string[]) {
  if (words.length === 0) return "";
  if (words.length === 1) return words[0];
  if (words.length === 2) return `${words[0]} and ${words[1]}`;

  return `${words.slice(0, -1).join(", ")}, and ${words[words.length - 1]}`;
}

export function buildPersonalityLabel(
  answers: Partial<TraitAnswers> | null | undefined,
  adjectives: string[] | null | undefined,
): string | null {
  if (!answers) return null;

  const slugs = traitOrder
    .map((key) => answers[key])
    .filter((value): value is string => Boolean(value && value.trim()))
    .map(slugify);

  if (slugs.length === 0) return null;

  const traitSlug = slugs.join("-");
  const adjectivePhrase = joinWithAnd(
    (adjectives ?? []).map((word) => word.toLowerCase()),
  );

  const noun = `${articleFor(traitSlug)} ${traitSlug}`;

  return adjectivePhrase ? `${noun} who is ${adjectivePhrase}` : noun;
}
