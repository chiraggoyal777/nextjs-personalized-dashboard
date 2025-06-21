import React, { JSX, ReactNode } from "react";

interface Props {
  icon: JSX.Element;
  className?: string;
  main: ReactNode;
  children?: ReactNode;
  iconPlacement?: "start" | "end";
}
const TextWithIcon = ({ icon, main, children, className = "", iconPlacement = "start" }: Props) => {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <span className={`flex h-[1lh] shrink-0 items-center justify-center ${iconPlacement === "start" ? "order-first" : "order-last"}`}>{icon}</span>
      <div>
        {main}
        {children}
      </div>
    </div>
  );
};

export default TextWithIcon;
