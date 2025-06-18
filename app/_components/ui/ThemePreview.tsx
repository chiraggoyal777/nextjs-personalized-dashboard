import { ButtonTabsPreview } from "@/components/ui/ButtonTabs";
import { CheckboxPreview } from "@/components/ui/Checkbox";
import RadioGroup from "@/components/ui/RadioGroup";
import { TogglePreview } from "@/components/ui/Toggle";
import { generatePalette } from "@/lib/helpers";
import { ThemePalette } from "@/types/theme";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import React, { CSSProperties } from "react";

interface ThemPreviewProps {
  primaryColor: ThemePalette;
  primaryContrast: ThemePalette;
  accentColor: ThemePalette;
  accentContrast: ThemePalette;
  previewThemeMode: keyof ThemePalette;
}
const ThemePreview = (props: ThemPreviewProps) => {
  const { primaryColor, primaryContrast, accentColor, accentContrast, previewThemeMode } = props;

  return (
    <div
      className={`tp ${previewThemeMode === "dark" ? "tp-dark" : ""}`}
      style={
        {
          "--color-theme-primary": primaryColor[previewThemeMode],
          "--color-theme-primary-contrast": primaryContrast[previewThemeMode],
          "--color-theme-accent": accentColor[previewThemeMode],
          "--color-theme-accent-contrast": accentContrast[previewThemeMode],
        } as CSSProperties
      }
    >
      <div className="bg-gray-0 tp-dark:bg-gray-50 rounded-lg border-2 p-4">
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
              defaultChecked
            />
            <br />
            <div>
              <RadioGroup
                name="uncontrolled-example"
                defaultValue="option2"
                onChange={(value) => console.log("Selected:", value)}
                options={[
                  { value: "option1", label: "First Choice" },
                  { value: "option2", label: "Second Choice" },
                  { value: "option3", label: "Third Choice" },
                ]}
              />
            </div>
            <div>
              <CheckboxPreview
                label="Checkbox 1"
                name="checkbox1"
              />
              <br />
              <CheckboxPreview
                label="Checkbox 2"
                name="checkbox2"
              />
            </div>
            <div className="flex">
              <ButtonTabsPreview
                tabs={[
                  { value: 1, elm: "ButtonTab one" },
                  { value: 2, elm: "Some long name ButtonTab" },
                  { value: 3, elm: "ButtonTab three" },
                ]}
                defaultActiveTab={1}
              />
            </div>
            <div className="flex gap-2">
              {[TrendingUp, DollarSign, Users].map((Icon, index) => (
                <div
                  key={index}
                  className="w-max shrink-0 rounded-full bg-theme-accent/10 p-3 text-theme-accent"
                >
                  <Icon className="h-6 w-6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
