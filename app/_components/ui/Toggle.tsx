import React, { CSSProperties, useState } from "react";

interface ToggleProps {
  label: string;
  name: string;
  checked?: boolean; // for controlled
  defaultChecked?: boolean; // for uncontrolled initial state
  onChange?: (checked: boolean) => void; // callback for controlled
  readonly?: boolean;
  disabled?: boolean;
}

const Toggle = ({ label, name, checked, defaultChecked = false, onChange, readonly = false, disabled = false }: ToggleProps) => {
  // Determine if this is a controlled component
  const isControlled = checked !== undefined;

  // Internal state for uncontrolled usage, initialized from defaultChecked
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = () => {
    if (readonly) return;

    if (isControlled) {
      onChange?.(!checked);
    } else {
      setInternalChecked((prev) => {
        const newValue = !prev;
        onChange?.(newValue); // still notify parent
        return newValue;
      });
    }
  };

  return (
    <label
      htmlFor={name}
      className="inline-flex cursor-pointer items-center gap-2"
    >
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <input
        id={name}
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="peer sr-only"
        readOnly={readonly}
        disabled={disabled}
      />
      <div className="peer peer-checked:bg-theme-accent peer-focus:ring-theme-accent/50 after:bg-gray-0 peer-checked:after:border-gray-0 relative h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-2 peer-focus:outline-none peer-disabled:opacity-50 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:transition-all after:content-[''] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full" />
    </label>
  );
};

export default Toggle;

interface TogglePreviewProps {
  label: string;
  name: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  readonly?: boolean;
  disabled?: boolean;
  color: string; // dynamic accent color (e.g. "#3B82F6" or "rgb(59,130,246)")
  contrast: string; // dynamic accent color (e.g. "#3B82F6" or "rgb(59,130,246)")
  mode: "light" | "dark";
}

export const TogglePreview = ({ label, name, checked, defaultChecked = false, onChange, readonly = false, disabled = false, color, contrast, mode }: TogglePreviewProps) => {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = () => {
    if (readonly) return;

    if (isControlled) {
      onChange?.(!checked);
    } else {
      setInternalChecked((prev) => {
        const newValue = !prev;
        onChange?.(newValue);
        return newValue;
      });
    }
  };

  return (
    <label
      htmlFor={name}
      className="inline-flex cursor-pointer items-center gap-2"
    >
      <span className={`text-sm font-medium ${mode === "dark" ? "text-gray-400 dark:text-gray-600" : "text-gray-600 dark:text-gray-400"}`}>{label}</span>
      <input
        id={name}
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="peer sr-only"
        readOnly={readonly}
        disabled={disabled}
      />
      <div
        className={`peer peer-checked:after:border-gray-0 relative h-6 w-11 rounded-full peer-checked:bg-[var(--accent-color)] peer-focus:ring-2 peer-focus:ring-[var(--ring-color)] peer-focus:outline-none peer-disabled:opacity-50 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-[var(--contrast-color)] after:transition-all after:content-[''] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full ${mode === "dark" ? "bg-gray-800 dark:bg-gray-200" : "bg-gray-200 dark:bg-gray-800"}`}
        style={
          {
            "--contrast-color": contrast,
            "--accent-color": color,
            "--ring-color": "color-mix(in oklab, var(--accent-color) 50%, transparent)",
          } as CSSProperties
        }
      />
    </label>
  );
};
