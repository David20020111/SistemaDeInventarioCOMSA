"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [idRol, setIdRol] = useState("");
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
      const fetchRoles = async () => {
        try {
          const res = await fetch("http://localhost:3000/roles");
          const data = await res.json();
          setRoles(data);
        } catch (err) {
          console.error("Error al cargar los roles:" , err);
        }
      };

      fetchRoles();
    }, []);
    
    const handleRegister = async (e) => {
      e.preventDefault();
      setError(""); 

      if(!idRol) {
        setError("Selecciona un rol antes de continuar");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ nombre, correo, contraseña, id_rol: idRol }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Error en el registro");
          return;
        }

        alert("Usuario registrado correctamente. Ahora inicia sesión");
        router.push("/login");
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
        onSubmit={handleRegister}
        className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* LOGO DE LA EMPRESA */}
        <div className="flex justify-center mb-6">
          <img
            src="/agregar-usuario.png"
            alt="Logo de la empresa"
            className="w-24 h-24 object-contain"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Crear cuenta
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        {/* NOMBRE */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Nombre</label>
          <input
            type="text"
            placeholder="Tu nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* CORREO */}
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

        {/* CONTRASEÑA */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* SELECCIONAR ROL */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-2">Rol</label>
          <select
            value={idRol}
            onChange={(e) => setIdRol(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Selecciona un rol</option>
            {roles.map((rol) => (
              <option key={rol.id_rol} value={rol.id_rol}>
                {rol.nombre_rol}
              </option>
            ))}
          </select>
        </div>

        {/* BOTÓN REGISTRARSE */}
        <button
          type="submit"
          className="w-full py-2 rounded-lg text-white font-semibold transition duration-300"
          style={{
            backgroundColor: "#E50914",
          }}
        >
          Registrarse
        </button>

        {/* LINK LOGIN */}
        <p className="text-sm text-gray-600 mt-6 text-center">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-red-600 hover:underline font-medium">
            Inicia sesión aquí
          </a>
        </p>
      </form>
    </div>
    );
}