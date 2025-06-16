import { Client } from "@/types/client";
import { Theme, ThemeMode, ThemeStore } from "@/types/theme";

export const applyTheme = (theme: ThemeStore, isDark: boolean = false) => {
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
  if (theme) {
    root.classList.add(theme.cssClassName);
  }

  // Apply dark mode
  if (isDark) {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.removeProperty("color-scheme");
  }
};

export const saveThemePreferences = (theme: ThemeStore, themeMode: ThemeMode) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("activeTheme", JSON.stringify(theme));
      localStorage.setItem("themeMode", themeMode);
      const currentUser = localStorage.getItem("currentUser") || "";
      if (currentUser) {
        const userData = JSON.parse(currentUser) as Client;
        userData.themeId = theme !== null ? theme.id : null;
        localStorage.setItem("currentUser", JSON.stringify(userData));
      }
    } catch (error) {
      console.warn("Failed to save theme preferences:", error);
    }
  }
};

export const loadThemePreferences = (): {
  theme: ThemeStore;
  themeMode: ThemeMode;
} => {
  if (typeof window !== "undefined") {
    try {
      const storedTheme = localStorage.getItem("activeTheme") || "null";
      const theme = JSON.parse(storedTheme);
      const savedThemeMode = localStorage.getItem("themeMode") as ThemeMode;

      // Default to 'system' if no saved preference or invalid value
      const themeMode: ThemeMode = savedThemeMode && ["system", "light", "dark"].includes(savedThemeMode) ? savedThemeMode : "system";

      return { theme, themeMode };
    } catch (error) {
      console.warn("Failed to load theme preferences:", error);
      return { theme: null, themeMode: "system" };
    }
  }
  return { theme: null, themeMode: "system" };
};

// Utility function to get current system theme
export const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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

export const SYSTEM_THEMES: Theme[] = [
  {
    id: "theme-system-01",
    cssClassName: "theme-solar-drift",
    label: "Solar Drift",
    colors: ["rgb(249 115 22)", "rgb(14 165 233)"],
    description: "A vibrant sunset blend of orange and sky blue for energetic moods.",
    isUserCreated: false,
  },
  {
    id: "theme-system-02",
    cssClassName: "theme-neon-orchard",
    label: "Neon Orchard",
    colors: ["rgb(147 51 234)", "rgb(132 204 22)"],
    description: "Bold and playful with a rich purple contrast against bright lime.",
    isUserCreated: false,
  },
  {
    id: "theme-system-03",
    cssClassName: "theme-verdant-bloom",
    label: "Verdant Bloom",
    colors: ["rgb(16 185 129)", "rgb(244 63 94)"],
    description: "Elegant and expressive with deep emerald and soft rose tones.",
    isUserCreated: false,
  },
  {
    id: "theme-system-04",
    cssClassName: "theme-royal-dawn",
    label: "Royal Dawn",
    colors: ["rgb(79 70 229)", "rgb(251 191 36)"],
    description: "A royal contrast of cool indigo and warm amber highlights.",
    isUserCreated: false,
  },
  {
    id: "theme-system-05",
    cssClassName: "theme-twilight-oasis",
    label: "Twilight Oasis",
    colors: ["rgb(20 184 166)", "rgb(168 85 247)"],
    description: "Modern and chill with a calm teal base and violet edge.",
    isUserCreated: false,
  },
  {
    id: "theme-system-06",
    cssClassName: "theme-bubblewave",
    label: "Bubblewave",
    colors: ["rgb(34 211 238)", "rgb(236 72 153)"],
    description: "A fresh and lively duo of bright cyan and vivid pink.",
    isUserCreated: false,
  },
  {
    id: "theme-system-07",
    cssClassName: "theme-crimson-tide",
    label: "Crimson Tide",
    colors: ["rgb(239 68 68)", "rgb(59 130 246)"],
    description: "Classic contrast with energetic red and dependable blue.",
    isUserCreated: false,
  },
  {
    id: "theme-system-08",
    cssClassName: "theme-caribbean-beach",
    label: "Caribbean Beach",
    colors: ["rgb(210 180 140)", "rgb(0 178 202)"],
    description: "A refreshing blend of soft sand tones and sunlit shores of a tropical paradise.",
    isUserCreated: false,
  },
];
