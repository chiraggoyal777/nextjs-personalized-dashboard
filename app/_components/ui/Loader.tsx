import { Loader as LoaderIcon } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <LoaderIcon className="size-10 animate-spin" />
    </div>
  );
};

export default Loader;
