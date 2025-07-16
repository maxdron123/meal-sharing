import { NextResponse } from "next/server";
import { verifyToken, extractTokenFromHeader } from "@/utils/auth";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user data
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3001";
    const userResponse = await fetch(
      `${backendUrl}/api/users/${decoded.userId}`
    );

    if (!userResponse.ok) {
      console.log("User lookup failed:", userResponse.status);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = await userResponse.json();

    // Check if user is still active
    if (!user.is_active) {
      return NextResponse.json(
        { message: "Account is deactivated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      profileImage: user.profile_image,
      emailVerified: user.email_verified,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
