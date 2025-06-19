"use client";
import React from "react";
import { useScrollbarSize } from "@/components/hooks/hooks";
import CopyIconButton from "@/components/ui/CopyIconButton";
import toast from "react-hot-toast";

const CSSPreview = ({ css }: { css: string }) => {
  const { scrollbarWidth } = useScrollbarSize();
  return (
    <div className="relative">
      <div
        className="absolute"
        style={{ right: scrollbarWidth + 10, top: 10 }}
      >
        <CopyIconButton
          value={css}
          onCopySuccess={() => toast("CSS copied to clipboard!")}
        />
      </div>
      <div
        className="max-h-96 w-full overflow-scroll rounded bg-gray-100 p-3 text-xs"
        style={{ scrollbarWidth: "thin" }}
      >
        <pre>{css}</pre>
      </div>
    </div>
  );
};

export default CSSPreview;
