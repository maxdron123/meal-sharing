import { NextResponse } from "next/server";
import { verifyPassword, generateToken, validateEmail } from "@/utils/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/email/${email}`
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = await userResponse.json();

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json(
        { message: "Account is deactivated. Please contact support." },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}/login`,
      {
        method: "PUT",
      }
    );

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      type: "access",
    });

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        profileImage: user.profile_image,
        emailVerified: user.email_verified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
