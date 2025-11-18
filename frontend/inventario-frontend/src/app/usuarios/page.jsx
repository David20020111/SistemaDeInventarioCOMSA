"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 

export default function UsuarioPage() {
    const router = useRouter();
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState ({
        id_usuario: null,
        nombre: "",
        correo: "",
        contraseña: "",
        id_rol: "",
    });
    const [modoEditar, setModoEditar] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://inventariocomsa.onrender.com";

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);

    async function fetchUsuarios() {
        const res = await fetch(`${API_URL}/usuarios`);
        const data = await res.json();
        setUsuarios(data);
    }

    async function fetchRoles() {
        const res = await fetch(`${API_URL}/roles`);
        const data = await res.json();
        setRoles(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.id_usuario) {
          alert("Error: No se selecciono usuario para editar.");
          return;
        }

        const url = `${API_URL}/usuarios${form.id_usuario}`;

        const res = await fetch(url, {
            method: "PUT", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        alert(data.message || data.error);
        
        setForm({ id_usuario: null, nombre: "", correo: "", contraseña: "", id_rol: ""});
        setModoEditar(false);
        setShowDialog(false);
        fetchUsuarios();
    }

    async function handleDelete(id) {
        if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;
        const res = await fetch(`${API_URL}/usuarios/${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        alert(data.message);
        fetchUsuarios();
    }

    function handleEdit(usuario) {
        setForm({
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            contraseña: "",
            id_rol: usuario.id_rol,
        });
        setModoEditar(true);
        setShowDialog(true);
    }

    function closeDialog() {
        setShowDialog(false);
        setModoEditar(false);
        setForm({ id_usuario: null, nombre: "", correo: "", contraseña: "", id_rol: "" });
    }

    return (
<div
      className="min-h-screen p-6"
      style={{
        background: `linear-gradient(to bottom, ${COLORS.backgroundTop}, ${COLORS.backgroundBotton})`,
      }}
    >
      {/* 🔺 Encabezado con logo y título */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <img src="/logoComsa.png" alt="Logo" className="w-36 h-20" />
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
            👤 Gestión de Usuarios
          </h1>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded text-white font-semibold shadow-lg hover:opacity-90 transition"
          style={{ background: COLORS.primary }}
        >
          🏠 Volver al inicio
        </button>
      </div>

      {/* 📋 Tabla de usuarios */}
      <div
        className="rounded-xl shadow-lg p-4 overflow-hidden"
        style={{ backgroundColor: COLORS.tableBody }}
      >
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: COLORS.primary }}
        >
          📄 Lista de Usuarios Registrados
        </h3>
        <table className="w-full border-collapse">
          <thead style={{ backgroundColor: COLORS.tableHeader }}>
            <tr>
              <th className="p-3 text-left text-white">ID</th>
              <th className="p-3 text-left text-white">Nombre</th>
              <th className="p-3 text-left text-white">Correo</th>
              <th className="p-3 text-left text-white">Rol</th>
              <th className="p-3 text-left text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr
                key={u.id_usuario}
                className="hover:bg-gray-800 transition"
                style={{ color: COLORS.text }}
              >
                <td className="p-3 border-t border-gray-700">{u.id_usuario}</td>
                <td className="p-3 border-t border-gray-700">{u.nombre}</td>
                <td className="p-3 border-t border-gray-700">{u.correo}</td>
                <td className="p-3 border-t border-gray-700">{u.nombre_rol}</td>
                <td className="p-3 border-t border-gray-700 space-x-2">
                  <button
                    onClick={() => handleEdit(u)}
                    className="px-3 py-1 rounded font-semibold text-white shadow"
                    style={{ background: "#f59e0b" }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(u.id_usuario)}
                    className="px-3 py-1 rounded font-semibold text-white shadow"
                    style={{ background: COLORS.primary }}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ⚙️ AlertDialog para edición */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div
            className="rounded-xl shadow-lg p-6 w-full max-w-md"
            style={{ backgroundColor: COLORS.tableBody }}
          >
            <h2
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: COLORS.primary }}
            >
              ✏️ Editar Usuario
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) =>
                  setForm({ ...form, nombre: e.target.value })
                }
                className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
              <input
                type="email"
                placeholder="Correo"
                value={form.correo}
                onChange={(e) =>
                  setForm({ ...form, correo: e.target.value })
                }
                className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
              <input
                type="password"
                placeholder="Nueva contraseña (opcional)"
                value={form.contraseña}
                onChange={(e) =>
                  setForm({ ...form, contraseña: e.target.value })
                }
                className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />

              <select
                value={form.id_rol}
                onChange={(e) =>
                  setForm({ ...form, id_rol: e.target.value })
                }
                className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="">Seleccione un rol</option>
                {roles.map((r) => (
                  <option key={r.id_rol} value={r.id_rol}>
                    {r.nombre_rol}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-white font-semibold shadow-md hover:opacity-90 transition"
                  style={{ background: COLORS.primary }}
                >
                  💾 Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 py-2 rounded text-white font-semibold shadow-md hover:opacity-90 transition"
                  style={{ background: "#555555" }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    );
}

const COLORS = {
    primary: "#e50914",
    backgroundTop: "#2b2b2b",
    backgroundBotton: "#000000",
    tableHeader: "#3a3a3a",
    tableBody: "#1e1e1e",
    text: "#ffffff",
};