import { forwardRef, JSX, AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { UrlObject } from "url";

type Variant = "solid" | "outlined" | "ghost" | "fill";
type Color = "primary" | "accent" | "danger" | "gray";
export type BtnSize = "xs" | "sm" | "md" | "lg";

export const BTN_SIZE_CLASSES: Record<BtnSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const BTN_ROUNDED_SIZE_CLASSES: Record<BtnSize, string> = {
  xs: "p-1 text-xs",
  sm: "p-1.5 text-sm",
  md: "p-2 text-base",
  lg: "p-3 text-lg",
};
interface SharedProps {
  variant?: Variant;
  color?: Color;
  size?: BtnSize;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  className?: string;
  children?: React.ReactNode;
  asAnchor?: boolean;
  roundedFull?: boolean;
}

type AnchorOrLinkProps = SharedProps & {
  href: string | UrlObject;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type NativeButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonProps = AnchorOrLinkProps | NativeButtonProps;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>((props, ref) => {
  const { className = "", variant = "solid", color = "primary", size = "md", children, startIcon, endIcon, asAnchor, roundedFull = false, ...rest } = props;

  const baseClasses = "btn";

  const colorStyles: Record<Color, Record<Variant, string>> = {
    primary: {
      solid: "border-theme-primary bg-theme-primary text-theme-primary-contrast hover:bg-theme-primary-interaction hover:border-theme-primary-interaction focus:ring-theme-primary/20",
      outlined: "border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-theme-primary-interaction focus:ring-theme-primary/20",
      ghost: "border-transparent text-theme-primary hover:bg-theme-primary/20 hover:text-theme-primary focus:ring-theme-primary/20",
      fill: "border-transparent text-[inherit] hover:bg-theme-primary hover:text-theme-primary-contrast focus:ring-theme-primary/20",
    },
    accent: {
      solid: "border-theme-accent bg-theme-accent text-theme-accent-contrast hover:bg-theme-accent-interaction  hover:border-theme-accent-interaction focus:ring-theme-accent/20",
      outlined: "border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-theme-accent-interaction focus:ring-theme-accent/20",
      ghost: "border-transparent text-theme-accent hover:bg-theme-accent/20 hover:text-theme-accent focus:ring-theme-accent/20",
      fill: "border-transparent text-[inherit] hover:bg-theme-accent hover:text-theme-accent-contrast focus:ring-theme-accent/20",
    },
    danger: {
      solid: "border-danger bg-danger text-gray-0 focus:ring-danger/20",
      outlined: "border-danger text-danger hover:bg-danger hover:text-gray-0 focus:ring-danger/20",
      ghost: "border-transparent text-danger hover:bg-danger/20 hover:text-danger focus:ring-danger/20",
      fill: "border-transparent text-[inherit] hover:bg-danger hover:text-gray-0 focus:ring-danger/20",
    },
    gray: {
      solid: "border-gray-100 bg-gray-100 text-gray-900 hover:bg-gray-300 hover:border-gray-300 focus:ring-gray-300/20",
      outlined: "border-gray-100 text-gray-100 hover:bg-gray-300 hover:border-gray-300 hover:text-gray-900 focus:ring-gray-300/20",
      ghost: "border-transparent text-[inherit] hover:bg-current/20 focus:ring-current/20",
      fill: "border-transparent text-[inherit] hover:bg-gray-300 hover:text-gray-600 focus:ring-gray-300/20",
    },
  };

  const finalClassName = `${baseClasses} ${colorStyles[color][variant]} ${roundedFull ? " btn-roundedFull " + BTN_ROUNDED_SIZE_CLASSES[size] : BTN_SIZE_CLASSES[size]} ${className}`;

  const content = (
    <>
      {startIcon && <span className="btn-icon btn-startIcon">{startIcon}</span>}
      {children && <span>{children}</span>}
      {endIcon && <span className="btn-icon btn-endIcon">{endIcon}</span>}
    </>
  );

  // Render <a> tag
  if ("href" in props && props.href) {
    const { href } = props;

    if (asAnchor) {
      return (
        <a
          href={typeof href === "string" ? href : ""}
          className={finalClassName}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    } else {
      return (
        <Link
          href={href}
          className={finalClassName}
          {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">)}
        >
          {content}
        </Link>
      );
    }
  }

  // Render <button>
  return (
    <button
      className={finalClassName}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";
export { Button };
