"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { SYSTEM_THEMES, applyTheme, loadThemePreferences, saveThemePreferences } from "@/lib/theme";
import { Button } from "@/components/ui/Button";
import { Monitor, Moon, Sun } from "lucide-react";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import { ThemeStore, ThemeMode, ThemeStoreOrNull } from "@/types/theme";
import toast from "react-hot-toast";

interface ThemeContextType {
  allThemes: ThemeStore[];
  savedThemes: ThemeStore[];
  setSavedThemes: React.Dispatch<React.SetStateAction<ThemeStore[]>>;
  theme: ThemeStoreOrNull;
  themeMode: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeStoreOrNull, showToast?: boolean, delay?: number) => void;
  setThemeMode: (mode: ThemeMode) => void;
  isLoaded: boolean;
  applyingThemeId: ThemeStore["id"];
  applyThemeGlobal: (theme: ThemeStore) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [savedThemes, setSavedThemes] = useState<ThemeStore[]>([]);
  const [theme, setThemeState] = useState<ThemeStoreOrNull>(null);
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const allThemes: ThemeStore[] = [...SYSTEM_THEMES, ...savedThemes];
  useEffect(() => {
    reloadThemes();

    // initialise with preferences if does not exist
    if (!localStorage.getItem("themeMode")) {
      saveThemePreferences(theme, themeMode);
    }
  }, []);

  function injectSingleThemeCSS() {
    const themeId = theme?.id;
    if (themeId) {
      const styleId = `style-theme-user`;
      let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }

      styleEl.innerHTML = savedThemes.find((item) => item.id === themeId)?.css || "";
    }
  }

  const reloadThemes = () => {
    const themes = JSON.parse(localStorage.getItem("customThemes") || "[]");
    setSavedThemes(themes);
  };

  useEffect(() => {
    localStorage.setItem("customThemes", JSON.stringify(savedThemes));
    injectSingleThemeCSS();
  }, [savedThemes, theme]);

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
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [themeMode, theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { theme: savedTheme, themeMode: savedThemeMode } = loadThemePreferences();

      setThemeState(savedTheme);
      setThemeModeState(savedThemeMode);

      // Determine if dark mode should be active
      let shouldBeDark = false;
      if (savedThemeMode === "system") {
        shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      } else {
        shouldBeDark = savedThemeMode === "dark";
      }

      setIsDark(shouldBeDark);
      setIsLoaded(true);

      applyTheme(savedTheme, shouldBeDark);
    }
  }, []);

  const setTheme = async (newTheme: ThemeStoreOrNull, showToast = true, delay = 0) => {
    setThemeState(newTheme);
    applyTheme(newTheme, isDark);
    saveThemePreferences(newTheme, themeMode);
    if (showToast) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      toast(`${newTheme ? newTheme.label : "Brand"} theme applied!`);
    }
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

  const [applyingThemeId, setApplyingThemeId] = useState<string>("");

  const requestTokenRef = useRef(0);

  const applyThemeGlobal = async (nextTheme: ThemeStore) => {
    if (theme && theme.id === nextTheme.id) return;

    const requestId = ++requestTokenRef.current;
    setApplyingThemeId(nextTheme.id);

    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated async

    if (requestId !== requestTokenRef.current) return;

    toast.dismiss();
    setTheme(nextTheme);
    setApplyingThemeId("");
  };

  // Prevent flash of unstyled content
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        allThemes,
        savedThemes,
        setSavedThemes,
        theme,
        themeMode,
        isDark,
        setTheme,
        setThemeMode,
        isLoaded,
        applyingThemeId,
        applyThemeGlobal,
      }}
    >
      {children}

      <div className="fixed right-4 bottom-4 z-20">
        <Dropdown
          trigger={
            <Button
              color="accent"
              variant="fill"
              size="sm"
              className="flex items-center gap-2 p-2"
              startIcon={getThemeIcon()}
              title={getThemeLabel()}
              aria-label="Choose theme"
              roundedFull
            />
          }
          isOpen={isDropdownOpen}
          onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          onClose={() => setIsDropdownOpen(false)}
          position="top-right"
        >
          <div className="border-b border-gray-200 px-3 py-2 text-xs font-semibold">Theme Mode</div>

          <DropdownItem
            onClick={() => setThemeMode("system")}
            isSelected={themeMode === "system"}
          >
            <div className="flex items-center gap-3">
              <Monitor className="h-4 w-4" />
              <div>
                <div>System</div>
                <div className="text-xs opacity-60">Use system setting</div>
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
                <div className="text-xs opacity-60">Light mode</div>
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
                <div className="text-xs opacity-60">Dark mode</div>
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
