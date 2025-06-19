import React, { useState } from "react";

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
      className="flex cursor-pointer items-center gap-2"
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
      <div className="peer peer-checked:bg-theme-accent peer-focus:ring-theme-accent/50 after:bg-theme-accent-contrast peer-checked:after:border-gray-0 relative h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-2 peer-focus:outline-none peer-disabled:opacity-50 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:transition-all after:content-[''] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full" />
    </label>
  );
};

export default Toggle;

export const TogglePreview = (props: ToggleProps) => {
  return <Toggle {...props} />;
};
