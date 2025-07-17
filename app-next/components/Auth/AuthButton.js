"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import "./AuthButton.css";

export default function AuthButton() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, loading } = useAuth();

  const handleLogin = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleRegister = () => {
    setAuthMode("register");
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (user) {
    return (
      <div className="user-menu">
        <button
          className="user-menu-trigger"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="user-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.firstName} />
            ) : (
              <span>
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
            )}
          </div>
          <span className="user-name">{user.firstName}</span>
          <svg
            className={`chevron ${showUserMenu ? "open" : ""}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </button>

        {showUserMenu && (
          <>
            <div
              className="menu-overlay"
              onClick={() => setShowUserMenu(false)}
            />
            <div className="user-menu-dropdown">
              <div className="menu-header">
                <div className="menu-avatar">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.firstName} />
                  ) : (
                    <span>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </span>
                  )}
                </div>
                <div className="menu-user-info">
                  <div className="menu-user-name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="menu-user-email">{user.email}</div>
                </div>
              </div>

              <div className="menu-divider" />

              <div className="menu-items">
                <a href="/profile" className="menu-item">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path
                      fill="currentColor"
                      d="M8 8a3 3 0 100-6 3 3 0 000 6zM8 9a5 5 0 00-5 5v1a1 1 0 001 1h8a1 1 0 001-1v-1a5 5 0 00-5-5z"
                    />
                  </svg>
                  My Profile
                </a>

                <a href="/my-meals" className="menu-item">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path
                      fill="currentColor"
                      d="M2 3a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm0 5a1 1 0 011-1h10a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1V8z"
                    />
                  </svg>
                  My Meals
                </a>

                <a href="/my-reservations" className="menu-item">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path
                      fill="currentColor"
                      d="M1 3a1 1 0 011-1h12a1 1 0 011 1v9a1 1 0 01-1 1H2a1 1 0 01-1-1V3zm2 1v7h10V4H3z"
                    />
                  </svg>
                  My Reservations
                </a>

                <a href="/my-reviews" className="menu-item">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path
                      fill="currentColor"
                      d="M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z"
                    />
                  </svg>
                  My Reviews
                </a>
              </div>

              <div className="menu-divider" />

              <button onClick={handleLogout} className="menu-item sign-out">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path
                    fill="currentColor"
                    d="M6 1a1 1 0 00-1 1v2H3a1 1 0 000 2h2v6H3a1 1 0 100 2h2v2a1 1 0 001 1h2a1 1 0 001-1V2a1 1 0 00-1-1H6zm4 4l3 3-3 3v-2H9V7h1V5z"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="auth-buttons">
      <button onClick={handleLogin} className="auth-btn login-btn">
        Sign In
      </button>
      <button onClick={handleRegister} className="auth-btn register-btn">
        Sign Up
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
}
