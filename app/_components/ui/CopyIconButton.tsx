"use client";
import { Check, ClipboardCopy } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface CopyIconButtonProps {
  value: string;
  className?: string;
  size?: number;
  title?: string;
  resetDelay?: number; // milliseconds to show success state
  onCopySuccess?: (value: string) => void;
  onCopyError?: (error: Error) => void;
}

const CopyIconButton = ({ value, className = "", size = 16, title = "Copy to clipboard", resetDelay = 2000, onCopySuccess, onCopyError }: CopyIconButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      // Clear previous timeout if exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsCopied(true);
      onCopySuccess?.(value);

      // Reset the copied state after delay
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
        timeoutRef.current = null;
      }, resetDelay);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to copy to clipboard");
      console.error("Failed to copy:", error);
      onCopyError?.(error);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      onClick={handleCopy}
      className={className}
      title={isCopied ? "Copied!" : title}
      disabled={isCopied}
      type="button"
    >
      {isCopied ? <Check size={size} /> : <ClipboardCopy size={size} />}
    </button>
  );
};

export default CopyIconButton;
