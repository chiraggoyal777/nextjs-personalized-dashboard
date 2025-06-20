"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Palette, Save, Loader as LoaderIcon } from "lucide-react";
import Toggle from "@/components/ui/Toggle";
import Checkbox from "@/components/ui/Checkbox";
import { ThemePalette, ShadesPalette, ThemeStore } from "@/types/theme";
import ButtonTabs from "@/components/ui/ButtonTabs";
import ThemePreview from "@/components/widgets/ThemePreview";
import RadioGroup from "@/components/ui/RadioGroup";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useClient } from "@/components/contexts/ClientProvider";
import { useDebounce } from "@/components/hooks/hooks";
import { useTheme } from "@/components/contexts/ThemeProvider";
import { generatePalette, generateThemeCSS, getContrastRatio, normalizeHex, rgbToHex } from "@/lib/helpers";
import Loader from "@/components/ui/Loader";
import { useSearchParams } from "next/navigation";

interface ThemeCustomiserFormProps {
  editingThemeId: string | null;
  onSaveOrUpdateSuccess: () => void;
  onFailedToLoad: () => void;
}

const INITIAL_PRIMARY_COLOR = "#d946ef";
const INITIAL_PRIMARY_INTERACTION_COLOR = "#c026d3";
const INITIAL_PRIMARY_CONTRAST_COLOR = "white";
const INITIAL_ACCENT_COLOR = "#06b6d4";
const INITIAL_ACCENT_INTERACTION_COLOR = "#0891b2";
const INITIAL_ACCENT_CONTRAST_COLOR = "white";

const ThemeCustomiserForm: React.FC<ThemeCustomiserFormProps> = ({ editingThemeId, onSaveOrUpdateSuccess, onFailedToLoad }) => {
  const { client } = useClient();

  const createThemeId = () => `theme-${client.id}-${Date.now()}`;
  const [themeName, setThemeName] = useState("");
  const [previewThemeMode, setPreviewThemeMode] = useState<keyof ThemePalette>("light");

  const currentThemeId = editingThemeId ?? createThemeId();

  const [isSaving, setIsSaving] = useState(false);
  const cssClassName = useMemo(() => (themeName.trim() === "" ? "[your-theme-name]" : "theme-" + themeName.toLowerCase().replace(/\s+/g, "-") + "_" + Date.now()), [themeName]);
  const { savedThemes, setSavedThemes, theme: activeTheme, setTheme } = useTheme();

  const isEditingCurrentTheme = Boolean(activeTheme && activeTheme.id === editingThemeId);
  const [willApplySameTheme, setWillApplySameTheme] = useState(false);
  const isSilentUpdate = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  async function fetchCurrentThemeToEdit() {
    setIsLoading(true);
    const id = searchParams.get("id");
    if (id) {
      const foundTheme = savedThemes.find((theme) => theme.id === id);
      if (foundTheme) {
        await loadTheme(foundTheme);
        setIsLoading(false);
      } else {
        resetForm();
        setIsLoading(false);
        onFailedToLoad?.();
      }
    } else {
      resetForm();
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentThemeToEdit();
  }, [searchParams]);

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
  const debouncedPrimaryColor = useDebounce(primaryColor, 200);
  const debouncedAccentColor = useDebounce(accentColor, 200);
  useEffect(() => {
    setWillApplySameTheme(isEditingCurrentTheme);
  }, [editingThemeId, activeTheme]);
  const saveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeName.trim()) {
      toast.dismiss();
      toast.error("Please enter a theme name", { style: { marginBottom: 60 } });
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
      createdAt: isEditingCurrentTheme && activeTheme ? activeTheme.createdAt : new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
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
      setTheme(themeData, true, 2000);
    }
    resetForm();
    setIsSaving(false);
    fetchCurrentThemeToEdit();
    onSaveOrUpdateSuccess?.();
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

  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  useEffect(() => {
    if (isSilentUpdate.current) return;
    setIsConfigLoaded(false);
  }, [activeTheme]);

  useEffect(() => {
    setIsConfigLoaded(false);
  }, [editingThemeId]);

  if (isLoading) return <Loader contained />;

  return (
    <div className="bg-gray-0 space-y-4 rounded-lg p-6 shadow-lg max-sm:-mx-4 max-sm:rounded-none max-sm:shadow-none dark:bg-gray-50">
      <div className="flex items-start gap-3 text-2xl leading-snug">
        <div className="flex h-[1lh] items-center justify-center">
          <Palette className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900">{editingThemeId ? "Update your theme" : "Create new theme"}</h1>
          {activeTheme && !isEditingCurrentTheme && !isConfigLoaded && (
            <button
              className="text-theme-primary block text-sm hover:underline"
              onClick={() => {
                loadTheme(activeTheme, false, 0);
                setIsConfigLoaded(true);
                toast.dismiss();
                toast.success(`Config loaded from ${activeTheme.label} theme!`);
              }}
              type="button"
            >
              or load config from active theme
            </button>
          )}
        </div>
      </div>
      {/* Form & Preview container */}
      <div className="isolate grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Preview & Generated CSS */}
        <div className="top-20 space-y-6 md:sticky md:self-start">
          <ThemePreview
            primaryColor={debouncedPrimaryColor[previewThemeMode]}
            primaryShades={getShades(debouncedPrimaryColor[previewThemeMode].DEFAULT)}
            accentColor={debouncedAccentColor[previewThemeMode]}
            accentShades={getShades(debouncedAccentColor[previewThemeMode].DEFAULT)}
            previewThemeMode={previewThemeMode}
            generatedCSS={generatedCSS}
          />
        </div>
        {/* Form */}
        <form
          className="flex flex-col gap-10"
          onSubmit={saveTheme}
        >
          <div className="w-full grow space-y-6">
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
          </div>

          {/* Form controls */}
          <div className="bg-gray-0 sticky bottom-0 z-10 flex w-full justify-end gap-3 py-4 max-md:justify-center dark:bg-gray-50">
            <Button
              type="submit"
              disabled={isSaving}
              startIcon={isSaving ? <LoaderIcon className="animate-spin" /> : <Save />}
            >
              {editingThemeId ? "Update" : "Save"} Theme
            </Button>
            <Button
              type="button"
              color="gray"
              variant="solid"
              onClick={resetForm}
              disabled={isSaving}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThemeCustomiserForm;
