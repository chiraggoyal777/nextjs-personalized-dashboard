import { Check } from "lucide-react";
import { useEffect, useRef } from "react";

// Lightweight dropdown component
interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  position?: "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";
  customWidthClasses?: string;
}

function Dropdown({ trigger, children, isOpen, onToggle, onClose, position = "bottom-center", customWidthClasses }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <div onClick={onToggle}>{trigger}</div>
      {isOpen && <div className={`bg-gray-0 absolute z-50 my-2 max-h-[calc(100vh-4rem)] overflow-auto rounded-lg py-1 text-gray-900 shadow-lg ${customWidthClasses ? customWidthClasses : "w-48"} ${position.includes("center") ? "left-1/2 -translate-x-1/2" : ""} ${position.includes("right") ? "right-0" : ""} ${position.includes("left") ? "left-0" : ""} ${position.includes("top") ? "bottom-full" : ""} ${position.includes("bottom") ? "top-full" : ""} `}>{children}</div>}
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick: () => void;
  isSelected?: boolean;
}

export function DropdownItem({ children, onClick, isSelected }: DropdownItemProps) {
  return (
    <button
      className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm leading-tight transition-colors hover:bg-gray-200"
      onClick={onClick}
    >
      <span className="min-w-0 grow">{children}</span>
      {isSelected && <Check className="h-4 w-4 shrink-0" />}
    </button>
  );
}

export default Dropdown;
