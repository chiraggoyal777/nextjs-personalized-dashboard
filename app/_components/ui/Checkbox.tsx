import React, { useState } from "react";

interface CheckboxProps {
  label: string;
  name: string;
  value?: string; // Optional, used only in form submit
  checked?: boolean; // Controlled
  defaultChecked?: boolean; // Uncontrolled
  onChange?: (checked: boolean) => void;
  readonly?: boolean;
  disabled?: boolean;
  helpText?: string;
}

const Checkbox = ({ label, name, value, checked, defaultChecked = false, onChange, readonly = false, disabled = false, helpText }: CheckboxProps) => {
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
    <div>
      <label
        htmlFor={name}
        className="flex cursor-pointer items-center gap-2"
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
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  );
};

export default Checkbox;

export const CheckboxPreview = (props: CheckboxProps) => {
  return <Checkbox {...props} />;
};
