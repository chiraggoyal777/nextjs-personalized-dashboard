"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Client } from "@/types/client";
import { useTheme } from "@/components/contexts/ThemeProvider";
import Loader from "@/components/ui/Loader";

interface ClientContextType {
  client: Client;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // current path user is on
  const [client, setClient] = useState<Client | null>(null);
  const { theme, setTheme, allThemes } = useTheme();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      // If already on root page, no need to append refFrom
      const redirectPath = pathname !== "/" ? `/?refFrom=${encodeURIComponent(pathname)}` : "/";
      router.push(redirectPath);
      return;
    }

    const userData = JSON.parse(currentUser) as Client;
    setClient(userData);

    const foundTheme = allThemes.find((theme) => theme.id === userData.themeId) || null;
    // Apply client theme
    if (theme?.id !== foundTheme?.id) setTheme(foundTheme);
  }, [pathname, router]);

  if (!client) return <Loader />;

  return <ClientContext.Provider value={{ client }}>{children}</ClientContext.Provider>;
}

export function useClient() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
}
