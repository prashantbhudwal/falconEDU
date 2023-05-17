export type ColorOption =
  | "primary"
  | "secondary"
  | "gray"
  | "white"
  | "primaryGray"
  | "secondaryGray"
  | "";

export type ThemeColor = {
  text: string;
  h2: string;
  h1: string;
  border: string;
  bg: string;
  ring: string;
  shadow: string;
  textBase: string;
};

export type Theme = {
  [K in ColorOption]?: ThemeColor;
};
