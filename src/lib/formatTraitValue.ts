import type { TraitAnswerKey } from "../types";

export function formatTraitValue(key: TraitAnswerKey, value: string): string {
  if (!value) return value;
  if (key === "birthOrder") return `${value} child`;
  if (key === "favoriteSeason") return `${value}-loving`;
  if (key === "outsidePreference") return `${value}-going`;
  if (key === "tastePreference") return `${value}-toothed`;
  return value;
}
