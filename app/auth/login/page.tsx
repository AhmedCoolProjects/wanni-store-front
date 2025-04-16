"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import GithubIcon from "@/components/icons/github-icon";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user just registered
    const registered = searchParams.get("registered");
    if (registered === "true") {
      setSuccessMessage(
        "Registration successful! Please log in with your new account."
      );
    }
  }, [searchParams]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Send login request to our API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Login successful - store token in local storage
      localStorage.setItem("authToken", data.token);

      // Redirect to dashboard or home page
      router.push("/");
    } catch (error) {
      console.error("Login failed", error);
      setError(
        error instanceof Error ? error.message : "Invalid email or password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 bg-[#F3F5F7]">
        <img
          src="/assets/signup.png"
          alt="Sign In"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center overflow-y-auto">
        <div className="w-full max-w-[456px] mx-auto px-6 py-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-medium text-[#141718] leading-tight tracking-[-0.01em]">
              Sign In
            </h1>
            <p className="text-sm md:text-base text-[#6C7275]">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/auth/signup"
                className="text-[#141718] font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* Form */}
          <div className="mt-6">
            {successMessage && (
              <div className="p-2 mb-4 bg-green-50 border border-green-200 rounded-md text-green-600 text-xs md:text-sm">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="p-2 mb-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs md:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-4">
                {/* Email field */}
                <div className="border-b border-[#E8ECEF] pb-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your username or email address"
                    className="border-none text-sm md:text-base text-[#6C7275] px-0 focus-visible:ring-0"
                    {...form.register("email")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs md:text-sm text-red-500 mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password field with toggle */}
                <div className="border-b border-[#E8ECEF] pb-1">
                  <div className="flex items-center">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="border-none text-sm md:text-base text-[#6C7275] px-0 focus-visible:ring-0"
                      {...form.register("password")}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-[#6C7275] focus:outline-none"
                    >
                      <Eye className="h-4 w-4 md:h-5 md:w-5 stroke-[1.5px]" />
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-xs md:text-sm text-red-500 mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    className="border-[#6C7275] rounded-sm h-3 w-3 md:h-4 md:w-4"
                    {...form.register("rememberMe")}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm md:text-base text-[#6C7275] font-normal cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm md:text-base text-[#141718] font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign in button */}
              <Button
                type="submit"
                className="w-full bg-[#141718] text-white font-medium py-2 md:py-3 px-10 rounded-lg hover:bg-[#2a2c2d] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
