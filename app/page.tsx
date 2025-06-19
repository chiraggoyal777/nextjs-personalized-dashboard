"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/contexts/ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import DemoCredentials from "@/components/widgets/DemoCredentials";
import OwnerInfo from "@/components/widgets/OwnerInfo";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      router.push("/dashboard");
    } else {
      setTheme(null, false);
    }
  }, [router, setTheme]);

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
          <LoginForm />
          <DemoCredentials />
          <hr className="mt-6 mb-4" />
          <OwnerInfo />
        </CardContent>
      </Card>
    </div>
  );
}
