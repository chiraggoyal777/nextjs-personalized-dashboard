import React from "react";
import { ThemeStore } from "@/types/theme";
import { useTheme } from "@/components/contexts/ThemeProvider";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Palette, Trash2, Download, Loader as LoaderIcon, Copy, Check, Eye } from "lucide-react";

const SavedThemes = () => {
  const { savedThemes, setSavedThemes, theme: activeTheme, setTheme, applyingThemeId, applyThemeGlobal } = useTheme();

  const deleteTheme = (themeId: ThemeStore["id"]) => {
    const updatedThemes = savedThemes.filter((theme) => theme.id !== themeId);
    toast.success("Theme deleted!");
    setSavedThemes(updatedThemes);
    if (activeTheme && activeTheme.id === themeId) {
      setTheme(null);
    }
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
  return (
    <div
      className="bg-gray-0 rounded-lg p-6 shadow-lg max-sm:-mx-4 max-sm:rounded-none max-sm:shadow-none dark:bg-gray-50"
      id="themes"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Saved Themes ({savedThemes.length})</h2>
        {savedThemes.length > 0 && (
          <Button
            color="accent"
            size="sm"
            onClick={exportThemes}
            startIcon={<Download />}
          >
            Export All
          </Button>
        )}
      </div>

      {savedThemes.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <Palette className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p>No themes saved yet. Create your first custom theme above!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedThemes
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((theme) => (
              <div
                key={theme.id}
                className="space-y-3 rounded-lg border bg-gray-50 p-4 transition-shadow hover:shadow-md dark:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2 text-base leading-normal">
                    <h3 className="text-[length:inherit] leading-[inherit] font-semibold text-gray-800">{theme.label}</h3>
                    {activeTheme?.id === theme.id && (
                      <span
                        className="flex h-[1lh] shrink-0 items-center justify-center"
                        title="Currently active"
                      >
                        <Eye className="size-[1.25em]" />
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    color="danger"
                    size="sm"
                    onClick={() => deleteTheme(theme.id)}
                    startIcon={<Trash2 />}
                    title="Delete theme"
                    aria-label="Delete theme"
                    roundedFull
                  />
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
                  <Button
                    color="primary"
                    variant={activeTheme?.id === theme.id ? "ghost" : "solid"}
                    size="sm"
                    className="btn-full"
                    onClick={() => applyThemeGlobal(theme)}
                    disabled={applyingThemeId === theme.id || activeTheme?.id === theme.id}
                    startIcon={applyingThemeId === theme.id ? <LoaderIcon className="animate-spin" /> : activeTheme?.id === theme.id ? <Check /> : undefined}
                  >
                    {activeTheme?.id === theme.id ? "Active" : "Apply"}
                  </Button>
                  <Button
                    color="accent"
                    variant="outlined"
                    size="sm"
                    href={`?id=${theme.id}`}
                    className="btn-full"
                  >
                    Edit
                  </Button>
                  <Button
                    color="accent"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(theme.css);
                      toast.success("CSS copied to clipboard!");
                    }}
                    startIcon={<Copy />}
                    title="Copy CSS"
                    aria-label="Copy CSS"
                  />
                </div>

                <div className="mt-2 text-xs text-gray-400">Created: {new Date(theme.createdAt).toDateString()}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SavedThemes;
