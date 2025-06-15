"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Codepen, Github, Linkedin, WandSparkles, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ClientProvider } from "@/components/contexts/ClientProvider";
import ClientInfo from "@/components/ui/ClientInfo";
import AuthNavbar from "@/components/ui/AuthNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [showMoreFeaturesInfo, setShowMoreFeaturesInfo] = useState(false);
  const moreFeaturesInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showMoreFeaturesInfo && moreFeaturesInfoRef.current) {
      const offset = 100;
      const element = moreFeaturesInfoRef.current;
      const rect = element.getBoundingClientRect();

      const isFullyVisible = rect.top >= offset && rect.bottom <= window.innerHeight;

      if (!isFullyVisible) {
        const elementTop = rect.top + window.scrollY;

        window.scrollTo({
          top: elementTop - offset,
          behavior: "smooth",
        });
      }
    }
  }, [showMoreFeaturesInfo]);

  return (
    <ClientProvider>
      <div className="min-h-screen">
        {/* Navbar */}
        <AuthNavbar
          isShowMoreFeaturesVisible={showMoreFeaturesInfo}
          onShowMoreFeaturesClick={() => setShowMoreFeaturesInfo(true)}
        />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <ClientInfo />

          {/* Theme Customizer */}
          {showMoreFeaturesInfo && (
            <div
              className="relative mb-8"
              ref={moreFeaturesInfoRef}
            >
              <div className="absolute -top-2 -right-2 w-max">
                <Button
                  className="!bg-gray-0 !text-theme-accent !border-theme-accent !ring-theme-accent/20 !rounded-full !border-4 !p-1"
                  onClick={() => setShowMoreFeaturesInfo(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="from-theme-primary to-theme-accent rounded-xl bg-gradient-to-r p-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-theme-primary">
                      <WandSparkles className="mr-2 inline size-[1em] align-bottom" />
                      <span className="from-theme-primary to-theme-accent bg-gradient-to-r bg-clip-text text-transparent">More features (Coming Soon)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600">Explore the current features — and get ready for the upcoming ones, including:</p>
                    <ul className="list-inside list-disc space-y-1 text-gray-600">
                      <li>More themes & pages</li>
                      <li>Layout preferences</li>
                      <li>Personalized widgets</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          {children}
        </div>

        <footer className="bg-background pt-4 pb-10 text-gray-600 dark:text-gray-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-sm opacity-80">&copy; chiraggoyal777</p>
            <span className="hidden px-4 opacity-30 sm:block">|</span>
            <div className="mt-2 flex sm:mt-0">
              <a
                href="https://github.com/chiraggoyal777"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit my Github repo"
                className="hover:bg-theme-primary/20 hover:text-theme-primary block shrink-0 rounded-full p-2 transition-colors"
                title="Visit my Github repo"
              >
                <Github className="size-4" />
              </a>
              <a
                href="https://codepen.io/chiraggoyal777"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow me on Codepen"
                className="hover:bg-theme-primary/20 hover:text-theme-primary block shrink-0 rounded-full p-2 transition-colors"
                title="Follow me on Codepen"
              >
                <Codepen className="size-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/chiraggoyal777"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Let's connect on LinkedIn"
                className="hover:bg-theme-primary/20 hover:text-theme-primary block shrink-0 rounded-full p-2 transition-colors"
                title="Let's connect on LinkedIn"
              >
                <Linkedin className="size-4" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </ClientProvider>
  );
}
