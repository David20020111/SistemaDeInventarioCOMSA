"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RolesPage() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [nuevoRol, setNuevoRol] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://inventariocomsa.onrender.com";

  // 📌 Obtener roles
  const fetchRoles = async () => {
    const res = await fetch(`${API_URL}/roles`);
    const data = await res.json();
    setRoles(data);
  };

  // 📌 Crear rol
  const crearRol = async () => {
    if (!nuevoRol.trim()) return alert("Ingresa un nombre para el rol");
    await fetch(`${API_URL}/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_rol: nuevoRol }),
    });
    setNuevoRol("");
    fetchRoles();
  };

  // 📌 Eliminar rol
  const eliminarRol = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este rol?")) return;
    await fetch(`${API_URL}/roles/${id}`, {
      method: "DELETE",
    });
    fetchRoles();
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
<div
      className="min-h-screen p-6"
      style={{
        background: `linear-gradient(to bottom, ${COLORS.backgroundTop}, ${COLORS.backgroundBottom})`,
      }}
    >
      {/* 🔺 Encabezado con logo y título */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <img src="/logoComsa.png" alt="Logo" className="w-36 h-20" />
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
            🔑 Gestión de Roles
          </h1>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded text-white font-semibold shadow-lg hover:opacity-90 transition"
          style={{ background: COLORS.primary }}
        >
          🏠 Volver al Inicio
        </button>
      </div>

      {/* 🧾 Formulario para agregar rol */}
      <div
        className="rounded-xl shadow-lg p-6 mb-6"
        style={{
          backgroundColor: COLORS.tableBody,
          color: COLORS.text,
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: COLORS.primary }}
        >
          ➕ Agregar nuevo rol
        </h2>

        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Nombre del rol"
            value={nuevoRol}
            onChange={(e) => setNuevoRol(e.target.value)}
            className="flex-1 border border-gray-600 bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            onClick={crearRol}
            className="px-4 py-2 rounded text-white font-semibold shadow-md hover:opacity-90 transition"
            style={{ background: COLORS.primary }}
          >
            Agregar Rol
          </button>
        </div>
      </div>

      {/* 📋 Tabla de roles */}
      <div
        className="rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: COLORS.tableBody }}
      >
        <h3
          className="text-lg font-bold mb-4 p-4"
          style={{ color: COLORS.primary }}
        >
          📄 Lista de Roles Registrados
        </h3>

        <table className="w-full border-collapse">
          <thead style={{ backgroundColor: COLORS.tableHeader }}>
            <tr>
              <th className="p-3 text-left text-white">ID</th>
              <th className="p-3 text-left text-white">Nombre del Rol</th>
              <th className="p-3 text-left text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((rol) => (
                <tr
                  key={rol.id_rol}
                  className="hover:bg-gray-800 transition"
                  style={{ color: COLORS.text }}
                >
                  <td className="p-3 border-t border-gray-700">{rol.id_rol}</td>
                  <td className="p-3 border-t border-gray-700">
                    {rol.nombre_rol}
                  </td>
                  <td className="p-3 border-t border-gray-700">
                    <button
                      onClick={() => eliminarRol(rol.id_rol)}
                      className="px-3 py-1 rounded font-semibold text-white shadow "
                      style={{ background: COLORS.primary }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-6 text-gray-400 border-t border-gray-700"
                >
                  No hay roles registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const COLORS = {
  primary: "#e50914",
  backgroundTop: "#2b2b2b",
  backgroundBottom: "#000000",
  tableHeader: "#3a3a3a",
  tableBody: "#1e1e1e",
  text: "#ffffff",
}