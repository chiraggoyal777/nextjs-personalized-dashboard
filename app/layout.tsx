import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/contexts/ThemeProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personalized Dashboard Demo",
  description: "An interactive demo showcasing a customizable dashboard with dynamic theming. Easily switch themes and preview real-time UI changes with the built-in theme customizer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <Toaster
          position="bottom-left"
          toastOptions={{
            // Default theme styles for all toasts
            style: {
              background: "var(--color-theme-primary, var(--color-primary))",
              color: "var(--color-theme-primary-contrast, var(--color-primary-contrast))",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
              border: "none",
            },
            duration: 4000,

            // Override for specific types
            success: {
              style: {
                background: "var(--color-success)", // green
                color: "white",
              },
            },
            error: {
              style: {
                background: "var(--color-danger)", // red
                color: "white",
              },
            },
          }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
