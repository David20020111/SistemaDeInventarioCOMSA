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

  useEffect(() => {
    fetchRoles();
    fetchPermisos();
  }, []);

  async function fetchRoles() {
    try {
      const res = await fetch("http://localhost:3000/roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error("Error cargando roles", err);
    }
  }

  async function fetchPermisos() {
    try {
      const res = await fetch("http://localhost:3000/permisos");
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
      const res = await fetch(`http://localhost:3000/permisos/rol/${id_rol}`);
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
        fetch("http://localhost:3000/permisos/asignar", {
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
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🔐 Permisos por Rol</h2>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-3 py-2 bg-gray-700 text-white rounded"
            >
              ⬅️ Volver al Dashboard
            </button>
            <button
              onClick={resetView}
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              🔄 Ver Todo
            </button>
          </div>
        </div>

        <div className="mb-4 flex gap-4 items-center">
          <label className="font-medium">Rol:</label>
          <select
            value={rolSeleccionado}
            onChange={(e) => cargarPermisosDelRol(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">-- Selecciona un rol --</option>
            {roles.map((r) => (
              <option key={r.id_rol} value={r.id_rol}>
                {r.nombre_rol}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="p-2 text-left">Módulo</th>
                  <th className="p-2 text-center">Ver</th>
                  <th className="p-2 text-center">Crear</th>
                  <th className="p-2 text-center">Editar</th>
                  <th className="p-2 text-center">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {permisos.map((perm) => {
                  const p = permisosRol[perm.id_permiso] || {
                    id_permiso: perm.id_permiso,
                    nombre_modulo: perm.nombre_modulo,
                    puede_ver: false,
                    puede_crear: false,
                    puede_editar: false,
                    puede_eliminar: false,
                  };
                  return (
                    <tr key={perm.id_permiso} className="border-t hover:bg-gray-50">
                      <td className="p-2">{perm.nombre_modulo}</td>
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={!!p.puede_ver}
                          onChange={() => toggleFlag(perm.id_permiso, "puede_ver")}
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={!!p.puede_crear}
                          onChange={() => toggleFlag(perm.id_permiso, "puede_crear")}
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={!!p.puede_editar}
                          onChange={() => toggleFlag(perm.id_permiso, "puede_editar")}
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={!!p.puede_eliminar}
                          onChange={() => toggleFlag(perm.id_permiso, "puede_eliminar")}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={guardarPermisos}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
            disabled={!rolSeleccionado || loading}
          >
            💾 Guardar permisos
          </button>
        </div>
      </div>
    </div>
  );
}
