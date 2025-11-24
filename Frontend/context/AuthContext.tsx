"use client";

import { createContext, useContext, useState } from "react";

interface User {
  id: number;
  nombre: string;
  usuario: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 1️⃣ Cargar usuario desde localStorage al iniciar
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  // 2️⃣ Guardar usuario en estado y localStorage al hacer login
  const login = (data: User) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  // 3️⃣ Cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/"; // redirige al login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
