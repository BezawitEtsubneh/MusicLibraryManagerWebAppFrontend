'use client'

import React, { useState, useEffect } from "react";
import SignupForm from "./signup/signupForm"; // ✅ Use form component
import LoginForm from "./login/loginForm";     // ✅ Use form component
import Home from "./home/page";
import { getCurrentUser, User } from "../lib/api";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  // Check current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle login/signup completion
  const handleLogin = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );

  if (user) return <Home />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      {showSignup ? (
        <>
          {/* ✅ Use SignupForm with onSuccess callback */}
          <SignupForm onSuccess={handleLogin} />
          <button
            className="text-blue-500 underline"
            onClick={() => setShowSignup(false)}
          >
            Already have an account? Login
          </button>
        </>
      ) : (
        <>
          {/* ✅ Use LoginForm with onSuccess callback */}
          <LoginForm onSuccess={handleLogin} />
          <button
            className="text-blue-500 underline"
            onClick={() => setShowSignup(true)}
          >
            Don't have an account? Sign up
          </button>
        </>
      )}
    </div>
  );
}
