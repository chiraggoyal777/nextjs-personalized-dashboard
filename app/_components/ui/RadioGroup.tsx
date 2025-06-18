import React, { useState } from "react";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  readOnly?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  name: string;
  value?: string; // Controlled
  defaultValue?: string; // Uncontrolled
  onChange?: (value: string) => void;
  title?: string; // Optional fieldset title
  disabled?: boolean; // Global disabled state
  readOnly?: boolean; // Global readonly state
}

const RadioGroup = ({ 
  options, 
  name, 
  value, 
  defaultValue, 
  onChange, 
  title,
  disabled = false,
  readOnly = false
}: RadioGroupProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (optionValue: string, option: RadioOption) => {
    // Check if this specific option or the group is readonly
    if (readOnly || option.readOnly) return;

    if (isControlled) {
      onChange?.(optionValue);
    } else {
      setInternalValue(optionValue);
      onChange?.(optionValue);
    }
  };

  const renderRadio = (option: RadioOption) => {
    const isChecked = currentValue === option.value;
    const isDisabled = disabled || option.disabled;
    const isReadOnly = readOnly || option.readOnly;

    return (
      <label 
        key={option.value}
        className={`inline-flex items-center gap-2 ${
          isDisabled ? 'cursor-not-allowed' : isReadOnly ? 'cursor-default' : 'cursor-pointer'
        }`}
      >
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={isChecked}
          onChange={() => handleChange(option.value, option)}
          className="peer sr-only"
          disabled={isDisabled}
          readOnly={isReadOnly}
        />
        <div className={`
          h-5 w-5 rounded-full border-2 border-gray-400 bg-gray-0 
          peer-checked:bg-theme-accent peer-checked:border-theme-accent 
          peer-focus:ring-2 peer-focus:ring-theme-accent/50 
          text-theme-accent-contrast
          ${isDisabled ? 'opacity-50' : ''}
        `}>
          {isChecked && (
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="3" />
            </svg>
          )}
        </div>
        <span className={`text-sm font-medium text-gray-600 ${isDisabled ? 'opacity-50' : ''}`}>
          {option.label}
        </span>
      </label>
    );
  };

  const content = (
    <div className="flex flex-col gap-3">
      {options.map(renderRadio)}
    </div>
  );

  // If title is provided, wrap in fieldset with legend
  if (title) {
    return (
      <fieldset className="space-y-3">
        <legend className="text-base font-semibold text-gray-900">
          {title}
        </legend>
        {content}
      </fieldset>
    );
  }

  return content;
};

export default RadioGroup;

export const RadioGroupPreview = (props: RadioGroupProps) => {
  return <RadioGroup {...props} />;
};
