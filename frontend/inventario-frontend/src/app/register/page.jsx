"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function RegisterPage() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    
    const  handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, correo, contraseña, id_rol: 2 }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Error en el registro");
                return;
            }
            alert("Usuario registrado correctamente. Ahora inicia sesión.");
            router.push("/login");
        } catch (err) {
            setError("Error de conexion con el servidor");
        }
    };

    return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-600 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Crear cuenta
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Nombre</label>
          <input
            type="text"
            placeholder="Tu nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Correo</label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-2">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="********"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
        >
          Registrarse
        </button>

        <p className="text-sm text-gray-600 mt-6 text-center">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            className="text-green-600 hover:underline font-medium"
          >
            Inicia sesión aquí
          </a>
        </p>
      </form>
    </div>
    );
}