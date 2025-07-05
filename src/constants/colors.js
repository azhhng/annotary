const getCSSVariable = (variableName) =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

export const COLORS = {
  get PRIMARY_GRADIENT_START() {
    return getCSSVariable("--primary-gradient-start");
  },
  get PRIMARY_GRADIENT_END() {
    return getCSSVariable("--primary-gradient-end");
  },
  get PRIMARY_FONT() {
    return getCSSVariable("--font-color");
  },
  get GOLD() {
    return getCSSVariable("--color-gold");
  },
};

export const createGradientBackground = (startColor, endColor) =>
  `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;

export const isValidHex = (hex) => /^#[0-9A-F]{6}$/i.test(hex);

export const getValidColor = (color, fallback) =>
  isValidHex(color) ? color : fallback;
