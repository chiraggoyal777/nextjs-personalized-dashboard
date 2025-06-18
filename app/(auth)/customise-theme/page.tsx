"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Palette, Save, Eye, Trash2, Download, Code, Loader as LoaderIcon, Copy } from "lucide-react";
import Toggle from "@/components/ui/Toggle";
import Checkbox from "@/components/ui/Checkbox";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeStore, ThemePalette, ShadesPalette } from "@/types/theme";
import { useTheme } from "@/components/contexts/ThemeProvider";
import { useClient } from "@/components/contexts/ClientProvider";
import toast from "react-hot-toast";
import { generatePalette, generateThemeCSS, getContrastRatio, normalizeHex, rgbToHex } from "@/lib/helpers";
import Loader from "@/components/ui/Loader";
import ButtonTabs from "@/components/ui/ButtonTabs";
import ThemePreview from "@/components/ui/ThemePreview";
import CSSPreview from "@/components/ui/CSSPreview";
import RadioGroup from "@/components/ui/RadioGroup";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const INITIAL_PRIMARY_COLOR = "#d946ef";
const INITIAL_PRIMARY_INTERACTION_COLOR = "#d946ef";
const INITIAL_PRIMARY_CONTRAST_COLOR = "white";
const INITIAL_ACCENT_COLOR = "#06b6d4";
const INITIAL_ACCENT_INTERACTION_COLOR = "#06b6d4";
const INITIAL_ACCENT_CONTRAST_COLOR = "white";

// Debounce hook for performance optimization
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const CustomiseThemePage = () => {
  const router = useRouter();
  const { client } = useClient();
  const [primaryColor, setPrimaryColor] = useState<ThemePalette>({
    light: {
      DEFAULT: INITIAL_PRIMARY_COLOR,
      interaction: INITIAL_PRIMARY_INTERACTION_COLOR,
      contrast: INITIAL_PRIMARY_CONTRAST_COLOR,
    },
    dark: {
      DEFAULT: INITIAL_PRIMARY_COLOR,
      interaction: INITIAL_PRIMARY_INTERACTION_COLOR,
      contrast: INITIAL_PRIMARY_CONTRAST_COLOR,
    },
  });
  const [useSeparateDarkMode, setUseSeparateDarkMode] = useState(false);
  const [useSeparateAccent, setUseSeparateAccent] = useState(false);
  const [accentColor, setAccentColor] = useState<ThemePalette>({
    light: {
      DEFAULT: INITIAL_PRIMARY_COLOR,
      interaction: INITIAL_PRIMARY_INTERACTION_COLOR,
      contrast: INITIAL_PRIMARY_CONTRAST_COLOR,
    },
    dark: {
      DEFAULT: INITIAL_PRIMARY_COLOR,
      interaction: INITIAL_PRIMARY_INTERACTION_COLOR,
      contrast: INITIAL_PRIMARY_CONTRAST_COLOR,
    },
  });

  // Debounce color values for expensive operations
  const debouncedPrimaryColor = useDebounce(primaryColor, 500);
  const debouncedAccentColor = useDebounce(accentColor, 500);

  // Memoized palette cache with improved caching strategy
  const getShades = useMemo(() => {
    const cache = new Map<string, ShadesPalette>();
    return (color: string): ShadesPalette => {
      const normalizedColor = normalizeHex(color);
      if (cache.has(normalizedColor)) return cache.get(normalizedColor)!;

      const entries = Object.entries(generatePalette(normalizedColor));
      const palette: ShadesPalette = entries.reduce((acc, [shade, value]) => {
        acc[shade] = value;
        return acc;
      }, {} as ShadesPalette);

      cache.set(normalizedColor, palette);
      return palette;
    };
  }, []);

  // Memoized interaction color calculation
  const getInteractionColor = useCallback(
    (defaultColor: string): string => {
      try {
        const shades = getShades(defaultColor);
        const normalizedDefault = normalizeHex(defaultColor);
        const shadeEntries = Object.entries(shades).map(([shade, value]) => [shade, rgbToHex(value.toLowerCase())]);
        const defaultIndex = shadeEntries.findIndex(([, value]) => value === normalizedDefault);
        return defaultIndex !== -1 && defaultIndex < shadeEntries.length - 1 ? shadeEntries[defaultIndex + 1][1] : defaultColor;
      } catch (error) {
        console.warn("Error calculating interaction color:", error);
        return defaultColor;
      }
    },
    [getShades]
  );

  // Update interaction colors only when debounced colors change
  useEffect(() => {
    const updateInteractionColors = () => {
      const primaryLightInteraction = getInteractionColor(debouncedPrimaryColor.light.DEFAULT);
      const primaryDarkInteraction = getInteractionColor(debouncedPrimaryColor.dark.DEFAULT);
      const accentLightInteraction = getInteractionColor(debouncedAccentColor.light.DEFAULT);
      const accentDarkInteraction = getInteractionColor(debouncedAccentColor.dark.DEFAULT);

      setPrimaryColor((prev) => {
        if (prev.light.interaction === primaryLightInteraction && prev.dark.interaction === primaryDarkInteraction) {
          return prev;
        }
        return {
          light: { ...prev.light, interaction: primaryLightInteraction },
          dark: { ...prev.dark, interaction: primaryDarkInteraction },
        };
      });

      setAccentColor((prev) => {
        if (prev.light.interaction === accentLightInteraction && prev.dark.interaction === accentDarkInteraction) {
          return prev;
        }
        return {
          light: { ...prev.light, interaction: accentLightInteraction },
          dark: { ...prev.dark, interaction: accentDarkInteraction },
        };
      });
    };

    updateInteractionColors();
  }, [debouncedPrimaryColor.light.DEFAULT, debouncedPrimaryColor.dark.DEFAULT, debouncedAccentColor.light.DEFAULT, debouncedAccentColor.dark.DEFAULT, getInteractionColor]);

  const { savedThemes, setSavedThemes, theme: activeTheme, setTheme } = useTheme();
  const [previewThemeMode, setPreviewThemeMode] = useState<keyof ThemePalette>("light");
  const searchParams = useSearchParams();
  const isSilentUpdate = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function fetchCurrentThemeToEdit() {
    setIsLoading(true);
    const id = searchParams.get("id");
    if (id) {
      const foundTheme = savedThemes.find((theme) => theme.id === id);
      if (foundTheme) {
        await loadTheme(foundTheme);
        setEditingThemeId(id);
        setIsLoading(false);
      } else {
        resetForm();
        setIsLoading(false);
        router.push("/customise-theme");
      }
    } else {
      setEditingThemeId(null);
      resetForm();
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentThemeToEdit();
  }, [searchParams]);

  const [editingThemeId, setEditingThemeId] = useState<ThemeStore["id"] | null>(null);
  const isEditingCurrentTheme = Boolean(activeTheme && activeTheme.id === editingThemeId);

  useEffect(() => {
    setWillApplySameTheme(isEditingCurrentTheme);
  }, [editingThemeId, activeTheme]);

  const [themeName, setThemeName] = useState("");
  const createThemeId = () => `theme-${client.id}-${Date.now()}`;

  // Memoize CSS class name
  const cssClassName = useMemo(() => (themeName.trim() === "" ? "[your-theme-name]" : "theme-" + themeName.toLowerCase().replace(/\s+/g, "-") + "_" + Date.now()), [themeName]);

  const currentThemeId = editingThemeId ?? createThemeId();

  // Memoize expensive CSS generation with debounced values
  const generatedCSS = useMemo(
    () =>
      generateThemeCSS({
        cssClassName,
        accentColor: debouncedAccentColor,
        primaryColor: debouncedPrimaryColor,
        useSeparateAccent,
        useSeparateDarkMode,
      }),
    [cssClassName, debouncedAccentColor, debouncedPrimaryColor, useSeparateAccent, useSeparateDarkMode]
  );

  const saveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeName.trim()) {
      toast.dismiss();
      toast.error("Please enter a theme name");
      return;
    }
    setIsSaving(true);

    const themeData: ThemeStore = {
      id: currentThemeId,
      label: themeName,
      description: "",
      primaryColor: debouncedPrimaryColor,
      accentColor: debouncedAccentColor,
      useSeparateAccent,
      useSeparateDarkMode,
      cssClassName,
      css: generatedCSS,
      createdAt: new Date().toISOString(),
      isUserCreated: true,
    };

    let updatedThemes: ThemeStore[];

    if (editingThemeId) {
      updatedThemes = savedThemes.map((theme) => (theme.id === editingThemeId ? themeData : theme));
    } else {
      updatedThemes = [...savedThemes, themeData];
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSavedThemes(updatedThemes);
    toast.success(themeData.label + (editingThemeId ? " theme updated!" : " theme saved!"));

    if (willApplySameTheme) {
      setTheme(themeData, true, 1000);
    }
    router.push("/dashboard");
  };

  const deleteTheme = (themeId: ThemeStore["id"]) => {
    const updatedThemes = savedThemes.filter((theme) => theme.id !== themeId);
    toast.success("Theme deleted!");
    setSavedThemes(updatedThemes);
    if (activeTheme && activeTheme.id === themeId) {
      setTheme(null);
    }
  };

  const resetForm = useCallback(() => {
    setThemeName("");
    setPrimaryColor({
      light: {
        DEFAULT: INITIAL_PRIMARY_COLOR,
        interaction: INITIAL_PRIMARY_INTERACTION_COLOR,
        contrast: INITIAL_PRIMARY_CONTRAST_COLOR,
      },
      dark: {
        DEFAULT: INITIAL_PRIMARY_COLOR,
        interaction: INITIAL_PRIMARY_INTERACTION_COLOR,
        contrast: INITIAL_PRIMARY_CONTRAST_COLOR,
      },
    });

    setAccentColor({
      light: {
        DEFAULT: INITIAL_PRIMARY_COLOR,
        interaction: INITIAL_PRIMARY_INTERACTION_COLOR,
        contrast: INITIAL_PRIMARY_CONTRAST_COLOR,
      },
      dark: {
        DEFAULT: INITIAL_PRIMARY_COLOR,
        interaction: INITIAL_PRIMARY_INTERACTION_COLOR,
        contrast: INITIAL_PRIMARY_CONTRAST_COLOR,
      },
    });
    setUseSeparateDarkMode(false);
    setUseSeparateAccent(false);
  }, []);

  const exportThemes = () => {
    const dataStr = JSON.stringify(savedThemes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "custom-themes.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Theme data exported!");
  };

  // Memoize contrast calculations with debounced values
  const contrastRatios = useMemo(
    () => ({
      primaryWhite: {
        light: getContrastRatio(debouncedPrimaryColor.light.DEFAULT, "#ffffff"),
        dark: getContrastRatio(debouncedPrimaryColor.dark.DEFAULT, "#ffffff"),
      },
      primaryBlack: {
        light: getContrastRatio(debouncedPrimaryColor.light.DEFAULT, "#000000"),
        dark: getContrastRatio(debouncedPrimaryColor.dark.DEFAULT, "#000000"),
      },
      accentWhite: {
        light: getContrastRatio(debouncedAccentColor.light.DEFAULT, "#ffffff"),
        dark: getContrastRatio(debouncedAccentColor.dark.DEFAULT, "#ffffff"),
      },
      accentBlack: {
        light: getContrastRatio(debouncedAccentColor.light.DEFAULT, "#000000"),
        dark: getContrastRatio(debouncedAccentColor.dark.DEFAULT, "#000000"),
      },
    }),
    [debouncedPrimaryColor, debouncedAccentColor]
  );

  // Optimized accent color sync
  useEffect(() => {
    if (isSilentUpdate.current || useSeparateAccent) return;

    setAccentColor({
      light: {
        DEFAULT: primaryColor.light.DEFAULT,
        interaction: primaryColor.light.interaction,
        contrast: primaryColor.light.contrast,
      },
      dark: {
        DEFAULT: primaryColor.dark.DEFAULT,
        interaction: primaryColor.dark.interaction,
        contrast: primaryColor.dark.contrast,
      },
    });
  }, [primaryColor, useSeparateAccent]);

  // Handle separate accent toggle
  useEffect(() => {
    if (isSilentUpdate.current) return;

    if (!useSeparateAccent) {
      setAccentColor({
        light: {
          DEFAULT: primaryColor.light.DEFAULT,
          interaction: primaryColor.light.interaction,
          contrast: primaryColor.light.contrast,
        },
        dark: {
          DEFAULT: primaryColor.dark.DEFAULT,
          interaction: primaryColor.dark.interaction,
          contrast: primaryColor.dark.contrast,
        },
      });
    } else {
      setAccentColor({
        light: {
          DEFAULT: INITIAL_ACCENT_COLOR,
          interaction: INITIAL_ACCENT_INTERACTION_COLOR,
          contrast: INITIAL_ACCENT_CONTRAST_COLOR,
        },
        dark: {
          DEFAULT: INITIAL_ACCENT_COLOR,
          interaction: INITIAL_ACCENT_INTERACTION_COLOR,
          contrast: INITIAL_ACCENT_CONTRAST_COLOR,
        },
      });
    }
  }, [useSeparateAccent]);

  // Handle separate dark mode toggle
  useEffect(() => {
    if (isSilentUpdate.current) return;

    if (!useSeparateDarkMode) {
      setPreviewThemeMode("light");

      setPrimaryColor((prev) => ({
        ...prev,
        dark: {
          DEFAULT: prev.light.DEFAULT,
          interaction: prev.light.interaction,
          contrast: prev.light.contrast,
        },
      }));

      setAccentColor((prev) => ({
        ...prev,
        dark: {
          DEFAULT: prev.light.DEFAULT,
          interaction: prev.light.interaction,
          contrast: prev.light.contrast,
        },
      }));
    }
  }, [useSeparateDarkMode]);

  const [previewType, setPreviewType] = useState<"code" | "visual">("visual");
  const [willApplySameTheme, setWillApplySameTheme] = useState(false);

  async function loadTheme(theme: ThemeStore, autoScroll: boolean = true, wait = 500) {
    isSilentUpdate.current = true;

    if (autoScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setThemeName(theme.label);
    setUseSeparateDarkMode(theme.useSeparateDarkMode);
    setUseSeparateAccent(theme.useSeparateAccent);
    setPrimaryColor(theme.primaryColor);
    setAccentColor(theme.accentColor);

    await new Promise((resolve) =>
      setTimeout(() => {
        isSilentUpdate.current = false;
        resolve(true);
      }, wait)
    );

    // Delay to let state updates settle before side-effects re-engage
    /* requestAnimationFrame(() => {
      isSilentUpdate.current = false;
    }); */
  }

  // Optimized color change handlers
  const handlePrimaryColorChange = useCallback(
    (value: string, mode?: keyof ThemePalette) => {
      setPrimaryColor((prev) =>
        useSeparateDarkMode && mode
          ? {
              ...prev,
              [mode]: {
                ...prev[mode],
                DEFAULT: value,
              },
            }
          : {
              light: {
                ...prev.light,
                DEFAULT: value,
              },
              dark: {
                ...prev.dark,
                DEFAULT: value,
              },
            }
      );
    },
    [useSeparateDarkMode]
  );

  const handleAccentColorChange = useCallback(
    (value: string, mode?: keyof ThemePalette) => {
      setAccentColor((prev) =>
        useSeparateDarkMode && mode
          ? {
              ...prev,
              [mode]: {
                ...prev[mode],
                DEFAULT: value,
              },
            }
          : {
              light: {
                ...prev.light,
                DEFAULT: value,
              },
              dark: {
                ...prev.dark,
                DEFAULT: value,
              },
            }
      );
    },
    [useSeparateDarkMode]
  );

  const Breadcrumb = ({ editingThemeId }: { editingThemeId: string | null }) => {
    return (
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-700">
        <Link
          href="/dashboard"
          className="text-gray-700 hover:underline"
        >
          Dashboard
        </Link>
        {editingThemeId ? (
          <>
            <span className="px-1">/</span>
            <Link
              href="/customise-theme"
              className="text-gray-700 hover:underline"
            >
              Create new theme
            </Link>
            <span className="px-1">/</span>
            <span className="text-gray-500">Update Theme</span>
          </>
        ) : (
          <>
            <span className="px-1">/</span>
            <span className="text-gray-500">Create new theme</span>
          </>
        )}
      </nav>
    );
  };

  if (isLoading) return <Loader contained />;

  return (
    <div className="space-y-6">
      <Breadcrumb editingThemeId={editingThemeId} />
      <div className="bg-gray-0 space-y-4 rounded-lg p-6 shadow-lg max-sm:-mx-4 max-sm:rounded-none max-sm:shadow-none dark:bg-gray-50">
        <div className="flex items-center gap-3">
          <Palette className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{editingThemeId ? "Update your theme" : "Create new theme"}</h1>
            {activeTheme && (
              <button
                className="text-theme-primary hover:underline"
                onClick={() => loadTheme(activeTheme, false, 0)}
                type="button"
              >
                or load from active theme config
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Theme Creation Form */}
          <form
            className="space-y-6"
            onSubmit={saveTheme}
          >
            <div>
              <Input
                label="Theme Name"
                id="themeName"
                type="text"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="Enter theme name"
              />
            </div>

            {/* Add dark mode switch */}
            <div className="flex justify-between gap-2">
              <ButtonTabs
                tabs={
                  useSeparateDarkMode
                    ? [
                        { value: "light", elm: "Light " },
                        { value: "dark", elm: "Dark" },
                      ]
                    : previewThemeMode === "dark"
                      ? [{ value: "light", elm: "Dark" }]
                      : [{ value: "dark", elm: "Light" }]
                }
                activeTab={previewThemeMode}
                onChange={(value) => setPreviewThemeMode(value)}
                markAllActive={!useSeparateDarkMode}
              />

              <Toggle
                label="Use separate dark mode"
                name="darkModeToggle"
                checked={useSeparateDarkMode}
                onChange={(checked) => setUseSeparateDarkMode(checked)}
              />
            </div>

            {/* Primary Color Section */}
            <div className="rounded-lg border p-4">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Primary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3">
                    <Input
                      label="Primary Color"
                      id="primaryColorPicker"
                      type="color"
                      value={primaryColor[previewThemeMode].DEFAULT}
                      onChange={(e) => handlePrimaryColorChange(e.target.value, previewThemeMode)}
                      className="h-10 w-10 grow-0 border-none !p-0"
                      endAdornment={
                        <div className="grow">
                          <Input
                            id="primaryColor"
                            type="text"
                            value={primaryColor[previewThemeMode].DEFAULT}
                            onChange={(e) => handlePrimaryColorChange(e.target.value, previewThemeMode)}
                          />
                        </div>
                      }
                    />
                  </div>
                </div>

                <div>
                  <RadioGroup
                    name="primaryContrast"
                    title="Text Color on Primary"
                    value={primaryColor[previewThemeMode].contrast}
                    onChange={(value) =>
                      setPrimaryColor((prev) =>
                        useSeparateDarkMode
                          ? {
                              ...prev,
                              [previewThemeMode]: {
                                ...prev[previewThemeMode],
                                contrast: value,
                              },
                            }
                          : {
                              light: {
                                ...prev.light,
                                contrast: value,
                              },
                              dark: {
                                ...prev.dark,
                                contrast: value,
                              },
                            }
                      )
                    }
                    options={[
                      {
                        value: "white",
                        label: `White text (Contrast:${contrastRatios.primaryWhite[previewThemeMode].toFixed(1)}:1)`,
                      },
                      {
                        value: "black",
                        label: `Black text (Contrast:${contrastRatios.primaryBlack[previewThemeMode].toFixed(1)}:1)`,
                      },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Accent Control switch */}
            <div className="flex justify-between gap-2">
              <span></span>
              <Toggle
                label="Use separate accent color"
                name="accentToggle"
                checked={useSeparateAccent}
                onChange={(checked) => setUseSeparateAccent(checked)}
              />
            </div>

            {/* Accent Color Section */}
            {useSeparateAccent && (
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Accent</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <Input
                        label="Accent Color"
                        id="accentColorPicker"
                        type="color"
                        value={accentColor[previewThemeMode].DEFAULT}
                        onChange={(e) => handleAccentColorChange(e.target.value, previewThemeMode)}
                        className="h-10 w-10 grow-0 border-none !p-0"
                        endAdornment={
                          <div className="grow">
                            <Input
                              id="accentColor"
                              type="text"
                              value={accentColor[previewThemeMode].DEFAULT}
                              onChange={(e) => handleAccentColorChange(e.target.value, previewThemeMode)}
                            />
                          </div>
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <RadioGroup
                      name="accentContrast"
                      title="Text Color on Accent"
                      value={accentColor[previewThemeMode].contrast}
                      onChange={(value) =>
                        setAccentColor((prev) =>
                          useSeparateDarkMode
                            ? {
                                ...prev,
                                [previewThemeMode]: {
                                  ...prev[previewThemeMode],
                                  contrast: value,
                                },
                              }
                            : {
                                light: {
                                  ...prev.light,
                                  contrast: value,
                                },
                                dark: {
                                  ...prev.dark,
                                  contrast: value,
                                },
                              }
                        )
                      }
                      options={[
                        {
                          value: "white",
                          label: `White text (Contrast: ${contrastRatios.accentWhite[previewThemeMode].toFixed(1)}:1)`,
                        },
                        {
                          value: "black",
                          label: `Black text (Contrast: ${contrastRatios.accentBlack[previewThemeMode].toFixed(1)}:1)`,
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <Checkbox
                label="Apply after save"
                name="applyNowCheckbox"
                checked={willApplySameTheme}
                onChange={(value) => setWillApplySameTheme(value)}
                readonly={isEditingCurrentTheme}
                helpText={isEditingCurrentTheme ? "This will be auto applied because you're editing the current theme." : ""}
              />
            </div>

            {/* Form controls */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSaving}
                startIcon={isSaving ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              >
                {editingThemeId ? "Update" : "Save"} Theme
              </Button>
              <Button
                type="button"
                variant="gray"
                size="lg"
                onClick={resetForm}
                disabled={isSaving}
              >
                Reset
              </Button>
            </div>
          </form>

          {/* Preview & Generated CSS */}
          <div className="sticky top-20 min-w-0 space-y-6 self-start">
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{previewType === "visual" ? "Preview" : "Generated CSS"}</h3>

                <ButtonTabs
                  tabs={[
                    { value: "visual", elm: <Eye className="size-4" /> },
                    { value: "code", elm: <Code className="size-4" /> },
                  ]}
                  activeTab={previewType}
                  onChange={(value) => setPreviewType(value)}
                />
              </div>

              {/* Visual */}
              {previewType === "visual" && (
                <ThemePreview
                  primaryColor={primaryColor}
                  primaryShades={{ light: getShades(primaryColor.light.DEFAULT), dark: getShades(primaryColor.light.DEFAULT) }}
                  accentColor={accentColor}
                  accentShades={{ light: getShades(accentColor.light.DEFAULT), dark: getShades(accentColor.light.DEFAULT) }}
                  previewThemeMode={previewThemeMode}
                />
              )}

              {/* Code */}
              {previewType === "code" && <CSSPreview css={generatedCSS} />}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Themes */}
      {!editingThemeId && (
        <div
          className="bg-gray-0 rounded-lg p-6 shadow-lg max-sm:-mx-4 max-sm:rounded-none max-sm:shadow-none dark:bg-gray-50"
          id="themes"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Saved Themes ({savedThemes.length})</h2>
            {savedThemes.length > 0 && (
              <button
                onClick={exportThemes}
                className="text-theme-primary hover:text-theme-primary-interaction flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export All
              </button>
            )}
          </div>

          {savedThemes.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Palette className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p>No themes saved yet. Create your first custom theme above!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedThemes.map((theme) => (
                <div
                  key={theme.id}
                  className="rounded-lg border bg-gray-50 p-4 transition-shadow hover:shadow-md dark:bg-gray-100"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">{theme.label}</h3>
                    <button
                      onClick={() => deleteTheme(theme.id)}
                      className="text-danger hover:bg-danger/10 rounded-full p-1"
                      title="Delete theme"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="mb-3 space-y-2 text-center text-xs">
                      <div>Light Mode</div>
                      <div className="flex justify-center gap-2">
                        <div>
                          <div
                            className="mx-auto grid h-8 w-8 place-items-center rounded border-2 border-gray-200"
                            style={{
                              backgroundColor: theme.primaryColor.light.DEFAULT,
                            }}
                            title={`Primary: ${theme.primaryColor.light.DEFAULT}`}
                          >
                            <span style={{ color: theme.primaryColor.light.contrast }}>1</span>
                          </div>
                          <div>Primary</div>
                        </div>
                        <div>
                          <div
                            className="mx-auto grid h-8 w-8 place-items-center rounded border-2 border-gray-200"
                            style={{
                              backgroundColor: theme.accentColor.light.DEFAULT,
                            }}
                            title={`Accent: ${theme.accentColor.light.DEFAULT}`}
                          >
                            <span style={{ color: theme.accentColor.light.contrast }}>1</span>
                          </div>
                          <div>Accent</div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 space-y-2 text-center text-xs">
                      <div>Dark Mode</div>
                      <div className="flex justify-center gap-2">
                        <div>
                          <div
                            className="mx-auto grid h-8 w-8 place-items-center rounded border-2 border-gray-200"
                            style={{
                              backgroundColor: theme.primaryColor.dark.DEFAULT,
                            }}
                            title={`Primary: ${theme.primaryColor.dark.DEFAULT}`}
                          >
                            <span style={{ color: theme.primaryColor.dark.contrast }}>2</span>
                          </div>
                          <div>Primary</div>
                        </div>
                        <div>
                          <div
                            className="mx-auto grid h-8 w-8 place-items-center rounded border-2 border-gray-200"
                            style={{
                              backgroundColor: theme.accentColor.dark.DEFAULT,
                            }}
                            title={`Accent: ${theme.accentColor.dark.DEFAULT}`}
                          >
                            <span style={{ color: theme.accentColor.dark.contrast }}>2</span>
                          </div>
                          <div>Accent</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`?id=${theme.id}`}
                      className="flex-1 rounded bg-gray-200 px-2 py-2 text-center text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-300"
                    >
                      Edit
                    </Link>
                    <button
                      className="text-theme-primary hover:bg-theme-primary/10 rounded px-2 py-1 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(theme.css);
                        toast.success("CSS copied to clipboard!");
                      }}
                      title="Copy CSS"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-gray-400">Created: {new Date(theme.createdAt).toDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomiseThemePage;
