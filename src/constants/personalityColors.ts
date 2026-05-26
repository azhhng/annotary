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
  blush: createPersonalityColor("#ffb3c9", "#d8588a"),
  sun: createPersonalityColor("#ffd966", "#d49a1a"),
  ember: createPersonalityColor("#ffae7a", "#d96a2c"),
  frost: createPersonalityColor("#9bd5f0", "#3a8ab8"),
  sage: createPersonalityColor("#a8e0a0", "#52a548"),
  violet: createPersonalityColor("#c8a8e8", "#7a52b8"),
  rose: createPersonalityColor("#f56565", "#c0292e"),
  slate: createPersonalityColor("#8aacd0", "#3f5f85"),
  onyx: createPersonalityColor("#8a8aa0", "#3a3a4a"),
  basic: createPersonalityColor("#c8a8b8", "#7a4a62"),
} satisfies Record<string, PersonalityColor>;

const colorByWord: Record<string, PersonalityColor> = {
  Spring: personalityColors.sage,
  Summer: personalityColors.sun,
  Autumn: personalityColors.ember,
  Winter: personalityColors.frost,

  // LIGHT BLUE
  Calm: personalityColors.frost,
  Quiet: personalityColors.frost,
  Gentle: personalityColors.frost,
  Empathetic: personalityColors.frost,
  Loyal: personalityColors.frost,
  Reliable: personalityColors.frost,

  // ORANGE
  Nurturing: personalityColors.ember,
  Sensitive: personalityColors.ember,
  Sentimental: personalityColors.ember,
  Nostalgic: personalityColors.ember,
  Melancholic: personalityColors.ember,

  // RED
  Tortured: personalityColors.rose,
  Anxious: personalityColors.rose,
  Restless: personalityColors.rose,
  Scattered: personalityColors.rose,
  Indecisive: personalityColors.rose,
  Avoidant: personalityColors.rose,
  Defensive: personalityColors.rose,
  Fierce: personalityColors.rose,
  Passionate: personalityColors.rose,

  // PURPLE
  Dramatic: personalityColors.violet,
  Obsessive: personalityColors.violet,
  Ambitious: personalityColors.violet,
  Daring: personalityColors.violet,
  Adventurous: personalityColors.violet,
  Chaotic: personalityColors.violet,
  Mischievous: personalityColors.violet,
  Rebellious: personalityColors.violet,
  Independent: personalityColors.violet,

  // BLACK
  Stubborn: personalityColors.onyx,
  Selective: personalityColors.onyx,
  Pretentious: personalityColors.onyx,
  Contrarian: personalityColors.onyx,

  // DARK BLUE
  Analytical: personalityColors.slate,
  Predictable: personalityColors.slate,
  Practical: personalityColors.slate,
  Academic: personalityColors.slate,
  Philosophical: personalityColors.slate,
  Perceptive: personalityColors.slate,

  // YELLOW
  Curious: personalityColors.sun,
  Whimsical: personalityColors.sun,
  Silly: personalityColors.sun,
  Spontaneous: personalityColors.sun,
  Carefree: personalityColors.sun,

  // PINK
  Charming: personalityColors.blush,
  Witty: personalityColors.blush,
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
