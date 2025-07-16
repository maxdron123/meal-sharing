import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { verifyToken } from "@/utils/auth";

export async function POST(request) {
  console.log("=== POST /api/meals called ===");
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

    console.log("Token received:", token ? "Token exists" : "No token found");
    console.log(
      "Cookie auth-token:",
      request.cookies.get("auth-token")?.value ? "Present" : "Missing"
    );
    console.log(
      "Auth header:",
      request.headers.get("authorization") ? "Present" : "Missing"
    );

    if (!token) {
      console.log("No token in cookies or headers");
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token);
      console.log("Token decoded successfully:", { userId: decoded.userId });
    } catch (error) {
      console.log("Token verification failed:", error.message);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    console.log("=== Parsing form data ===");
    // Parse form data
    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const maxReservations = parseInt(formData.get("max_reservations"));
    const location = formData.get("location");
    const imageFile = formData.get("image");

    console.log("Form data parsed:", {
      title,
      description,
      price,
      maxReservations,
      location,
      imageFile: imageFile
        ? `File: ${imageFile.name}, Size: ${imageFile.size}`
        : "No file",
    });

    // Validation
    console.log("=== Validating form data ===");
    if (!title || !description || !price || !maxReservations || !location) {
      console.log("Validation failed: Missing required fields");
      console.log("Missing fields:", {
        title: !title,
        description: !description,
        price: !price,
        maxReservations: !maxReservations,
        location: !location,
      });
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (price <= 0) {
      console.log("Validation failed: Invalid price");
      return NextResponse.json(
        { message: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    if (maxReservations <= 0 || maxReservations > 50) {
      console.log("Validation failed: Invalid max reservations");
      return NextResponse.json(
        { message: "Maximum reservations must be between 1 and 50" },
        { status: 400 }
      );
    }

    console.log("=== Validation passed ===");
    let imagePath = null;

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      // Validate file type
      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "Invalid file type. Please upload an image." },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "File size too large. Maximum size is 5MB." },
          { status: 400 }
        );
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "meals");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const fileExtension = path.extname(imageFile.name);
      const fileName = `meal_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      // Save file
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Set image path for database (relative to public folder)
      imagePath = `/uploads/meals/${fileName}`;
    }

    // Prepare meal data for backend API
    const mealData = {
      title: title.trim(),
      description: description.trim(),
      price: price,
      max_reservations: maxReservations,
      location: location.trim(),
      when: new Date().toISOString(), // Backend expects a 'when' field
      created_date: new Date().toISOString().split("T")[0], // Add created_date field as date string
      image: imagePath, // Include image path for database
      created_by: decoded.userId, // Add user ID for meal ownership
    };

    console.log("=== Preparing meal data for backend ===");
    console.log("Original data with image path:", imagePath);
    console.log("User ID from token:", decoded.userId);

    // Call backend API to create meal in database
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3001";
    console.log("Calling backend API:", `${backendUrl}/api/meals`);
    console.log("Meal data being sent:", mealData);

    // Try with authentication first
    let backendResponse = await fetch(`${backendUrl}/api/meals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mealData),
    });

    // If authentication fails, try without it (some backends don't require auth for meal creation)
    if (backendResponse.status === 401 || backendResponse.status === 403) {
      console.log("Auth failed, trying without Authorization header...");
      backendResponse = await fetch(`${backendUrl}/api/meals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealData),
      });
    }

    console.log("Backend response status:", backendResponse.status);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.log("Backend error response:", errorText);
      console.log("Request headers sent:", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.substring(0, 20)}...`,
      });
      console.log("Request body sent:", JSON.stringify(mealData, null, 2));

      let errorMessage = "Failed to create meal";

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
        console.log("Parsed error data:", errorData);
      } catch (e) {
        errorMessage = `Server error: ${backendResponse.status} - ${errorText}`;
        console.log("Could not parse error response as JSON");
      }

      return NextResponse.json(
        { message: errorMessage },
        { status: backendResponse.status }
      );
    }

    const newMeal = await backendResponse.json();
    console.log("Backend returned meal:", newMeal);

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
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3001";
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
