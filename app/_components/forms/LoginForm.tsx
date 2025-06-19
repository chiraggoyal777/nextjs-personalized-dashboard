"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import { getClientByEmail } from "@/lib/clients";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refFrom = searchParams.get("refFrom"); // Get refFrom param
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();
    setLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const client = getClientByEmail(email);

    if (client && password === "nW7jK39bPqZ") {
      localStorage.setItem("currentUser", JSON.stringify(client));

      // Redirect to original intended path if exists, else /dashboard
      const target = refFrom && refFrom !== "/" ? refFrom : "/dashboard";
      router.push(target);
      toast.success("Authenticated!");
    } else {
      setError("Invalid credentials");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=""
          className={`${error ? "!border-danger !ring-danger" : ""}`}
          required
          autoComplete="email"
        />
      </div>

      <div>
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder=""
          className={`${error ? "!border-danger !ring-danger" : ""}`}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="flex w-full"
        startIcon={loading ? <Loader className="animate-spin" /> : undefined}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      {error && <div className="text-danger text-center text-sm">{error}</div>}
    </form>
  );
};

export default LoginForm;
