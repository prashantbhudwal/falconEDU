export type ColorOption = "primary" | "secondary" | "gray" | "white" | "";
export type ThemeColor = {
  text: string;
  h2: string;
  h1: string;
  border: string;
  bg: string;
};

export type Theme = {
  [K in ColorOption]?: ThemeColor;
};
