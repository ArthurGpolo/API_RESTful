"use client";

import { createContext, useEffect, useState } from "react";
import api from "@/services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // CARREGAR USUÁRIO
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      const { token, user } = res.data;

      if (!token) {
        throw new Error("Token não retornado pelo backend");
      }

      localStorage.setItem("token", token);
      setUser(user);

      return res.data;
    } catch (err) {
      console.log("LOGIN ERROR STATUS:", err.response?.status);
      console.log("LOGIN ERROR DATA:", err.response?.data);

      throw err;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}