export type ColorFormat = "hex" | "rgb" | "rgba" | "hsl" | "hsla";

export const formatColor = (color: any, format: ColorFormat): string => {
  switch (format) {
    case "hex":
      return color.hex;
    case "rgb":
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    case "rgba":
      return `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    case "hsl":
      return `hsl(${Math.round(color.hsl.h)}, ${Math.round(color.hsl.s * 100)}%, ${Math.round(color.hsl.l * 100)}%)`;
    case "hsla":
      return `hsla(${Math.round(color.hsl.h)}, ${Math.round(color.hsl.s * 100)}%, ${Math.round(color.hsl.l * 100)}%, ${color.hsl.a})`;
    default:
      return color.hex;
  }
};
