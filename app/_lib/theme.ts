export type ThemeMode = "system" | "light" | "dark";

export const applyTheme = (themeClassName: string, isDark: boolean = false) => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  // Remove existing theme classes
  const classesToRemove: string[] = [];
  root.classList.forEach((cls) => {
    if (cls.startsWith("theme-")) {
      classesToRemove.push(cls);
    }
  });
  classesToRemove.forEach((cls) => root.classList.remove(cls));

  // Add new theme class
  if (themeClassName && themeClassName.trim() !== "") {
    root.classList.add(themeClassName);
  }

  // Apply dark mode
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export const saveThemePreferences = (
  themeClassName: string,
  themeMode: ThemeMode,
) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("theme", themeClassName);
      localStorage.setItem("themeMode", themeMode);
    } catch (error) {
      console.warn("Failed to save theme preferences:", error);
    }
  }
};

export const loadThemePreferences = (): {
  theme: string;
  themeMode: ThemeMode;
} => {
  if (typeof window !== "undefined") {
    try {
      const theme = localStorage.getItem("theme") || "";
      const savedThemeMode = localStorage.getItem("themeMode") as ThemeMode;

      // Default to 'system' if no saved preference or invalid value
      const themeMode: ThemeMode =
        savedThemeMode && ["system", "light", "dark"].includes(savedThemeMode)
          ? savedThemeMode
          : "system";

      return { theme, themeMode };
    } catch (error) {
      console.warn("Failed to load theme preferences:", error);
      return { theme: "", themeMode: "system" };
    }
  }
  return { theme: "", themeMode: "system" };
};

// Utility function to get current system theme
export const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

// Utility function to get effective theme mode
export const getEffectiveTheme = (themeMode: ThemeMode): "light" | "dark" => {
  if (themeMode === "system") {
    return getSystemTheme();
  }
  return themeMode;
};
