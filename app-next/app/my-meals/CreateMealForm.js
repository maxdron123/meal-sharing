"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";
import styles from "./CreateMealForm.module.css";

export default function CreateMealForm({
  onMealCreated,
  onCancel,
  showNotification,
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    max_reservations: "",
    location: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const maxSize = 800;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Get base64 string and remove data URL prefix for storage
        const base64String = canvas.toDataURL("image/jpeg", 0.8);
        const base64Data = base64String.split(',')[1]; // Remove data:image/jpeg;base64,

        if (base64String.length > 8 * 1024 * 1024) {
          setError(
            "Image is too large even after compression. Please use a smaller image."
          );
          return;
        }

        setFormData((prev) => ({
          ...prev,
          image: base64Data, // Store clean base64
        }));
        setImagePreview(base64String); // Show full data URL for preview
      };

      img.onerror = () => {
        setError("Failed to process image. Please try a different image.");
      };

      img.src = URL.createObjectURL(file);
      setError("");
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById("mealImage");
    if (fileInput) fileInput.value = "";
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Meal title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      setError("Please enter a valid price");
      return false;
    }
    if (
      !formData.max_reservations ||
      isNaN(formData.max_reservations) ||
      formData.max_reservations <= 0
    ) {
      setError("Please enter a valid number of maximum reservations");
      return false;
    }
    if (!formData.location.trim()) {
      setError("Country of origin is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        max_reservations: parseInt(formData.max_reservations),
        location: formData.location.trim(),
        image: formData.image,
        created_by: user.id,
        when: new Date().toISOString(),
      };

      const token = Cookies.get("auth-token");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/meals", {
        method: "POST",
        body: JSON.stringify(submitData),
        credentials: "include",
        headers: headers,
      });

      const data = await response.json();

      if (response.ok) {
        if (showNotification) {
          showNotification("Meal created successfully!", "success");
        }
        onMealCreated(data.meal);
      } else {
        console.error("Failed to create meal:", data);
        setError(data.message || "Failed to create meal");
      }
    } catch (error) {
      console.error("Network error creating meal:", error);
      setError("Network error. Please check your connection and try again.");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay} onClick={onCancel} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Create New Meal</h2>
          <button onClick={onCancel} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="title">Meal Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Homemade Italian Pasta Night"
              maxLength={100}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your meal, ingredients, cooking style, and what makes it special..."
              rows={4}
              maxLength={500}
              required
            />
            <div className={styles.charCount}>
              {formData.description.length}/500 characters
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price per person ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="max_reservations">Max Guests *</label>
              <input
                type="number"
                id="max_reservations"
                name="max_reservations"
                value={formData.max_reservations}
                onChange={handleInputChange}
                placeholder="8"
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Country of origin *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Italy, Mexico, Thailand"
              maxLength={200}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mealImage">Meal Image</label>
            <div className={styles.imageUpload}>
              {imagePreview ? (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Meal preview" />
                  <div className={styles.imageActions}>
                    <button
                      type="button"
                      onClick={removeImage}
                      className={styles.removeImageBtn}
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.imageUploadArea}>
                  <div className={styles.uploadIcon}>📷</div>
                  <p>Click to upload meal image</p>
                  <p className={styles.uploadHint}>JPG, PNG up to 5MB</p>
                </div>
              )}
              <input
                type="file"
                id="mealImage"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelBtn}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.spinner}></div>
                  Creating...
                </>
              ) : (
                "Create Meal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
