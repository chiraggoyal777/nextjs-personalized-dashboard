import React, { CSSProperties, useState } from "react";

interface CheckboxProps {
  label: string;
  name: string;
  value?: string; // Optional, used only in form submit
  checked?: boolean; // Controlled
  defaultChecked?: boolean; // Uncontrolled
  onChange?: (checked: boolean) => void;
  readonly?: boolean;
  disabled?: boolean;
}

const Checkbox = ({ label, name, value, checked, defaultChecked = false, onChange, readonly = false, disabled = false }: CheckboxProps) => {
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
      <input
        id={name}
        type="checkbox"
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        className="peer sr-only"
        readOnly={readonly}
        disabled={disabled}
      />
      <div className="text-theme-accent-contrast peer-focus:ring-theme-accent/50 bg-gray-0 peer-checked:bg-theme-accent peer-checked:border-theme-accent h-5 w-5 rounded border-2 border-gray-400 peer-focus:ring-2 peer-disabled:opacity-50">
        {isChecked && (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 8L7 11.5L12 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </label>
  );
};

export default Checkbox;
interface CheckboxPreviewProps {
  label: string;
  name: string;
  value?: string;
  checked?: boolean; // Controlled
  defaultChecked?: boolean; // Uncontrolled
  onChange?: (checked: boolean) => void;
  readonly?: boolean;
  disabled?: boolean;
  color: string; // dynamic accent color (e.g. "#3B82F6" or "rgb(59,130,246)")
  contrast: string; // dynamic accent color (e.g. "#3B82F6" or "rgb(59,130,246)")
  mode: "light" | "dark";
}

export const CheckboxPreview = ({ label, name, value, checked, defaultChecked = false, onChange, readonly = false, disabled = false, color, contrast, mode }: CheckboxPreviewProps) => {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readonly) return;

    const newChecked = e.target.checked;

    if (isControlled) {
      // For controlled components, just call onChange
      onChange?.(newChecked);
    } else {
      // For uncontrolled components, update internal state
      setInternalChecked(newChecked);
      onChange?.(newChecked);
    }
  };

  return (
    <label
      htmlFor={name}
      className="inline-flex cursor-pointer items-center gap-2"
    >
      <input
        id={name}
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={isControlled ? undefined : defaultChecked}
        checked={isControlled ? checked : undefined}
        onChange={handleChange}
        className="peer sr-only"
        readOnly={readonly}
        disabled={disabled}
      />
      <div
        className={`peer-checked:border-bg-[var(--accent-color)] h-5 w-5 rounded border-2 text-[var(--contrast-color)] peer-checked:border-[var(--accent-color)] peer-checked:bg-[var(--accent-color)] peer-focus:ring-2 peer-focus:ring-[var(--ring-color)] peer-disabled:opacity-50 ${mode === "dark" ? "border-gray-800 dark:border-gray-200" : "border-gray-200 dark:border-gray-800"}`}
        style={
          {
            "--contrast-color": contrast,
            "--accent-color": color,
            "--ring-color": "color-mix(in oklab, var(--accent-color) 50%, transparent)",
          } as CSSProperties
        }
      >
        {isChecked && (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <path
              d="M4 8L7 11.5L12 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className={`text-sm font-medium ${mode === "dark" ? "text-gray-400 dark:text-gray-600" : "text-gray-600 dark:text-gray-400"}`}>{label}</span>
    </label>
  );
};
