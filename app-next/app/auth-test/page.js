"use client";

import { useState } from "react";
import AuthModal from "@/components/Auth/AuthModal";
import AuthButton from "@/components/Auth/AuthButton";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthTestPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("login");
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading authentication...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Authentication Test Page</h1>

      <div
        style={{
          marginBottom: "20px",
          padding: "20px",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h2>Current Auth State:</h2>
        <p>
          <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
        </p>
        <p>
          <strong>Loading:</strong> {loading ? "Yes" : "No"}
        </p>
        {user && (
          <div>
            <p>
              <strong>User:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Auth Button Component:</h2>
        <AuthButton />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Test Modal:</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button
            onClick={() => {
              setModalMode("login");
              setShowModal(true);
            }}
            style={{
              padding: "10px 20px",
              background: "#0d47a1",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Test Login Modal
          </button>

          <button
            onClick={() => {
              setModalMode("register");
              setShowModal(true);
            }}
            style={{
              padding: "10px 20px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Test Register Modal
          </button>
        </div>
        <p style={{ fontSize: "14px", color: "#666" }}>
          The AuthButton component above has separate "Sign In" and "Sign Up"
          buttons that will open the appropriate form. Use the buttons above to
          test specific modal modes directly.
        </p>
      </div>

      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialMode={modalMode}
      />
    </div>
  );
}
