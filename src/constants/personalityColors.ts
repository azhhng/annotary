type PersonalityColor = {
  background: string;
  border: string;
  text: string;
  fill: string;
};

function withAlpha(hexColor: string, alpha: number) {
  const hex = hexColor.replace("#", "");
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function createPersonalityColor(tint: string, text: string): PersonalityColor {
  return {
    background: withAlpha(tint, 0.18),
    border: withAlpha(tint, 0.55),
    text,
    fill: withAlpha(tint, 0.82),
  };
}

const personalityColors = {
  blush: createPersonalityColor("#ff7aa8", "#c43a6b"),
  sun: createPersonalityColor("#efbe4a", "#db960b"),
  ember: createPersonalityColor("#dc8d68", "#c44510"),
  frost: createPersonalityColor("#4cb8e6", "#1f6e96"),
  sage: createPersonalityColor("#6dd158", "#3a8530"),
  lilac: createPersonalityColor("#ffbe96", "#c9684a"),
  rose: createPersonalityColor("#ff5e7e", "#c43350"),
  slate: createPersonalityColor("#8aa6c2", "#4a5f7a"),
  basic: createPersonalityColor("#856172", "#562a44"),
} satisfies Record<string, PersonalityColor>;

const colorByWord: Record<string, PersonalityColor> = {
  Spring: personalityColors.sage,
  Summer: personalityColors.sun,
  Autumn: personalityColors.ember,
  Winter: personalityColors.frost,
  Nostalgic: personalityColors.blush,
  Melancholic: personalityColors.frost,
  Sentimental: personalityColors.blush,
  Passionate: personalityColors.ember,
  Fierce: personalityColors.ember,
  Obsessive: personalityColors.rose,
  Restless: personalityColors.sun,
  Whimsical: personalityColors.lilac,
  Chaotic: personalityColors.ember,
  Silly: personalityColors.sun,
  Spontaneous: personalityColors.sun,
  Mischievous: personalityColors.rose,
  Practical: personalityColors.sage,
  Calm: personalityColors.frost,
  Reliable: personalityColors.sage,
  Rebellious: personalityColors.ember,
  Daring: personalityColors.ember,
  Contrarian: personalityColors.slate,
  Gentle: personalityColors.sage,
  Empathetic: personalityColors.blush,
  Nurturing: personalityColors.sage,
  Witty: personalityColors.sun,
  Perceptive: personalityColors.frost,
  Curious: personalityColors.lilac,
  Adventurous: personalityColors.sun,
  Sensitive: personalityColors.blush,
  Ambitious: personalityColors.ember,
  Stubborn: personalityColors.slate,
  Loyal: personalityColors.sage,
  Anxious: personalityColors.frost,
  Dramatic: personalityColors.rose,
  Quiet: personalityColors.frost,
  Independent: personalityColors.slate,
  Pretentious: personalityColors.lilac,
  Predictable: personalityColors.sage,
  Indecisive: personalityColors.lilac,
  Avoidant: personalityColors.slate,
  Scattered: personalityColors.sun,
  Selective: personalityColors.slate,
  Defensive: personalityColors.ember,
  Tortured: personalityColors.slate,
  Charming: personalityColors.blush,
  Carefree: personalityColors.sun,
  Philosophical: personalityColors.lilac,
  Academic: personalityColors.slate,
  Analytical: personalityColors.frost,
};

export function getPersonalityColor(word: string) {
  return colorByWord[word] ?? personalityColors.basic;
}

export function tintedPillStyle(word: string) {
  const color = getPersonalityColor(word);
  return {
    backgroundColor: color.background,
    borderColor: color.border,
  };
}

export function tintedTextStyle(word: string) {
  return {
    color: getPersonalityColor(word).text,
  };
}

export function pickerTintedPillStyle(word: string) {
  const color = getPersonalityColor(word);
  return {
    backgroundColor: withAlpha(color.fill, 0.08),
    borderColor: withAlpha(color.text, 0.22),
  };
}

export function pickerSelectedPillStyle(word: string) {
  const color = getPersonalityColor(word);
  return {
    backgroundColor: color.background,
    borderColor: color.text,
  };
}

export function tintedActiveStyle(word: string) {
  const color = getPersonalityColor(word);
  return {
    backgroundColor: withAlpha(color.text, 0.6),
    borderColor: color.text,
  };
}

export function tintedActiveTextStyle() {
  return {
    color: "#ffffff",
  };
}
