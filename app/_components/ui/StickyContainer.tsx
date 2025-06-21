import React, { useState, useEffect, useRef, ReactNode, CSSProperties } from "react";

type StickyPosition = "top" | "bottom";

interface StickContainerProps {
  children: ReactNode;
  position?: StickyPosition;
  className?: string;
  offset?: string; // Custom offset value like '10px', '1rem', etc.
}

const StickyContainer: React.FC<StickContainerProps> = ({ children, position = "bottom", className = "", offset = "0px" }) => {
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = stickyRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the sentinel is not intersecting, the sticky element is sticking
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: getSentinelMargin(position),
      }
    );

    // Create a sentinel element to detect sticking
    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.pointerEvents = "none";
    sentinel.style.opacity = "0";

    // Position the sentinel based on sticky position
    switch (position) {
      case "top":
        sentinel.style.top = `calc(-1px - ${offset})`;
        sentinel.style.left = "0";
        sentinel.style.right = "0";
        sentinel.style.height = "1px";
        break;
      case "bottom":
        sentinel.style.bottom = `calc(-1px - ${offset})`;
        sentinel.style.left = "0";
        sentinel.style.right = "0";
        sentinel.style.height = "1px";
        break;
      /* case "left":
        sentinel.style.left = `calc(-1px - ${offset})`;
        sentinel.style.top = "0";
        sentinel.style.bottom = "0";
        sentinel.style.width = "1px";
        break;
      case "right":
        sentinel.style.right = `calc(-1px - ${offset})`;
        sentinel.style.top = "0";
        sentinel.style.bottom = "0";
        sentinel.style.width = "1px";
        break; */
    }

    element.appendChild(sentinel);
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (element.contains(sentinel)) {
        element.removeChild(sentinel);
      }
    };
  }, [position, offset]);

  const getSentinelMargin = (pos: StickyPosition): string => {
    switch (pos) {
      case "top":
        return `0px 0px -100% 0px`;
      case "bottom":
        return `-100% 0px 0px 0px`;
      /* case "left":
        return `0px -100% 0px 0px`;
      case "right":
        return `0px 0px 0px -100%`; */
      default:
        return "0px";
    }
  };

  const getStickyClasses = (): string => {
    const baseClasses = "sticky";
    const positionClasses = {
      top: `top-[var(--offset)]`,
      bottom: `bottom-[var(--offset)]`,
      left: `left-[var(--offset)]`,
      right: `right-[var(--offset)]`,
    };

    return `${baseClasses} ${positionClasses[position]}`;
  };

  const getGradientClasses = (): string => {
    const gradients = "bg-radial from-gray-1000/10 via-gray-500/5 to-transparent";

    return gradients;
  };

  return (
    <div
      ref={stickyRef}
      className={` ${getStickyClasses()} transition-all duration-300 ease-in-out ${className} `.trim()}
      data-sticky={isSticky}
      style={{ "--offset": offset } as CSSProperties}
    >
      {!isSticky && position === "bottom" && (
        <div
          className={`relative -z-[1] mx-auto -mb-1 h-2 ${getGradientClasses()} `}
          style={{
            borderRadius: "75% 75% 0 0 / 100% 100% 0 0",
          }}
        ></div>
      )}
      {children}
      {!isSticky && position === "top" && (
        <div
          className={`relative -z-[1] mx-auto -mt-1 h-2 ${getGradientClasses()} `}
          style={{
            borderRadius: "0% 0% 75% 75% / 0 0 100% 100%",
          }}
        ></div>
      )}
    </div>
  );
};

export default StickyContainer;
