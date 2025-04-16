import { NextResponse } from "next/server";
import { z } from "zod";

// Define schema for validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body against our schema
    const validatedData = loginSchema.parse(body);

    // Here you would typically:
    // 1. Check if user exists
    // 2. Compare password hash
    // 3. Create a session or token

    // For now, we'll just simulate a successful login
    // In a real app, you would verify credentials against a database

    // Mock authentication - in real app, replace with actual auth
    const mockUser = {
      id: "user_123456789",
      email: validatedData.email,
      name: "John Doe",
    };

    return NextResponse.json(
      {
        success: true,
        user: mockUser,
        token: "mock_jwt_token_" + Math.random().toString(36).substring(2, 15),
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
