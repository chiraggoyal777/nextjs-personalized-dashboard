import { Client } from "@/types/client";
import { ThemeStore, ThemeMode, ThemeStoreOrNull } from "@/types/theme";

export const applyTheme = (theme: ThemeStoreOrNull, isDark: boolean = false) => {
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
  } else {
    root.classList.remove("dark");
  }
};

export const saveThemePreferences = (theme: ThemeStoreOrNull, themeMode: ThemeMode) => {
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
  theme: ThemeStoreOrNull;
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

export const SYSTEM_THEMES: ThemeStore[] = [
  {
    id: "theme-system-01",
    cssClassName: "theme-solar-drift",
    label: "Solar Drift",
    description: "A vibrant sunset blend of orange and sky blue for energetic moods.",
    primaryColor: {
      light: {
        DEFAULT: "#f97316",
        interaction: "#f97316",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#f97316",
        interaction: "#f97316",
        contrast: "black",
      },
    },
    accentColor: {
      light: {
        DEFAULT: "#0ea5e9",
        interaction: "#0ea5e9",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#0ea5e9",
        interaction: "#0ea5e9",
        contrast: "black",
      },
    },
    useSeparateDarkMode: true,
    useSeparateAccent: true,
    isUserCreated: false,
    createdAt: "2025-06-01T00:00:00Z",
    modifiedAt: "2025-06-01T00:00:00Z",
    css: "",
  },
  {
    id: "theme-system-02",
    cssClassName: "theme-neon-orchard",
    label: "Neon Orchard",
    description: "Bold and playful with a rich purple contrast against bright lime.",
    primaryColor: {
      light: {
        DEFAULT: "#8b5cf6",
        interaction: "#8b5cf6",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#8b5cf6",
        interaction: "#8b5cf6",
        contrast: "white",
      },
    },
    accentColor: {
      light: {
        DEFAULT: "#84cc16",
        interaction: "#84cc16",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#84cc16",
        interaction: "#84cc16",
        contrast: "white",
      },
    },
    useSeparateDarkMode: false,
    useSeparateAccent: true,
    isUserCreated: false,
    createdAt: "2025-06-01T10:00:00.000Z",
    modifiedAt: "2025-06-01T10:00:00.000Z",
    css: "",
  },
  {
    id: "theme-system-03",
    cssClassName: "theme-verdant-bloom",
    label: "Verdant Bloom",
    description: "Elegant and expressive with deep emerald and soft rose tones.",
    primaryColor: {
      light: {
        DEFAULT: "#10b981",
        interaction: "#10b981",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#10b981",
        interaction: "#10b981",
        contrast: "black",
      },
    },
    accentColor: {
      light: {
        DEFAULT: "#f43f5e",
        interaction: "#f43f5e",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#f43f5e",
        interaction: "#f43f5e",
        contrast: "black",
      },
    },
    useSeparateDarkMode: true,
    useSeparateAccent: true,
    isUserCreated: false,
    createdAt: "2025-06-02T10:05:00.000Z",
    modifiedAt: "2025-06-02T10:05:00.000Z",
    css: "",
  },
  {
    id: "theme-system-04",
    cssClassName: "theme-royal-dawn",
    label: "Royal Dawn",
    description: "A royal contrast of cool indigo and warm amber highlights.",
    primaryColor: {
      light: {
        DEFAULT: "#6366f1",
        interaction: "#6366f1",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#6366f1",
        interaction: "#6366f1",
        contrast: "white",
      },
    },
    accentColor: {
      light: {
        DEFAULT: "#f59e0b",
        interaction: "#f59e0b",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#f59e0b",
        interaction: "#f59e0b",
        contrast: "white",
      },
    },
    useSeparateDarkMode: false,
    useSeparateAccent: true,
    isUserCreated: false,
    createdAt: "2025-06-02T10:10:00.000Z",
    modifiedAt: "2025-06-02T10:10:00.000Z",
    css: "",
  },
  {
    id: "theme-system-05",
    cssClassName: "theme-twilight-oasis",
    label: "Twilight Oasis",
    description: "Modern and chill with a calm teal base and violet edge.",
    primaryColor: {
      light: {
        DEFAULT: "#14b8a6",
        interaction: "#14b8a6",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#14b8a6",
        interaction: "#14b8a6",
        contrast: "black",
      },
    },
    accentColor: {
      light: {
        DEFAULT: "#8b5cf6",
        interaction: "#8b5cf6",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#8b5cf6",
        interaction: "#8b5cf6",
        contrast: "black",
      },
    },
    useSeparateDarkMode: true,
    useSeparateAccent: true,
    isUserCreated: false,
    createdAt: "2025-06-02T10:12:00.000Z",
    modifiedAt: "2025-06-02T10:12:00.000Z",
    css: "",
  },
  {
    id: "theme-system-06",
    cssClassName: "theme-bubblewave",
    label: "Bubblewave",
    description: "A fresh and lively duo of bright cyan and vivid pink.",
    primaryColor: {
      light: {
        DEFAULT: "#06b6d4",
        interaction: "#06b6d4",
        contrast: "black",
      },
      dark: {
        DEFAULT: "#06b6d4",
        interaction: "#06b6d4",
        contrast: "black",
      },
    },
    accentColor: {
      light: {
        DEFAULT: "#ec4899",
        interaction: "#ec4899",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#ec4899",
        interaction: "#ec4899",
        contrast: "white",
      },
    },
    useSeparateDarkMode: false,
    useSeparateAccent: true,
    isUserCreated: false,
    createdAt: "2025-06-09T10:14:00.000Z",
    modifiedAt: "2025-06-09T10:14:00.000Z",
    css: "",
  },
  {
    id: "theme-system-07",
    cssClassName: "theme-crimson-tide",
    label: "Crimson Tide",
    description: "Classic contrast with energetic red and dependable blue.",
    primaryColor: {
      light: {
        DEFAULT: "#ef4444",
        interaction: "#ef4444",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#ef4444",
        interaction: "#ef4444",
        contrast: "white",
      },
    },
    accentColor: {
      light: {
        DEFAULT: "#3b82f6",
        interaction: "#3b82f6",
        contrast: "white",
      },
      dark: {
        DEFAULT: "#3b82f6",
        interaction: "#3b82f6",
        contrast: "white",
      },
    },
    useSeparateDarkMode: false,
    useSeparateAccent: true,
    isUserCreated: false,
    createdAt: "2025-06-10T10:17:00.000Z",
    modifiedAt: "2025-06-10T10:17:00.000Z",
    css: "",
  },
  {
    id: "theme-system-08",
    cssClassName: "theme-caribbean-beach",
    label: "Caribbean Beach",
    description: "A refreshing blend of soft sand tones and sunlit shores of a tropical paradise.",
    primaryColor: {
      light: {
        DEFAULT: "#d2b48c",
        interaction: "#d2b48c",
        contrast: "black",
      },
      dark: {
        DEFAULT: "#d2b48c",
        interaction: "#d2b48c",
        contrast: "black",
      },
    },
    accentColor: {
      light: {
        DEFAULT: "#00b2ca",
        interaction: "#00b2ca",
        contrast: "black",
      },
      dark: {
        DEFAULT: "#00b2ca",
        interaction: "#00b2ca",
        contrast: "black",
      },
    },
    useSeparateDarkMode: false,
    useSeparateAccent: true,
    isUserCreated: false,
    createdAt: "2025-06-15T10:22:00.000Z",
    modifiedAt: "2025-06-15T10:22:00.000Z",
    css: "",
  },
];
