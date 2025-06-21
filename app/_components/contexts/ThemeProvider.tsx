"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { SYSTEM_THEMES, applyTheme, loadThemePreferences, saveThemePreferences } from "@/lib/theme";
import { Button } from "@/components/ui/Button";
import { Monitor, Moon, Sun } from "lucide-react";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import { ThemeStore, ThemeMode, ThemeStoreOrNull, ThemeModeOption } from "@/types/theme";
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

const THEME_OPTIONS: ThemeModeOption[] = [
  { value: "system", icon: Monitor, text: "System", subText: "Use system setting" },
  { value: "light", icon: Sun, text: "Light", subText: "Light mode" },
  { value: "dark", icon: Moon, text: "Dark", subText: "Dark mode" },
];

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
    return THEME_OPTIONS.find((option) => option.value === themeMode)?.icon || Monitor;
  };
  const ActiveThemeIcon = getThemeIcon();

  const getThemeLabel = () => {
    return THEME_OPTIONS.find((option) => option.value === themeMode)?.text || "Unknown";
  };
  const activeThemeLabel = getThemeLabel();

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
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 p-2"
              startIcon={<ActiveThemeIcon />}
              title={activeThemeLabel}
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

          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <DropdownItem
                key={option.value}
                onClick={() => setThemeMode(option.value)}
                isSelected={themeMode === option.value}
              >
                <div className="flex min-h-[2lh] items-center gap-3 text-sm leading-tight">
                  <Icon className="size-[1em] shrink-0" />
                  <div>
                    <div>{option.text}</div>
                    {option.subText && (
                      <div className="opacity-60">
                        <small>{option.subText}</small>
                      </div>
                    )}
                  </div>
                </div>
              </DropdownItem>
            );
          })}
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
