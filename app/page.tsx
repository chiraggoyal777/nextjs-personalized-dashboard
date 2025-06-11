"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/contexts/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getClientByEmail } from "@/lib/clients";
import { Codepen, Github, Linkedin } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      router.push("/dashboard");
    } else {
      setTheme("");
    }
  }, [router, setTheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const client = getClientByEmail(email);

    if (client && password === "password") {
      localStorage.setItem("currentUser", JSON.stringify(client));
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <div className="bg-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <span className="text-xl font-bold">Hi</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="text-gray-500">Sign in to your dashboard</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@orangecorp.com or admin@purpleind.com"
                className={`focus:ring-primary focus:border-primary bg-gray-0 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-1 focus:outline-none ${error ? "!border-danger !ring-danger" : ""}`}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className={`focus:ring-primary focus:border-primary bg-gray-0 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-1 focus:outline-none ${error ? "!border-danger !ring-danger" : ""}`}
                required
              />
            </div>

            {error && (
              <div className="text-danger text-center text-sm">{error}</div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="block w-full"
              brand
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo Credentials:</p>
            <p>Orange: admin@orangecorp.com</p>
            <p>Purple: admin@purpleind.com</p>
            <p>Password: password</p>
          </div>

          <hr className="mt-6 mb-4" />
          <div className="text-center flex justify-center text-gray-600">
            <a
              href="https://github.com/chiraggoyal777"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit my Github repo"
              className="shrink-0 block p-2 rounded-full hover:bg-primary/20 hover:text-primary transition-colors"
              title="Visit my Github repo"
            >
              <Github className="size-4" />
            </a>
            <a
              href="https://codepen.io/chiraggoyal777"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow me on Codepen"
              className="shrink-0 block p-2 rounded-full hover:bg-primary/20 hover:text-primary transition-colors"
              title="Follow me on Codepen"
            >
              <Codepen className="size-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/chiraggoyal777"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Let's connect on LinkedIn"
              className="shrink-0 block p-2 rounded-full hover:bg-primary/20 hover:text-primary transition-colors"
              title="Let's connect on LinkedIn"
            >
              <Linkedin className="size-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
