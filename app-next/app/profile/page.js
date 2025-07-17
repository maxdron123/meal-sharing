"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Access Denied</h2>
          <p>Please log in to view your profile</p>
          <Link href="/" className={styles.homeLink}>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={`${user.firstName} ${user.lastName}`}
              />
            ) : (
              <span className={styles.avatarText}>
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
            )}
          </div>
          <div className={styles.avatarInfo}>
            <h2>
              {user.firstName} {user.lastName}
            </h2>
            <p className={styles.email}>{user.email}</p>
            <div className={styles.badges}>
              {user.emailVerified && (
                <span className={styles.badge}>✓ Email Verified</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.sectionHeader}>
            <h3>Personal Information</h3>
            <button
              className={styles.editBtn}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={user.email}
                disabled
                className={`${styles.input} ${styles.disabled}`}
              />
              <small className={styles.helpText}>Email cannot be changed</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={styles.input}
                placeholder="Enter your phone number"
              />
            </div>

            {isEditing && (
              <div className={styles.formActions}>
                <button className={styles.saveBtn} onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <div className={styles.actionGrid}>
          <Link href="/my-reservations" className={styles.actionCard}>
            <div className={styles.actionIcon}>📅</div>
            <h4>My Reservations</h4>
            <p>View and manage your meal bookings</p>
          </Link>

          <Link href="/my-reviews" className={styles.actionCard}>
            <div className={styles.actionIcon}>⭐</div>
            <h4>My Reviews</h4>
            <p>See all your meal reviews</p>
          </Link>

          <Link href="/my-meals" className={styles.actionCard}>
            <div className={styles.actionIcon}>🍽️</div>
            <h4>My Meals</h4>
            <p>Manage your meal offerings</p>
          </Link>

          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>🔒</div>
            <h4>Change Password</h4>
            <p>Update your account security</p>
          </div>
        </div>
      </div>
    </div>
  );
}
