import { Client } from "@/types/client";
import { Theme, ThemeMode } from "@/types/theme";

export const applyTheme = (themeId: string, isDark: boolean = false) => {
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
  if (themeId && themeId.trim() !== "") {
    root.classList.add(themeId);
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

export const saveThemePreferences = (themeId: string, themeMode: ThemeMode) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("theme", themeId);
      localStorage.setItem("themeMode", themeMode);
      const currentUser = localStorage.getItem("currentUser") || "";
      if (currentUser) {
        const userData = JSON.parse(currentUser) as Client;
        userData.themeId = themeId;
        localStorage.setItem("currentUser", JSON.stringify(userData));
      }
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

export const APP_THEMES: Theme[] = [
  {
    id: "theme-orange-sky",
    label: "Solar Drift",
    colors: ["rgb(249 115 22)", "rgb(14 165 233)"],
    description: "A vibrant sunset blend of orange and sky blue for energetic moods.",
  },
  {
    id: "theme-purple-lime",
    label: "Neon Orchard",
    colors: ["rgb(147 51 234)", "rgb(132 204 22)"],
    description: "Bold and playful with a rich purple contrast against bright lime.",
  },
  {
    id: "theme-emerald-rose",
    label: "Verdant Bloom",
    colors: ["rgb(16 185 129)", "rgb(244 63 94)"],
    description: "Elegant and expressive with deep emerald and soft rose tones.",
  },
  {
    id: "theme-indigo-amber",
    label: "Royal Dawn",
    colors: ["rgb(79 70 229)", "rgb(251 191 36)"],
    description: "A royal contrast of cool indigo and warm amber highlights.",
  },
  {
    id: "theme-teal-violet",
    label: "Twilight Oasis",
    colors: ["rgb(20 184 166)", "rgb(168 85 247)"],
    description: "Modern and chill with a calm teal base and violet edge.",
  },
  {
    id: "theme-cyan-pink",
    label: "Bubblewave",
    colors: ["rgb(34 211 238)", "rgb(236 72 153)"],
    description: "A fresh and lively duo of bright cyan and vivid pink.",
  },
  {
    id: "theme-red-blue",
    label: "Crimson Tide",
    colors: ["rgb(239 68 68)", "rgb(59 130 246)"],
    description: "Classic contrast with energetic red and dependable blue.",
  },
];
