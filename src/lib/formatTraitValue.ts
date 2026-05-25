import type { TraitAnswerKey } from "../types";

// append child to end of birth order answers when not being displayed in essences table
// append -loving to end of favorite season answers when not being displayed in essences table
export function formatTraitValue(key: TraitAnswerKey, value: string): string {
  if (!value) return value;
  if (key === "birthOrder") return `${value} child`;
  if (key === "favoriteSeason") return `${value}-loving`;
  return value;
}
