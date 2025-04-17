"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyBpTMR6L4z7ktx9rnAa7DM0F5gxi2eVvs8",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "wanni-ma-2e5fe.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "wanni-ma-2e5fe",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "wanni-ma-2e5fe.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "582052269799",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:582052269799:web:c2ada9107bc78ae421dc42",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-9M3HWVQGEN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Define schema for validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Use Firebase to send password reset email
      await sendPasswordResetEmail(auth, values.email);

      // Show success message
      setSuccessMessage("Password reset email sent! Please check your inbox.");
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(
        error?.message ||
          "Failed to send password reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 bg-[#F3F5F7]">
        <img
          src="/assets/signup.png"
          alt="Forgot Password"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center overflow-y-auto">
        <div className="w-full max-w-[456px] mx-auto px-6 py-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-medium text-[#141718] leading-tight tracking-[-0.01em]">
              Reset Your Password
            </h1>
            <p className="text-sm md:text-base text-[#6C7275]">
              Enter your email address and we'll send you a link to reset your
              password.
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
                    placeholder="Your email address"
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
              </div>

              {/* Reset password button */}
              <Button
                type="submit"
                className="w-full bg-[#141718] text-white font-medium py-2 md:py-3 px-10 rounded-lg hover:bg-[#2a2c2d] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Reset Password"}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm md:text-base text-[#141718] hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
