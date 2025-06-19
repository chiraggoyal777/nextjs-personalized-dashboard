"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { WandSparkles, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ClientProvider } from "@/components/contexts/ClientProvider";
import ClientInfo from "@/components/widgets/ClientInfo";
import AuthNavbar from "@/components/layouts/AuthNavbar";
import OwnerInfo from "@/components/widgets/OwnerInfo";

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
      <div className="flex min-h-screen flex-col">
        {/* Navbar */}
        <AuthNavbar
          isShowMoreFeaturesVisible={showMoreFeaturesInfo}
          onShowMoreFeaturesClick={() => setShowMoreFeaturesInfo(true)}
        />
        <div className="mx-auto w-full max-w-7xl grow px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <ClientInfo />

          {/* Theme Customizer */}
          {showMoreFeaturesInfo && (
            <div
              className="relative mb-8"
              ref={moreFeaturesInfoRef}
            >
              <div className="absolute -top-3 -right-3 w-max">
                <Button
                  color="accent"
                  size="sm"
                  onClick={() => setShowMoreFeaturesInfo(false)}
                  startIcon={<X />}
                  roundedFull
                />
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

        <OwnerInfo showUsername />

        <div className="pb-10"></div>
      </div>
    </ClientProvider>
  );
}
