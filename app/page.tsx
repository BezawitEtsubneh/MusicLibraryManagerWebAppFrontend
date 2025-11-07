'use client'
import React, { useState, useEffect } from "react";
import Signup from "./signup/page";
import Login from "./login/page";
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

  // Handle login completion
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
          <Signup onSuccess={handleLogin} />
          <button
            className="text-blue-500 underline"
            onClick={() => setShowSignup(false)}
          >
            Already have an account? Login
          </button>
        </>
      ) : (
        <>
          <Login onLogin={handleLogin} />
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
