import { NextResponse } from "next/server";
import { z } from "zod";

// Define schema for validation
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body against our schema
    const validatedData = registerSchema.parse(body);

    // Here you would typically:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Store user in database
    // 4. Create a session or token

    // For now, we'll just simulate a successful registration
    return NextResponse.json(
      {
        success: true,
        user: {
          id: "user_" + Math.random().toString(36).substring(2, 9),
          name: validatedData.name,
          email: validatedData.email,
          // Don't return password, even hashed ones
        },
      },
      { status: 201 }
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
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
