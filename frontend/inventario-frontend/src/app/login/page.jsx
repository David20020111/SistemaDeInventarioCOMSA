"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, contraseña }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Error en el login");
                return;
            }

            localStorage.setItem("token", data.token);

            router.push("/dashboard");
        } catch (err) {
            setError("Error de conexion con el servidor");
        }
    };

    return (
     <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #1C1C1C 0%, #A0A0A0 50%, #E50914 100%)",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-black/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src="/logoComsa.png"
            alt="Logo de la empresa"
            className="w-35 h-35 object-contain"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-center text-red-800 mb-6">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Correo</label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-2">Contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg text-white font-semibold transition duration-300"
          style={{
            backgroundColor: "#E50914",
          }}
        >
          Entrar
        </button>

        <p className="text-sm text-gray-600 mt-6 text-center">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-red-600 hover:underline font-medium">
            Regístrate aquí
          </a>
        </p>
      </form>
    </div>
    );
}