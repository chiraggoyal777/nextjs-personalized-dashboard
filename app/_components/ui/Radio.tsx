import React, { CSSProperties, useEffect, useState } from "react";

interface RadioProps {
  label: string;
  name: string;
  value: string;
  checked?: boolean; // Controlled
  defaultChecked?: boolean; // Uncontrolled
  onChange?: (value: string) => void;
  readonly?: boolean;
  disabled?: boolean;
}

const Radio = ({ label, name, value, checked, defaultChecked = false, onChange, readonly = false, disabled = false }: RadioProps) => {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = () => {
    if (readonly) return;

    if (isControlled) {
      onChange?.(value);
    } else {
      setInternalChecked(true);
      onChange?.(value);
    }
  };
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        className="peer sr-only"
        readOnly={readonly}
        disabled={disabled}
      />
      <div className="text-theme-accent-contrast peer-focus:ring-theme-accent/50 bg-gray-0 peer-checked:bg-theme-accent peer-checked:border-theme-accent h-5 w-5 rounded-full border-2 border-gray-400 peer-focus:ring-2 peer-disabled:opacity-50">
        {isChecked && (
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="8"
              cy="8"
              r="3"
            />
          </svg>
        )}
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </label>
  );
};

export default Radio;

interface RadioPreviewProps {
  label: string;
  name: string;
  value: string;
  checked?: boolean; // Controlled
  defaultChecked?: boolean; // Uncontrolled
  onChange?: (value: string) => void;
  readonly?: boolean;
  disabled?: boolean;

  color: string; // dynamic accent color (e.g. "#3B82F6" or "rgb(59,130,246)")
  contrast: string; // dynamic accent color (e.g. "#3B82F6" or "rgb(59,130,246)")
  mode: "light" | "dark";
}

export const RadioPreview = ({ label, name, value, checked, defaultChecked = false, onChange, readonly = false, disabled = false, color, contrast, mode }: RadioPreviewProps) => {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  // For uncontrolled components, we need to listen to all radios with the same name
  useEffect(() => {
    if (!isControlled && name) {
      const handleRadioChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.name === name && target.type === "radio") {
          setInternalChecked(target.value === value);
        }
      };

      document.addEventListener("change", handleRadioChange);
      return () => document.removeEventListener("change", handleRadioChange);
    }
  }, [isControlled, name, value]);

  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    if (readonly) return;

    if (isControlled) {
      onChange?.(value);
    } else {
      // For uncontrolled, let the native radio behavior handle the state
      // The useEffect above will update our internal state
      onChange?.(value);
    }
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input
        type="radio"
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
        className={`peer-checked:border-bg-[var(--accent-color)] h-5 w-5 rounded-full border-2 text-[var(--contrast-color)] peer-checked:border-[var(--accent-color)] peer-checked:bg-[var(--accent-color)] peer-focus:ring-2 peer-focus:ring-[var(--ring-color)] peer-disabled:opacity-50 ${mode === "dark" ? "border-gray-800 dark:border-gray-200" : "border-gray-200 dark:border-gray-800"}`}
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
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="8"
              cy="8"
              r="3"
            />
          </svg>
        )}
      </div>
      <span className={`text-sm font-medium ${mode === "dark" ? "text-gray-400 dark:text-gray-600" : "text-gray-600 dark:text-gray-400"}`}>{label}</span>
    </label>
  );
};
