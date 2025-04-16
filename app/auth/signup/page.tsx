"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreeToTerms: z.boolean().refine((value) => value === true, {
    message: "You must agree to the Privacy Policy and Terms of Use",
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Send registration request to our API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Registration successful, redirect to login page
      router.push("/auth/login?registered=true");
    } catch (error) {
      console.error("Registration failed", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image and Logo */}
      <div className="hidden w-1/2 bg-[#F3F5F7] lg:flex flex-col items-center justify-center relative">
        <div className="absolute top-10 left-10">
          <h1 className="font-medium text-2xl">3legant.</h1>
        </div>
        <div className="w-full h-full">
          <Image
            src="/assets/signup.png"
            alt="Sign up background"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 xl:px-24">
        <div className="max-w-[456px] mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-medium text-[#141718] mb-4">
              Sign up
            </h1>
            <p className="text-base text-[#6C7275]">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#141718] underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-3 mb-6 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <div className="border-b border-[#E8ECEF]">
                <Input
                  id="name"
                  placeholder="Your name"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base py-2 px-0 text-[#6C7275]"
                  {...form.register("name")}
                  disabled={isLoading}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="border-b border-[#E8ECEF]">
                <Input
                  id="username"
                  placeholder="Username"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base py-2 px-0 text-[#6C7275]"
                  {...form.register("username")}
                  disabled={isLoading}
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="border-b border-[#E8ECEF]">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base py-2 px-0 text-[#6C7275]"
                  {...form.register("email")}
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="border-b border-[#E8ECEF] relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base py-2 px-0 text-[#6C7275] pr-10"
                  {...form.register("password")}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.9 4.24002C10.5883 4.0789 11.2931 3.99834 12 4.00003C19 4.00003 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.572 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2219 9.18488 10.8539C9.34884 10.4859 9.58525 10.1547 9.88 9.88003M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06003L17.94 17.94Z"
                        stroke="#6C7275"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 1L23 23"
                        stroke="#6C7275"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                        stroke="#6C7275"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                        stroke="#6C7275"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  className="h-5 w-5 rounded border-[#6C7275] text-[#141718] focus:ring-0"
                  {...form.register("agreeToTerms")}
                  disabled={isLoading}
                />
              </div>
              <label
                htmlFor="agreeToTerms"
                className="text-base text-[#6C7275]"
              >
                I agree with{" "}
                <span className="text-[#141718]">Privacy Policy</span> and{" "}
                <span className="text-[#141718]">Terms of Use</span>
              </label>
            </div>
            {form.formState.errors.agreeToTerms && (
              <p className="text-sm text-red-500 -mt-4">
                {form.formState.errors.agreeToTerms.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-[#141718] hover:bg-[#2A2C2D] text-white rounded-lg py-2 px-10 text-base font-medium h-auto"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Sign Up"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
