"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthModal.css";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Update mode when initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, mode]);

  if (!mounted || !isOpen) {
    console.log("Modal not rendering - mounted:", mounted, "isOpen:", isOpen);
    return null;
  }

  console.log("Modal rendering with mode:", mode);

  const handleOverlayClick = (e) => {
    console.log("Overlay clicked");
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal-content">
        <button
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {mode === "login" ? (
          <LoginForm
            onSwitchToRegister={() => setMode("register")}
            onClose={onClose}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setMode("login")}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
