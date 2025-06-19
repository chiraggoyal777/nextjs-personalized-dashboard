export type ThemeMode = "system" | "light" | "dark";
export interface Theme {
  id: string;
  cssClassName: string;
  label: string;
  description: string;
  isUserCreated: boolean;
}

export type ThemeStoreOrNull = ThemeStore | null;

export type ThemeStore = Theme & {
  primaryColor: ThemePalette;
  accentColor: ThemePalette;
  useSeparateAccent: boolean;
  useSeparateDarkMode: boolean;
  css: string;
  createdAt: string; // ISO timestamp
  modifiedAt: string; // ISO timestamp
};

export type PaletteState = {
  DEFAULT: string;
  interaction: string;
  contrast: string;
};

export type ThemePalette = {
  light: PaletteState;
  dark: PaletteState;
};

export type ShadesPalette = { [shade: string]: string };

export type ShadesPaletteGroup = Record<keyof ThemePalette, ShadesPalette> | null;
