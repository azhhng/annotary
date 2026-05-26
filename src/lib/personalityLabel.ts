import { traitQuestions } from "../constants/traits";
import type { TraitAnswers } from "../types";
import { formatTraitValue } from "./formatTraitValue";

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

  const slugs = traitQuestions
    .map((question) => {
      const value = answers[question.key];
      if (!value || !value.trim()) return null;
      return slugify(formatTraitValue(question.key, value));
    })
    .filter((slug): slug is string => slug !== null);

  if (slugs.length === 0) return null;

  const traitSlug = slugs.join("-");
  const adjectivePhrase = joinWithAnd(
    (adjectives ?? []).map((word) => word.toLowerCase()),
  );

  const noun = `${articleFor(traitSlug)} ${traitSlug}`;

  return adjectivePhrase ? `${noun} who is ${adjectivePhrase}` : noun;
}
