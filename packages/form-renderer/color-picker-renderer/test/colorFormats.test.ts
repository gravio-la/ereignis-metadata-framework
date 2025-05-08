import Ajv from "ajv";
import { addColorFormatsToAjv } from "../src/ajvColorFormats";

// Regular expressions for different color formats
const COLOR_FORMATS = {
  hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  rgb: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
  rgba: /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/,
  hsl: /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/,
  hsla: /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(0|1|0?\.\d+)\s*\)$/,
};

// Validation functions for color formats
const COLOR_VALIDATORS = {
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

// Test cases for each color format
const testCases = {
  hex: {
    valid: ["#ff0000", "#f00", "#00ff00", "#0f0", "#0000ff", "#00f"],
    invalid: ["#ff", "#ffff", "#fffffff", "ff0000", "rgb(255,0,0)"],
  },
  rgb: {
    valid: [
      "rgb(255, 0, 0)",
      "rgb(0, 255, 0)",
      "rgb(0, 0, 255)",
      "rgb(100, 100, 100)",
    ],
    invalid: [
      "rgb(256, 0, 0)",
      "rgb(-1, 0, 0)",
      "rgb(0, 0)",
      "rgb(0, 0, 0, 0)",
    ],
  },
  rgba: {
    valid: [
      "rgba(255, 0, 0, 0.5)",
      "rgba(0, 255, 0, 1)",
      "rgba(0, 0, 255, 0)",
      "rgba(100, 100, 100, 0.75)",
    ],
    invalid: [
      "rgba(256, 0, 0, 0.5)",
      "rgba(0, 0, 0, 1.1)",
      "rgba(0, 0, 0, -0.1)",
      "rgb(0, 0, 0)",
    ],
  },
  hsl: {
    valid: [
      "hsl(0, 100%, 50%)",
      "hsl(120, 100%, 50%)",
      "hsl(240, 100%, 50%)",
      "hsl(180, 50%, 50%)",
    ],
    invalid: [
      "hsl(361, 100%, 50%)",
      "hsl(0, 101%, 50%)",
      "hsl(0, 100%, 101%)",
      "hsl(0, 100)",
    ],
  },
  hsla: {
    valid: [
      "hsla(0, 100%, 50%, 0.5)",
      "hsla(120, 100%, 50%, 1)",
      "hsla(240, 100%, 50%, 0)",
      "hsla(180, 50%, 50%, 0.75)",
    ],
    invalid: [
      "hsla(361, 100%, 50%, 0.5)",
      "hsla(0, 101%, 50%, 0.5)",
      "hsla(0, 100%, 101%, 0.5)",
      "hsla(0, 100%, 50%, 1.1)",
    ],
  },
};

describe("Color Format Validators", () => {
  const ajv = new Ajv();

  // Add all color format validators to AJV
  addColorFormatsToAjv(ajv);

  // Test each color format
  Object.entries(testCases).forEach(([format, cases]) => {
    describe(`${format} format`, () => {
      const schema = {
        type: "string",
        format: format,
      };

      const validate = ajv.compile(schema);

      cases.valid.forEach((value) => {
        test(`should validate ${value}`, () => {
          expect(validate(value)).toBe(true);
        });
      });

      cases.invalid.forEach((value) => {
        test(`should invalidate ${value}`, () => {
          expect(validate(value)).toBe(false);
        });
      });
    });
  });
});
