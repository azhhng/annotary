export const COLORS = {
  PRIMARY_GRADIENT_START: "#667eea",
  PRIMARY_GRADIENT_END: "#764ba2",
  PRIMARY_FONT: "#ffffff",
};

export const createGradientBackground = (startColor, endColor) =>
  `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;

export const isValidHex = (hex) => /^#[0-9A-F]{6}$/i.test(hex);

export const getValidColor = (color, fallback) => 
  isValidHex(color) ? color : fallback;
