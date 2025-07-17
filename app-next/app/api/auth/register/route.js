import { NextResponse } from "next/server";
import {
  hashPassword,
  validatePassword,
  validateEmail,
  generateToken,
} from "@/utils/auth";

export async function POST(request) {
  try {
    const { email, password, firstName, lastName, phoneNumber } =
      await request.json();

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: "Email, password, first name, and last name are required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          message: "Password validation failed",
          errors: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    // Check if user already exists
    const checkUserResponse = await fetch(
      `${backendUrl}/api/users/email/${email}`
    );

    if (checkUserResponse.ok) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const createUserPayload = {
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber || null,
      email_verified: false,
      is_active: true,
    };

    const createUserResponse = await fetch(`${backendUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createUserPayload),
    });

    if (!createUserResponse.ok) {
      const responseText = await createUserResponse.text();

      let errorMessage = "Failed to create user";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `Server error: ${createUserResponse.status}`;
      }

      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }

    const newUser = await createUserResponse.json();

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      type: "access",
    });

    return NextResponse.json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        phoneNumber: newUser.phone_number,
        profileImage: newUser.profile_image,
        emailVerified: newUser.email_verified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
