import { Button } from "@/components/ui/Button";
import { ButtonTabsPreview } from "@/components/ui/ButtonTabs";
import { CheckboxPreview } from "@/components/ui/Checkbox";
import { InputPreview } from "@/components/ui/Input";
import { RadioGroupPreview } from "@/components/ui/RadioGroup";
import { TogglePreview } from "@/components/ui/Toggle";
import { PaletteState, ShadesPalette, ThemePalette } from "@/types/theme";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import React, { CSSProperties } from "react";

interface ThemPreviewProps {
  primaryColor: PaletteState;
  primaryShades: ShadesPalette;
  accentColor: PaletteState;
  accentShades: ShadesPalette;
  previewThemeMode: keyof ThemePalette;
}
const ThemePreview = (props: ThemPreviewProps) => {
  const { primaryColor, accentColor, previewThemeMode, primaryShades, accentShades } = props;

  return (
    <div
      className={`tp ${previewThemeMode === "dark" ? "tp-dark" : ""}`}
      style={
        {
          "--color-theme-primary": primaryColor.DEFAULT,
          "--color-theme-primary-interaction": primaryColor.interaction,
          "--color-theme-primary-contrast": primaryColor.contrast,
          "--color-theme-accent": accentColor.DEFAULT,
          "--color-theme-accent-interaction": accentColor.interaction,
          "--color-theme-accent-contrast": accentColor.contrast,
        } as CSSProperties
      }
    >
      <div className="bg-gray-0 tp-dark:bg-gray-50 rounded-lg border-2 p-4">
        <div className="space-y-4">
          {/* Primary */}
          <div className="space-y-3">
            <div className="space-y-2">
              <InputPreview
                type="email"
                label="Email"
                placeholder="Email"
              />
              <InputPreview
                type="password"
                label="Password"
                placeholder="Password"
              />
            </div>
            <div>
              <Button
                className="block w-full"
                variant="primary"
                type="button"
              >
                Primary
              </Button>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {Object.entries(primaryShades).map(([shade, color]) => (
                <div
                  key={shade}
                  className="flex h-8 items-center justify-center rounded text-xs font-medium"
                  style={{
                    backgroundColor: color,
                    color: primaryColor.contrast,
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
            <div>
              <Button
                className="block w-full"
                variant="accent"
                type="button"
              >
                Accent
              </Button>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {Object.entries(accentShades).map(([shade, color]) => (
                <div
                  key={shade}
                  className="flex h-8 items-center justify-center rounded text-xs font-medium"
                  style={{
                    backgroundColor: color,
                    color: accentColor.contrast,
                  }}
                  title={`${shade}: ${color}`}
                >
                  {shade}
                </div>
              ))}
            </div>
            <div>
              <TogglePreview
                label="Toggles"
                name="themeToggle"
                defaultChecked
              />
            </div>
            <div>
              <RadioGroupPreview
                name="uncontrolled-example"
                defaultValue="option2"
                options={[
                  { value: "option1", label: "First Choice" },
                  { value: "option2", label: "Second Choice" },
                  { value: "option3", label: "Third Choice" },
                ]}
              />
            </div>
            <div className="space-y-2">
              <CheckboxPreview
                label="Checkbox 1"
                name="checkbox1"
              />
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
                  className="bg-theme-accent/10 text-theme-accent w-max shrink-0 rounded-full p-3"
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
