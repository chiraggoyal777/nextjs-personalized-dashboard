import { ButtonHTMLAttributes, forwardRef, JSX } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "gray" | "outline";
  size?: "sm" | "md" | "lg";
  brand?: boolean | undefined;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className = "", variant = "primary", size = "md", children, startIcon, endIcon, brand = false, ...props }, ref) => {
  const variantType = brand ? "brand" : "theme";
  const baseClasses = "inline-flex gap-2 items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none leading-normal";

  const variants = {
    brand: {
      primary: `bg-primary hover:bg-primary-interaction focus:ring-primary/50`,
      accent: `bg-accent hover:bg-accent-interaction focus:ring-accent/50`,
      gray: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-100/50",
      outline: `border border-primary text-primary hover:bg-primary hover:text-gray-0 focus:ring-primary/20`,
    },
    theme: {
      primary: `bg-theme-primary hover:bg-theme-primary-interaction focus:ring-theme-primary/50`,
      accent: `bg-theme-accent hover:bg-theme-accent-interaction focus:ring-theme-accent/50`,
      gray: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-100/50",
      outline: `border border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-gray-0 focus:ring-theme-primary/20`,
    },
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variants[variantType][variant]} ${sizes[size]} ${className} $`}
      {...props}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
