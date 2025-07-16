"use client";

import AuthModal from "@/components/Auth/AuthModal";
import { useState } from "react";

export default function ModalTestPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: "50px" }}>
      <h1>Modal Test Page</h1>

      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "15px 30px",
          background: "#0d47a1",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Open Auth Modal
      </button>

      <div style={{ marginTop: "20px" }}>
        <p>Modal state: {isOpen ? "OPEN" : "CLOSED"}</p>
      </div>

      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialMode="login"
      />
    </div>
  );
}
