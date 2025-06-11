"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  APP_THEMES,
  applyTheme,
  loadThemePreferences,
  saveThemePreferences,
} from "@/lib/theme";
import { Button } from "@/components/ui/Button";
import { Monitor, Moon, Sun } from "lucide-react";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import { Theme, ThemeMode } from "@/types/theme";

interface ThemeContextType {
  allThemes: Theme[];
  theme: string;
  themeMode: ThemeMode;
  isDark: boolean;
  setTheme: (theme: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState("");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (themeMode === "system") {
        const systemIsDark = mediaQuery.matches;
        setIsDark(systemIsDark);
        applyTheme(theme, systemIsDark);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [themeMode, theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { theme: savedTheme, themeMode: savedThemeMode } =
        loadThemePreferences();

      setThemeState(savedTheme);
      setThemeModeState(savedThemeMode);

      // Determine if dark mode should be active
      let shouldBeDark = false;
      if (savedThemeMode === "system") {
        shouldBeDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
      } else {
        shouldBeDark = savedThemeMode === "dark";
      }

      setIsDark(shouldBeDark);
      setIsLoaded(true);

      applyTheme(savedTheme, shouldBeDark);
    }
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    applyTheme(newTheme, isDark);
    saveThemePreferences(newTheme, themeMode);
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setThemeModeState(newMode);

    let newIsDark = false;
    if (newMode === "system") {
      newIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      newIsDark = newMode === "dark";
    }

    setIsDark(newIsDark);
    applyTheme(theme, newIsDark);
    saveThemePreferences(theme, newMode);
    setIsDropdownOpen(false);
  };

  const getThemeIcon = () => {
    if (themeMode === "system") {
      return <Monitor className="h-4 w-4" />;
    }
    return isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case "system":
        return "System";
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      default:
        return "System";
    }
  };

  // Prevent flash of unstyled content
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const allThemes = [...APP_THEMES];
  return (
    <ThemeContext.Provider
      value={{ allThemes, theme, themeMode, isDark, setTheme, setThemeMode, isLoaded }}
    >
      {children}

      <div className="fixed right-4 bottom-4">
        <Dropdown
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 p-2"
              brand={theme === ""}
              // brand
            >
              {getThemeIcon()}
              <span className="hidden text-xs sm:inline">
                {getThemeLabel()}
              </span>
            </Button>
          }
          isOpen={isDropdownOpen}
          onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          onClose={() => setIsDropdownOpen(false)}
          position="top-right"
        >
          <div className="border-b border-gray-200 px-3 py-2 text-xs font-semibold">
            Theme Mode
          </div>

          <DropdownItem
            onClick={() => setThemeMode("system")}
            isSelected={themeMode === "system"}
          >
            <div className="flex items-center gap-3">
              <Monitor className="h-4 w-4" />
              <div>
                <div>System</div>
                <div className="text-xs opacity-50">Use system setting</div>
              </div>
            </div>
          </DropdownItem>

          <DropdownItem
            onClick={() => setThemeMode("light")}
            isSelected={themeMode === "light"}
          >
            <div className="flex items-center gap-3">
              <Sun className="h-4 w-4" />
              <div>
                <div>Light</div>
                <div className="text-xs opacity-50">Light mode</div>
              </div>
            </div>
          </DropdownItem>

          <DropdownItem
            onClick={() => setThemeMode("dark")}
            isSelected={themeMode === "dark"}
          >
            <div className="flex items-center gap-3">
              <Moon className="h-4 w-4" />
              <div>
                <div>Dark</div>
                <div className="text-xs opacity-50">Dark mode</div>
              </div>
            </div>
          </DropdownItem>
        </Dropdown>
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
