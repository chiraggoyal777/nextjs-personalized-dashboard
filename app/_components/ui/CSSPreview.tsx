import CopyIconButton from "@/components/ui/CopyIconButton";
import React from "react";
import toast from "react-hot-toast";

const CSSPreview = ({ css }: { css: string }) => {
  return (
    <div className="relative">
      <div className="absolute top-1 right-6">
        <CopyIconButton
          value={css}
          onCopySuccess={() => toast("CSS copied to clipboard!")}
        />
      </div>
      <div className="max-h-96 w-full overflow-scroll rounded bg-gray-100 p-3 text-xs">
        <pre>{css}</pre>
      </div>
    </div>
  );
};

export default CSSPreview;
