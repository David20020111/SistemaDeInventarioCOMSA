"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PermisosPage() {
    const [roles, setRoles] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const [permisosRol, setPermisosRol] = useState({});
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
            console.error("Error al cargar roles", err);
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
    if (!rolSeleccionado) return alert("Seleccionar un rol primero");
    setLoading(true);
    try {
        const entries = Object.values(permisosRol);
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
        alert("Permisos Guardados Correctamente ✅");
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
                        
                    >

                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}