import { NextResponse } from "next/server";
import { z } from "zod";

// Define schema for validation requiring Firebase token
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  firebaseIdToken: z.string({
    required_error: "Firebase ID token is required",
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body against our schema
    const validatedData = loginSchema.parse(body);

    let apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

    // Forward the request to your backend API with Firebase token only
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: validatedData.email,
        firebaseIdToken: validatedData.firebaseIdToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Authentication failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: data.user,
        token: data.token,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 401 }
    );
  }
}
