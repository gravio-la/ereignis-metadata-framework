import Ajv from "ajv";

// Regular expressions for different color formats
export const COLOR_FORMATS = {
  hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  rgb: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
  rgba: /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/,
  hsl: /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/,
  hsla: /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(0|1|0?\.\d+)\s*\)$/,
};

// Validation functions for color formats
export const COLOR_VALIDATORS = {
  hex: (str: string) => COLOR_FORMATS.hex.test(str),
  rgb: (str: string) => {
    const match = str.match(COLOR_FORMATS.rgb);
    if (!match) return false;
    const [r, g, b] = match.slice(1).map(Number);
    return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
  },
  rgba: (str: string) => {
    const match = str.match(COLOR_FORMATS.rgba);
    if (!match) return false;
    const [r, g, b, a] = match.slice(1).map(Number);
    return (
      r >= 0 &&
      r <= 255 &&
      g >= 0 &&
      g <= 255 &&
      b >= 0 &&
      b <= 255 &&
      a >= 0 &&
      a <= 1
    );
  },
  hsl: (str: string) => {
    const match = str.match(COLOR_FORMATS.hsl);
    if (!match) return false;
    const [h, s, l] = match.slice(1).map(Number);
    return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
  },
  hsla: (str: string) => {
    const match = str.match(COLOR_FORMATS.hsla);
    if (!match) return false;
    const [h, s, l, a] = match.slice(1).map(Number);
    return (
      h >= 0 &&
      h <= 360 &&
      s >= 0 &&
      s <= 100 &&
      l >= 0 &&
      l <= 100 &&
      a >= 0 &&
      a <= 1
    );
  },
};

export function addColorFormatsToAjv(ajv: Ajv) {
  Object.entries(COLOR_VALIDATORS).forEach(([format, validator]) => {
    ajv.addFormat(format, validator);
  });
}
