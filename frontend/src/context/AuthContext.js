"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hasTakenQuiz, setHasTakenQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // MOCKED: real flow would validate a token with the backend on load
    const storedUser = localStorage.getItem("peerlinkai_user");
    const storedQuiz = localStorage.getItem("peerlinkai_quiz_taken");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedQuiz === "true") {
      setHasTakenQuiz(true);
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
    setHasTakenQuiz(false);
    localStorage.removeItem("peerlinkai_user");
    localStorage.removeItem("peerlinkai_quiz_taken");
    router.push("/"); // <--- Instantly redirects user back to the public home page
  }

  function completeQuiz() {
    setHasTakenQuiz(true);
    localStorage.setItem("peerlinkai_quiz_taken", "true");
  }

  return (
    <AuthContext.Provider value={{ user, loading, hasTakenQuiz, login, logout, completeQuiz }}>
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