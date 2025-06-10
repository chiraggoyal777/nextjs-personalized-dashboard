import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gray" | "outline";
  size?: "sm" | "md" | "lg";
  brand?: boolean | undefined;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      children,
      brand = false,
      ...props
    },
    ref,
  ) => {
    const variantType = brand ? "brand" : "theme";
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      brand: {
        primary: `bg-primary hover:bg-primary-interaction focus:ring-primary/50`,
        gray: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-100/50",
        outline: `border border-primary text-primary hover:bg-primary hover:text-gray-0 focus:ring-primary/20`,
      },
      theme: {
        primary: `bg-theme-primary hover:bg-theme-primary-interaction focus:ring-theme-primary/50`,
        gray: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-100/50",
        outline: `border border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-gray-0 focus:ring-theme-primary/20`,
      },
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variants[variantType][variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
