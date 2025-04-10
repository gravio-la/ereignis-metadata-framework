export const hidden = (visible: boolean, display?: string) => ({
  display: !visible ? "none" : display || "block",
});
