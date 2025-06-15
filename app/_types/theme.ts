export type ThemeMode = "system" | "light" | "dark";
export interface Theme {
  id: string;
  cssClassName: string;
  label: string;
  colors: [string, string]; // Tuple of exactly 2 color strings primary and accent
  description: string;
  isUserCreated: boolean;
}

export type ThemeStore = Theme | null;

export type GeneratedTheme = Theme & {
  primaryColor: { light: string; dark: string };
  primaryContrast: { light: string; dark: string };
  useSeparateAccent: boolean;
  accentColor: { light: string; dark: string };
  accentContrast: { light: string; dark: string };
  useSeparateDarkMode: boolean;
  css: string;
  createdAt: string; // ISO timestamp
};

export type ThemePalette = {
  light: string;
  dark: string;
};
