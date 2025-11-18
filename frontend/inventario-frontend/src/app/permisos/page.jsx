"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PermisosPage() {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]); // lista de módulos
  const [permisosRol, setPermisosRol] = useState({}); // map id_permiso -> flags
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://inventariocomsa.onrender.com";

  useEffect(() => {
    fetchRoles();
    fetchPermisos();
  }, []);

  async function fetchRoles() {
    try {
      const res = await fetch(`${API_URL}/roles`);
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error("Error cargando roles", err);
    }
  }

  async function fetchPermisos() {
    try {
      const res = await fetch(`${API_URL}/permisos`);
      const data = await res.json();
      setPermisos(data);
    } catch (err) {
      console.error("Error cargando permisos", err);
    }
  }

  async function cargarPermisosDelRol(id_rol) {
    if (!id_rol) {
      setPermisosRol({});
      setRolSeleccionado("");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/permisos/rol/${id_rol}`);
      const data = await res.json();
      // transformar a mapa para accesos rápidos
      const map = {};
      data.forEach((p) => {
        map[p.id_permiso] = {
          id_permiso: p.id_permiso,
          nombre_modulo: p.nombre_modulo,
          puede_ver: !!p.puede_ver,
          puede_crear: !!p.puede_crear,
          puede_editar: !!p.puede_editar,
          puede_eliminar: !!p.puede_eliminar,
        };
      });
      setPermisosRol(map);
      setRolSeleccionado(id_rol);
    } catch (err) {
      console.error("Error cargando permisos del rol", err);
    } finally {
      setLoading(false);
    }
  }

  function toggleFlag(id_permiso, campo) {
    setPermisosRol((prev) => {
      const current = prev[id_permiso] || {
        id_permiso,
        nombre_modulo: permisos.find((p) => p.id_permiso === id_permiso)?.nombre_modulo || "",
        puede_ver: false,
        puede_crear: false,
        puede_editar: false,
        puede_eliminar: false,
      };
      return {
        ...prev,
        [id_permiso]: { ...current, [campo]: !current[campo] },
      };
    });
  }

  async function guardarPermisos() {
    if (!rolSeleccionado) return alert("Selecciona un rol primero");
    setLoading(true);
    try {
      // enviar para cada permiso su estado
      const entries = Object.values(permisosRol);
      // filtrar para solo permisos presentes en la tabla 'Permisos' (por si hay mismatch)
      const promises = entries.map((p) =>
        fetch(`${API_URL}/permisos/asignar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_rol: rolSeleccionado,
            id_permiso: p.id_permiso,
            puede_ver: p.puede_ver,
            puede_crear: p.puede_crear,
            puede_editar: p.puede_editar,
            puede_eliminar: p.puede_eliminar,
          }),
        })
      );

      await Promise.all(promises);
      alert("Permisos guardados correctamente ✅");
    } catch (err) {
      console.error("Error guardando permisos", err);
      alert("Error guardando permisos");
    } finally {
      setLoading(false);
    }
  }

  function resetView() {
    setRolSeleccionado("");
    setPermisosRol({});
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center py-10 px-4"
      style={{
        background: "linear-gradient(to bottom, #1a1a1a, #2b2b2b, #3b3b3b)",
      }}
    >
      {/* 🔻 LOGO */}
      <div className="flex justify-center mb-8">
        <img
          src="/logoComsa.png"
          alt="Logo de la empresa"
          className="w-35 h-20 object-contain drop-shadow-lg"
        />
      </div>

      <div className="w-full max-w-5xl bg-black text-white shadow-2xl rounded-2xl p-8 border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-500">
            🔐 Gestión de Permisos por Rol
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-red-600 hover:bg-red-700 transition text-white px-5 py-2 rounded-lg shadow-lg"
          >
            ⬅️ Volver al Dashboard
          </button>
        </div>

        {/* Selector de rol */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <label className="text-lg font-semibold">Selecciona un Rol:</label>
          <select
            value={rolSeleccionado}
            onChange={(e) => cargarPermisosDelRol(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">-- Selecciona un rol --</option>
            {roles.map((r) => (
              <option key={r.id_rol} value={r.id_rol}>
                {r.nombre_rol}
              </option>
            ))}
          </select>
          <button
            onClick={resetView}
            className="bg-red-600 hover:bg-red-700 transition text-white px-5 py-2 rounded-lg"
          >
            🔄 Limpiar
          </button>
        </div>

        {/* Tabla de permisos */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700 rounded-lg">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Módulo</th>
                <th className="px-4 py-2 text-center">Ver</th>
                <th className="px-4 py-2 text-center">Crear</th>
                <th className="px-4 py-2 text-center">Editar</th>
                <th className="px-4 py-2 text-center">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    Cargando permisos...
                  </td>
                </tr>
              ) : permisos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No hay módulos registrados
                  </td>
                </tr>
              ) : (
                permisos.map((perm) => {
                  const p = permisosRol[perm.id_permiso] || {
                    id_permiso: perm.id_permiso,
                    nombre_modulo: perm.nombre_modulo,
                    puede_ver: false,
                    puede_crear: false,
                    puede_editar: false,
                    puede_eliminar: false,
                  };
                  return (
                    <tr
                      key={perm.id_permiso}
                      className="border-t border-gray-700 hover:bg-gray-800 transition"
                    >
                      <td className="px-4 py-2">{perm.nombre_modulo}</td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={!!p.puede_ver}
                          onChange={() => toggleFlag(perm.id_permiso, "puede_ver")}
                          className="accent-red-500 scale-125"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={!!p.puede_crear}
                          onChange={() => toggleFlag(perm.id_permiso, "puede_crear")}
                          className="accent-red-500 scale-125"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={!!p.puede_editar}
                          onChange={() => toggleFlag(perm.id_permiso, "puede_editar")}
                          className="accent-red-500 scale-125"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={!!p.puede_eliminar}
                          onChange={() => toggleFlag(perm.id_permiso, "puede_eliminar")}
                          className="accent-red-500 scale-125"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Botón Guardar */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={guardarPermisos}
            disabled={!rolSeleccionado || loading}
            className={`px-8 py-3 rounded-lg font-semibold transition ${
              !rolSeleccionado || loading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white shadow-lg"
            }`}
          >
            💾 Guardar Permisos
          </button>
        </div>
      </div>
    </div>
  );
}