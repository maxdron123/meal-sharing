import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

// Configure API route for large payloads (Base64 images) - Next.js 14 format
export const maxDuration = 30;
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    let token = request.cookies.get("auth-token")?.value;

    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const data = await request.json();

    const {
      title,
      description,
      price,
      max_reservations,
      location,
      image,
      created_by,
      when,
    } = data;

    if (!title || !description || !price || !max_reservations || !location) {
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { message: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    if (max_reservations <= 0 || max_reservations > 50) {
      return NextResponse.json(
        { message: "Maximum reservations must be between 1 and 50" },
        { status: 400 }
      );
    }

    // Validate Base64 image if provided
    if (image && !image.startsWith("data:image/")) {
      return NextResponse.json(
        { message: "Invalid image format" },
        { status: 400 }
      );
    }

    const mealData = {
      title: title.trim(),
      description: description.trim(),
      price: price,
      max_reservations: max_reservations,
      location: location.trim(),
      when: when || new Date().toISOString(),
      created_date: new Date().toISOString().split("T")[0],
      image: image,
      created_by: created_by || decoded.userId,
    };

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    // Try with authentication first
    let backendResponse = await fetch(`${backendUrl}/api/meals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mealData),
    });

    // If authentication fails, try without it
    if (backendResponse.status === 401 || backendResponse.status === 403) {
      backendResponse = await fetch(`${backendUrl}/api/meals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealData),
      });
    }

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      let errorMessage = "Failed to create meal";

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `Server error: ${backendResponse.status} - ${errorText}`;
      }

      return NextResponse.json(
        { message: errorMessage },
        { status: backendResponse.status }
      );
    }

    const newMeal = await backendResponse.json();

    return NextResponse.json({
      message: "Meal created successfully",
      meal: newMeal,
    });
  } catch (error) {
    console.error("Error creating meal:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Verify authentication - try both cookie and header approaches
    let token = request.cookies.get("auth-token")?.value;

    // If no cookie, try Authorization header
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Get user's meals from backend database
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const backendResponse = await fetch(
      `${backendUrl}/api/meals/user/${decoded.userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch meals" },
        { status: backendResponse.status }
      );
    }

    const meals = await backendResponse.json();
    return NextResponse.json(meals);
  } catch (error) {
    console.error("Error fetching user meals:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
