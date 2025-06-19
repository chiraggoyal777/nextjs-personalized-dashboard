import React, { ReactNode, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value?: string; // controlled
  defaultValue?: string; // uncontrolled
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

const Input: React.FC<InputProps> = ({ label, value, defaultValue, onChange, required = false, type = "text", name, id, placeholder, className = "", startAdornment, endAdornment, ...rest }) => {
  const inputId = useId();
  const inputName = name || inputId;
  const inputIdFinal = id || inputId;

  return (
    <div className="block w-full space-y-1">
      {label && (
        <label
          htmlFor={inputIdFinal}
          className="block text-sm font-medium text-gray-600"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        {startAdornment}
        <input
          id={inputIdFinal}
          name={inputName}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          className={`focus:ring-theme-primary focus:border-theme-primary grow rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 placeholder-gray-400 transition-all duration-150 focus:ring-2 focus:outline-none ${className} `}
          required={required}
          {...rest}
        />
        {endAdornment}
      </div>
    </div>
  );
};

export default Input;

export const InputPreview = (props: InputProps) => {
  return <Input {...props} />;
};
