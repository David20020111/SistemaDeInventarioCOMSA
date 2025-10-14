"use client";
import { useEffect, useState } from "react";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [nuevoRol, setNuevoRol] = useState("");

  // 📌 Obtener roles
  const fetchRoles = async () => {
    const res = await fetch("http://localhost:3000/roles");
    const data = await res.json();
    setRoles(data);
  };

  // 📌 Crear rol
  const crearRol = async () => {
    if (!nuevoRol.trim()) return alert("Ingresa un nombre para el rol");
    await fetch("http://localhost:3000/roles", {
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
    await fetch(`http://localhost:3000/roles/${id}`, {
      method: "DELETE",
    });
    fetchRoles();
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📌 Gestión de Roles
        </h1>

        {/* Formulario */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Nuevo rol"
            value={nuevoRol}
            onChange={(e) => setNuevoRol(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={crearRol}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Agregar
          </button>
        </div>

        {/* Tabla de roles */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">ID</th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Nombre del Rol</th>
                <th className="px-4 py-2 text-center text-gray-700 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((rol) => (
                <tr key={rol.id_rol} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{rol.id_rol}</td>
                  <td className="px-4 py-2">{rol.nombre_rol}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => eliminarRol(rol.id_rol)}
                      className="bg-red-500 text-white px-4 py-1 rounded-lg shadow hover:bg-red-600 transition"
                    >
                      ❌ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No hay roles registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
