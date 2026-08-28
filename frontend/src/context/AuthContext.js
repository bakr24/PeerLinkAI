"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MOCKED: real flow would validate a token with the backend on load
    const stored = localStorage.getItem("peerlinkai_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  function login({ name, email, role }) {
    // MOCKED: real flow calls POST /auth/login and stores a real token
    const mockUser = { name, email, role };
    setUser(mockUser);
    localStorage.setItem("peerlinkai_user", JSON.stringify(mockUser));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("peerlinkai_user");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}