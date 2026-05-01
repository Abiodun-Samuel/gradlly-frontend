export function createViewport({ themeColor = "#3b62f6" } = {}) {
  return {
    width: "device-width",
    initialScale: 1,
    themeColor,
  };
}
