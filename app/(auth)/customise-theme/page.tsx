"use client";
import React, { useState, useEffect, CSSProperties, useMemo } from "react";
import { Palette, Save, Eye, Trash2, Download, TrendingUp, DollarSign, Users, Code, Edit, Loader as LoaderIcon } from "lucide-react";
import Toggle, { TogglePreview } from "@/components/ui/Toggle";
import Radio, { RadioPreview } from "@/components/ui/Radio";
import Checkbox, { CheckboxPreview } from "@/components/ui/Checkbox";
import Link from "next/link";
import CopyIconButton from "@/components/ui/CopyIconButton";
import { useRouter, useSearchParams } from "next/navigation";
import { GeneratedTheme, ThemePalette } from "@/types/theme";
import { useTheme } from "@/components/contexts/ThemeProvider";
import { useClient } from "@/components/contexts/ClientProvider";
import toast from "react-hot-toast";
import { generatePalette, generateThemeCSS, getContrastRatio } from "@/lib/helpers";
import Loader from "@/components/ui/Loader";

const INITIAL_PRIMARY_COLOR = "#d946ef";
const INITIAL_PRIMARY_CONTRAST_COLOR = "white";
const INITIAL_ACCENT_COLOR = "#06b6d4";
const INITIAL_ACCENT_CONTRAST_COLOR = "white";

const CustomiseThemePage = () => {
  const router = useRouter();
  const { client } = useClient();
  const [primaryColor, setPrimaryColor] = useState<ThemePalette>({
    light: INITIAL_PRIMARY_COLOR,
    dark: INITIAL_PRIMARY_COLOR,
  });
  const [primaryContrast, setPrimaryContrast] = useState<ThemePalette>({
    light: INITIAL_PRIMARY_CONTRAST_COLOR,
    dark: INITIAL_PRIMARY_CONTRAST_COLOR,
  });
  const [useSeparateAccent, setUseSeparateAccent] = useState(false);

  const [useSeparateDarkMode, setUseSeparateDarkMode] = useState(false);

  const [accentColor, setAccentColor] = useState<ThemePalette>({
    light: INITIAL_PRIMARY_COLOR,
    dark: INITIAL_PRIMARY_COLOR,
  });
  const [accentContrast, setAccentContrast] = useState<ThemePalette>({
    light: INITIAL_PRIMARY_CONTRAST_COLOR,
    dark: INITIAL_PRIMARY_CONTRAST_COLOR,
  });

  const { savedThemes, setSavedThemes, theme, setTheme } = useTheme();

  const [previewThemeMode, setPreviewThemeMode] = useState<keyof ThemePalette>("light");

  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const id = searchParams.get("id");
    if (id) {
      const foundTheme = savedThemes.find((theme) => theme.id === id);
      if (foundTheme) {
        loadTheme(foundTheme);
        setEditingThemeId(id);
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
  }, [searchParams]);

  const [editingThemeId, setEditingThemeId] = useState<GeneratedTheme["id"] | null>(null);

  const isEditingCurrentTheme = Boolean(theme && theme.id === editingThemeId);
  useEffect(() => {
    setWillApplySameTheme(isEditingCurrentTheme);
  }, [editingThemeId, theme]);
  const [themeName, setThemeName] = useState("");

  const createThemeId = () => `theme-${client.id}-${Date.now()}`;
  const cssClassName = useMemo(() => (themeName.trim() === "" ? "[your-theme-name]" : "theme-" + themeName.toLowerCase().replace(/\s+/g, "-") + "_" + Date.now()), [themeName]);

  const currentThemeId = editingThemeId ?? createThemeId();

  const generatedCSS = generateThemeCSS({ cssClassName, accentColor, accentContrast, primaryColor, primaryContrast, useSeparateAccent, useSeparateDarkMode });

  const saveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeName.trim()) {
      toast.dismiss();
      toast.error("Please enter a theme name");
      return;
    }
    setIsSaving(true);

    const themeData: GeneratedTheme = {
      id: currentThemeId,
      label: themeName,
      colors: [primaryColor.light, accentColor.light],
      description: "",
      primaryColor,
      primaryContrast,
      useSeparateAccent,
      accentColor,
      accentContrast,
      useSeparateDarkMode,
      cssClassName: cssClassName,
      css: generatedCSS,
      createdAt: new Date().toISOString(),
      isUserCreated: true,
    };

    let updatedThemes: GeneratedTheme[];

    if (editingThemeId) {
      // Update existing theme
      updatedThemes = savedThemes.map((theme) => (theme.id === editingThemeId ? themeData : theme));
    } else {
      // Create new theme
      updatedThemes = [...savedThemes, themeData];
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSavedThemes(updatedThemes);
    toast.success(themeData.label + (editingThemeId ? " theme updated!" : " theme saved!"));

    if (willApplySameTheme) {
      const { id, label, colors, description, isUserCreated, cssClassName } = themeData;
      setTheme({ id, label, colors, description, isUserCreated, cssClassName }, true, 1000);
    }
    /* resetForm();
    setEditingThemeId(null);
    setIsSaving(false); */
    router.push("/dashboard");
  };

  const deleteTheme = (themeId: GeneratedTheme["id"]) => {
    const updatedThemes = savedThemes.filter((theme) => theme.id !== themeId);
    toast.success("Theme deleted!");
    setSavedThemes(updatedThemes);
    if (theme && theme.id === themeId) {
      setTheme(null);
    }
  };

  const resetForm = () => {
    setThemeName("");
    setPrimaryColor({
      light: INITIAL_PRIMARY_COLOR,
      dark: INITIAL_PRIMARY_COLOR,
    });
    setPrimaryContrast({
      light: INITIAL_PRIMARY_CONTRAST_COLOR,
      dark: INITIAL_PRIMARY_CONTRAST_COLOR,
    });
    setUseSeparateAccent(false);
    setAccentColor({
      light: INITIAL_PRIMARY_COLOR,
      dark: INITIAL_PRIMARY_COLOR,
    });
    setAccentContrast({
      light: INITIAL_PRIMARY_CONTRAST_COLOR,
      dark: INITIAL_PRIMARY_CONTRAST_COLOR,
    });
    setUseSeparateDarkMode(false);
  };

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

  const whiteContrast = {
    light: getContrastRatio(primaryColor.light, "#ffffff"),
    dark: getContrastRatio(primaryColor.dark, "#ffffff"),
  };
  const blackContrast = {
    light: getContrastRatio(primaryColor.light, "#000000"),
    dark: getContrastRatio(primaryColor.dark, "#000000"),
  };
  const accentWhiteContrast = {
    light: getContrastRatio(accentColor.light, "#ffffff"),
    dark: getContrastRatio(accentColor.dark, "#ffffff"),
  };
  const accentBlackContrast = {
    light: getContrastRatio(accentColor.light, "#000000"),
    dark: getContrastRatio(accentColor.dark, "#000000"),
  };

  useEffect(() => {
    if (!isLoading) {
      if (!useSeparateAccent) {
        setAccentColor({
          light: primaryColor.light,
          dark: primaryColor.dark,
        });
        setAccentContrast({
          light: primaryContrast.light,
          dark: primaryContrast.dark,
        });
      } else {
        setAccentColor({
          light: INITIAL_ACCENT_COLOR,
          dark: INITIAL_ACCENT_COLOR,
        });
        setAccentContrast({
          light: INITIAL_ACCENT_CONTRAST_COLOR,
          dark: INITIAL_ACCENT_CONTRAST_COLOR,
        });
      }
    }
  }, [useSeparateAccent]);

  useEffect(() => {
    if (!isLoading) {
      if (!useSeparateAccent) {
        setAccentColor({
          light: primaryColor.light,
          dark: primaryColor.dark,
        });
        setAccentContrast({
          light: primaryContrast.light,
          dark: primaryContrast.dark,
        });
      }
    }
  }, [primaryColor, primaryContrast]);

  useEffect(() => {
    if (!isLoading) {
      if (!useSeparateDarkMode) {
        setPreviewThemeMode("light");
        setPrimaryColor((prev) => ({ ...prev, dark: primaryColor.light }));
        setPrimaryContrast((prev) => ({
          ...prev,
          dark: primaryContrast.light,
        }));
        setAccentColor((prev) => ({ ...prev, dark: accentColor.light }));
        setAccentContrast((prev) => ({
          ...prev,
          dark: accentContrast.light,
        }));
      }
    }
  }, [useSeparateDarkMode]);

  const [previewType, setPreviewType] = useState<"code" | "visual">("visual");
  const [willApplySameTheme, setWillApplySameTheme] = useState(false);

  async function loadTheme(theme: GeneratedTheme) {
    setThemeName(theme.label);
    setUseSeparateDarkMode(theme.useSeparateDarkMode);
    setUseSeparateAccent(theme.useSeparateAccent);
    setPrimaryColor(theme.primaryColor);
    setPrimaryContrast(theme.primaryContrast);
    setAccentColor(theme.accentColor);
    setAccentContrast(theme.accentContrast);
    window.scrollTo({ top: 0, behavior: "smooth" });
    await new Promise((resolve) => setTimeout(resolve, 1000)); // delibrate timeout to respect side effects
    setIsLoading(false);
  }

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
          <h1 className="text-2xl font-bold text-gray-900">{editingThemeId ? "Update your theme" : "Create new theme"}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Theme Creation Form */}
          <form
            className="space-y-6"
            onSubmit={saveTheme}
          >
            <div>
              <label
                htmlFor="themeName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Theme Name
              </label>
              <input
                id="themeName"
                type="text"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="Enter theme name"
                className="focus:ring-theme-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
              />
            </div>

            {/* Add dark mode switch */}
            <div className="flex justify-between gap-2">
              <div className="flex rounded bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => (useSeparateDarkMode ? setPreviewThemeMode("light") : previewThemeMode === "light" ? setPreviewThemeMode("dark") : setPreviewThemeMode("light"))}
                  className={`block rounded px-2 py-1 text-sm capitalize ${(useSeparateDarkMode && previewThemeMode === "light") || !useSeparateDarkMode ? "bg-theme-accent" : "bg-transparent text-gray-700"}`}
                >
                  {useSeparateDarkMode ? "Light" : previewThemeMode}
                </button>
                {useSeparateDarkMode && (
                  <button
                    type="button"
                    onClick={() => setPreviewThemeMode("dark")}
                    className={`block rounded px-2 py-1 text-sm capitalize ${previewThemeMode === "dark" ? "bg-theme-accent" : "bg-transparent text-gray-700"}`}
                  >
                    Dark
                  </button>
                )}
              </div>

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
                  <label
                    htmlFor="primaryColorPicker"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="primaryColorPicker"
                      type="color"
                      value={primaryColor[previewThemeMode]}
                      onChange={(e) => setPrimaryColor((prev) => (useSeparateDarkMode ? { ...prev, [previewThemeMode]: e.target.value } : { light: e.target.value, dark: e.target.value }))}
                      className="block h-10 w-10 rounded border border-transparent"
                    />
                    <input
                      id="primaryColor"
                      type="text"
                      value={primaryColor[previewThemeMode]}
                      onChange={(e) => setPrimaryColor((prev) => (useSeparateDarkMode ? { ...prev, [previewThemeMode]: e.target.value } : { light: e.target.value, dark: e.target.value }))}
                      className="focus:ring-theme-primary flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <fieldset className="mb-2 block text-sm font-medium text-gray-700">Text Color on Primary</fieldset>
                  <div className="space-y-2">
                    <Radio
                      label={`White text (Contrast:${whiteContrast[previewThemeMode].toFixed(1)}:1)`}
                      name="primaryContrast"
                      value="white"
                      checked={primaryContrast[previewThemeMode] === "white"}
                      onChange={(value) =>
                        setPrimaryContrast((prev) =>
                          useSeparateDarkMode
                            ? { ...prev, [previewThemeMode]: value }
                            : {
                                light: value,
                                dark: value,
                              }
                        )
                      }
                    />
                    <br />
                    <Radio
                      label={`Black text (Contrast:${blackContrast[previewThemeMode].toFixed(1)}:1)`}
                      name="primaryContrast"
                      value="black"
                      checked={primaryContrast[previewThemeMode] === "black"}
                      onChange={(value) =>
                        setPrimaryContrast((prev) =>
                          useSeparateDarkMode
                            ? { ...prev, [previewThemeMode]: value }
                            : {
                                light: value,
                                dark: value,
                              }
                        )
                      }
                    />
                  </div>
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
                    <label
                      htmlFor="accentColorPicker"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="accentColorPicker"
                        type="color"
                        value={accentColor[previewThemeMode]}
                        onChange={(e) =>
                          setAccentColor((prev) =>
                            useSeparateDarkMode
                              ? { ...prev, [previewThemeMode]: e.target.value }
                              : {
                                  light: e.target.value,
                                  dark: e.target.value,
                                }
                          )
                        }
                        className="block h-10 w-10 rounded border border-transparent"
                      />
                      <input
                        id="accentColor"
                        type="text"
                        value={accentColor[previewThemeMode]}
                        onChange={(e) =>
                          setAccentColor((prev) =>
                            useSeparateDarkMode
                              ? { ...prev, [previewThemeMode]: e.target.value }
                              : {
                                  light: e.target.value,
                                  dark: e.target.value,
                                }
                          )
                        }
                        className="focus:ring-theme-primary flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <fieldset className="mb-2 block text-sm font-medium text-gray-700">Text Color on Accent</fieldset>
                    <div className="space-y-2">
                      <Radio
                        label={`White text (Contrast:${accentWhiteContrast[previewThemeMode].toFixed(1)}:1)`}
                        name="accentContrast"
                        value="white"
                        checked={accentContrast[previewThemeMode] === "white"}
                        onChange={(value) =>
                          setAccentContrast((prev) =>
                            useSeparateDarkMode
                              ? {
                                  ...prev,
                                  [previewThemeMode]: value,
                                }
                              : {
                                  light: value,
                                  dark: value,
                                }
                          )
                        }
                      />
                      <br />
                      <Radio
                        label={`Black text (Contrast:${accentBlackContrast[previewThemeMode].toFixed(1)}:1)`}
                        name="accentContrast"
                        value="black"
                        checked={accentContrast[previewThemeMode] === "black"}
                        onChange={(value) =>
                          setAccentContrast((prev) =>
                            useSeparateDarkMode
                              ? {
                                  ...prev,
                                  [previewThemeMode]: value,
                                }
                              : {
                                  light: value,
                                  dark: value,
                                }
                          )
                        }
                      />
                    </div>
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
              />
              <p className="text-xs text-gray-500">{isEditingCurrentTheme ? "This will be auto applied because you're editing the current theme." : <span>&nbsp;</span>}</p>
            </div>

            {/* Form controls */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-theme-primary text-theme-primary-contrast hover:bg-theme-primary-interaction flex items-center gap-2 rounded-md px-4 py-2 transition-colors"
                disabled={isSaving}
              >
                {isSaving ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingThemeId ? "Update" : "Save"} Theme
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                disabled={isSaving}
              >
                Reset
              </button>
            </div>
          </form>

          {/* Preview & Generated CSS */}
          <div className="sticky top-20 min-w-0 space-y-6 self-start">
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{previewType === "visual" ? "Preview" : "Generated CSS"}</h3>

                <div className="flex rounded bg-gray-100 p-1">
                  <button
                    className={`block rounded px-2 py-1 ${previewType === "visual" ? "bg-theme-accent" : "bg-transparent text-gray-700"}`}
                    onClick={() => setPreviewType("visual")}
                  >
                    <Eye className="size-4" />
                  </button>
                  <button
                    className={`block rounded px-2 py-1 ${previewType === "code" ? "bg-theme-accent" : "bg-transparent text-gray-700"}`}
                    onClick={() => setPreviewType("code")}
                  >
                    <Code className="size-4" />
                  </button>
                </div>
              </div>

              {/* Visual */}
              {previewType === "visual" && (
                <div
                  className={`rounded-lg border-2 bg-[var(--background-color)] p-4 text-[var(--text-color)]`}
                  style={
                    {
                      "--text-color": previewThemeMode === "dark" ? "#fff" : "#000",
                      "--background-color": previewThemeMode === "dark" ? "#000" : "#fff",
                    } as CSSProperties
                  }
                >
                  <div className="space-y-4">
                    {/* Primary */}
                    <div className="space-y-3">
                      <div
                        className="rounded px-4 py-2 text-center font-medium"
                        style={{
                          backgroundColor: previewThemeMode === "dark" ? primaryColor.dark : primaryColor.light,
                          color: previewThemeMode === "dark" ? primaryContrast.dark : primaryContrast.light,
                        }}
                      >
                        Primary
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {Object.entries(generatePalette(previewThemeMode === "dark" ? primaryColor.dark : primaryColor.light)).map(([shade, color]) => (
                          <div
                            key={shade}
                            className="flex h-8 items-center justify-center rounded text-xs font-medium"
                            style={{
                              backgroundColor: color,
                              color: previewThemeMode === "dark" ? primaryContrast.dark : primaryContrast.light,
                            }}
                            title={`${shade}: ${color}`}
                          >
                            {shade}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Accent */}
                    <div className="space-y-3">
                      <div
                        className="rounded px-4 py-2 text-center font-medium"
                        style={{
                          backgroundColor: previewThemeMode === "dark" ? accentColor.dark : accentColor.light,
                          color: previewThemeMode === "dark" ? accentContrast.dark : accentContrast.light,
                        }}
                      >
                        Accent
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {Object.entries(generatePalette(previewThemeMode === "dark" ? accentColor.dark : accentColor.light)).map(([shade, color]) => (
                          <div
                            key={shade}
                            className="flex h-8 items-center justify-center rounded text-xs font-medium"
                            style={{
                              backgroundColor: color,
                              color: previewThemeMode === "dark" ? accentContrast.dark : accentContrast.light,
                            }}
                            title={`${shade}: ${color}`}
                          >
                            {shade}
                          </div>
                        ))}
                      </div>
                      <TogglePreview
                        label="Toggles"
                        name="themeToggle"
                        color={previewThemeMode === "dark" ? accentColor.dark : accentColor.light}
                        contrast={previewThemeMode === "dark" ? accentContrast.dark : accentContrast.light}
                        mode={previewThemeMode}
                        defaultChecked
                      />
                      <br />
                      <div>
                        <RadioPreview
                          label="Radio 1"
                          name="sample"
                          value="sample-value-1"
                          color={previewThemeMode === "dark" ? accentColor.dark : accentColor.light}
                          contrast={previewThemeMode === "dark" ? accentContrast.dark : accentContrast.light}
                          mode={previewThemeMode}
                          defaultChecked
                        />
                        <br />
                        <RadioPreview
                          label="Radio 2"
                          name="sample"
                          value="sample-value-2"
                          color={previewThemeMode === "dark" ? accentColor.dark : accentColor.light}
                          contrast={previewThemeMode === "dark" ? accentContrast.dark : accentContrast.light}
                          mode={previewThemeMode}
                        />
                      </div>
                      <div>
                        <CheckboxPreview
                          label="Checkbox 1"
                          name="checkbox1"
                          color={previewThemeMode === "dark" ? accentColor.dark : accentColor.light}
                          contrast={previewThemeMode === "dark" ? accentContrast.dark : accentContrast.light}
                          mode={previewThemeMode}
                          defaultChecked
                        />
                        <br />
                        <CheckboxPreview
                          label="Checkbox 2"
                          name="checkbox2"
                          color={previewThemeMode === "dark" ? accentColor.dark : accentColor.light}
                          contrast={previewThemeMode === "dark" ? accentContrast.dark : accentContrast.light}
                          mode={previewThemeMode}
                        />
                      </div>
                      <div className="flex gap-2">
                        {[TrendingUp, DollarSign, Users].map((Icon, index) => (
                          <div
                            key={index}
                            className="w-max shrink-0 rounded-full bg-[var(--accent-faded-color)] p-3 text-[var(--accent-color)]"
                            style={
                              {
                                "--accent-color": previewThemeMode === "dark" ? accentColor.dark : accentColor.light,
                                "--accent-faded-color": `color-mix(in oklab, var(--accent-color) 10%, transparent)`,
                              } as CSSProperties
                            }
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Code */}
              {previewType === "code" && (
                <div className="relative">
                  <div className="absolute top-1 right-6">
                    <CopyIconButton
                      value={generatedCSS}
                      onCopySuccess={() => toast("CSS copied to clipboard!")}
                    />
                  </div>
                  <div className="max-h-96 w-full overflow-scroll rounded bg-gray-100 p-3 text-xs">
                    <pre>{generatedCSS}</pre>
                  </div>
                </div>
              )}
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
                  className="rounded-lg border bg-gray-100 p-4 transition-shadow hover:shadow-md"
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
                              backgroundColor: theme.primaryColor.light,
                            }}
                            title={`Primary: ${theme.primaryColor.light}`}
                          >
                            <span style={{ color: theme.primaryContrast.light }}>1</span>
                          </div>
                          <div>Primary</div>
                        </div>
                        <div>
                          <div
                            className="mx-auto grid h-8 w-8 place-items-center rounded border-2 border-gray-200"
                            style={{
                              backgroundColor: theme.accentColor.light,
                            }}
                            title={`Accent: ${theme.accentColor.light}`}
                          >
                            <span style={{ color: theme.accentContrast.light }}>1</span>
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
                              backgroundColor: theme.primaryColor.dark,
                            }}
                            title={`Primary: ${theme.primaryColor.dark}`}
                          >
                            <span style={{ color: theme.primaryContrast.dark }}>2</span>
                          </div>
                          <div>Primary</div>
                        </div>
                        <div>
                          <div
                            className="mx-auto grid h-8 w-8 place-items-center rounded border-2 border-gray-200"
                            style={{
                              backgroundColor: theme.accentColor.dark,
                            }}
                            title={`Accent: ${theme.accentColor.dark}`}
                          >
                            <span style={{ color: theme.accentContrast.dark }}>2</span>
                          </div>
                          <div>Accent</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(theme.css);
                        toast.success("CSS copied to clipboard!");
                      }}
                      className="flex-1 rounded bg-gray-200 px-2 py-1 text-xs transition-colors hover:bg-gray-300"
                    >
                      Copy CSS
                    </button>
                    <Link
                      className="text-theme-primary hover:bg-theme-primary/10 rounded px-2 py-1 text-xs"
                      href={`?id=${theme.id}`}
                      title="Update this theme"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-2 text-xs text-gray-400">Created: {new Date(theme.createdAt).toLocaleDateString()}</div>
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
