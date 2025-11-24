"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // <<< OK

export default function LoginPage() {
  const { login } = useAuth(); // <<< CAMBIO AQUÍ
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      // 🔥 USAR login() DEL CONTEXTO
      login({
        id: data.user.id,
        nombre: data.user.nombre,
        usuario: data.user.usuario,
      });

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/30">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/Logo.png"
              alt="Logo de la empresa"
              className="h-20 w-auto transition-transform hover:scale-105"
            />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-semibold text-gray-700"
              >
                Usuario
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-xl"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 font-medium text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-white/70">
          <p>© 2025 Sistema de Facturación. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
