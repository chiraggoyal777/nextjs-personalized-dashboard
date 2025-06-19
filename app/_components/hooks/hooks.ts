import { useEffect, useState } from "react";

// Debounce hook for performance optimization
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export function useScrollbarSize(): { scrollbarWidth: number; scrollbarHeight: number } {
  const [size, setSize] = useState({ scrollbarWidth: 0, scrollbarHeight: 0 });

  useEffect(() => {
    const measure = () => {
      const scrollDiv = document.createElement("div");
      scrollDiv.style.width = "100px";
      scrollDiv.style.height = "100px";
      scrollDiv.style.overflow = "scroll";
      scrollDiv.style.position = "absolute";
      scrollDiv.style.top = "-9999px";

      document.body.appendChild(scrollDiv);

      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      const scrollbarHeight = scrollDiv.offsetHeight - scrollDiv.clientHeight;

      document.body.removeChild(scrollDiv);

      setSize({ scrollbarWidth, scrollbarHeight });
    };

    measure();

    // Modern: observe root/document changes in layout
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => measure());
      resizeObserver.observe(document.documentElement);
    }

    // Fallback: window resize event
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return size;
}
