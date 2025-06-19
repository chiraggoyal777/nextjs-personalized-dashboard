import { Button } from "@/components/ui/Button";
import { Codepen, Github, Linkedin } from "lucide-react";
import React from "react";

interface Props {
  showUsername?: boolean;
}
const OwnerInfo = ({ showUsername = false }: Props) => {
  return (
    <footer className="bg-background w-full py-4 text-gray-600 dark:text-gray-800">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 sm:flex-row sm:px-6 lg:px-8">
        {showUsername && (
          <>
            <p className="text-sm opacity-80">&copy; chiraggoyal777</p>
            <span className="hidden px-4 opacity-30 sm:block">|</span>
          </>
        )}
        <div className="mt-2 flex sm:mt-0">
          <Button
            color="accent"
            variant="fill"
            size="sm"
            href="https://github.com/chiraggoyal777"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my Github repo"
            title="Visit my Github repo"
            startIcon={<Github />}
            roundedFull
            asAnchor
          />

          <Button
            color="accent"
            variant="fill"
            size="sm"
            href="https://codepen.io/chiraggoyal777"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow me on Codepen"
            title="Follow me on Codepen"
            startIcon={<Codepen />}
            roundedFull
            asAnchor
          />

          <Button
            color="accent"
            variant="fill"
            size="sm"
            href="https://www.linkedin.com/in/chiraggoyal777"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Let's connect on LinkedIn"
            title="Let's connect on LinkedIn"
            startIcon={<Linkedin />}
            roundedFull
            asAnchor
          />
        </div>
      </div>
    </footer>
  );
};

export default OwnerInfo;
