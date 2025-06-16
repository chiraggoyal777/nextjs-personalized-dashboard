import { Loader as LoaderIcon } from "lucide-react";
import React from "react";
interface LoaderProps {
  contained?: boolean;
}
const Loader = ({ contained = false }: LoaderProps) => {
  return (
    <div className={`grid place-items-center ${contained ? "h-96" : "h-screen"}`}>
      <LoaderIcon className="size-10 animate-spin" />
    </div>
  );
};

export default Loader;
