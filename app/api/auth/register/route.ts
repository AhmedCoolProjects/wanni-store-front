import { NextResponse } from "next/server";
import { z } from "zod";

// Define schema for validation
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  firebaseIdToken: z.string({
    required_error: "Firebase ID token is required",
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Register request body:", body);

    // Validate the request body against our schema
    const validatedData = registerSchema.parse(body);

    // Forward the registration to our backend API
    const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`;
    console.log("Calling backend API at:", apiEndpoint);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: validatedData.name,
          username: validatedData.username,
          email: validatedData.email,
          firebaseIdToken: validatedData.firebaseIdToken,
        }),
      });

      console.log("Backend response status:", response.status);
      const data = await response.json();
      console.log("Backend response data:", data);

      if (!response.ok) {
        return NextResponse.json(
          { success: false, message: data.message || "Registration failed" },
          { status: response.status }
        );
      }

      return NextResponse.json(
        {
          success: true,
          user: data.user,
          token: data.token,
        },
        { status: 201 }
      );
    } catch (fetchError) {
      console.error("Error connecting to backend:", fetchError);
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to connect to authentication server. Please try again later.",
          error: fetchError.message
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
