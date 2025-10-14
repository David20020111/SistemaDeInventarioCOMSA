"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CategoriasPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "", descripcion: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    fetchCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCategorias() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/categorias");
      if (!res.ok) throw new Error("Error al obtener categorías");
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm({ id: null, nombre: "", descripcion: "" });
    setShowForm(true);
  }

  function openEdit(c) {
    setForm({ id: c.id_categoria, nombre: c.nombre, descripcion: c.descripcion || "" });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setForm({ id: null, nombre: "", descripcion: "" });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.nombre.trim()) return setError("El nombre es requerido");

    const token = localStorage.getItem("token");
    const payload = { nombre: form.nombre.trim(), descripcion: form.descripcion };

    try {
      const url = form.id ? `http://localhost:3000/categorias/${form.id}` : "http://localhost:3000/categorias";
      const method = form.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en la operación");

      closeForm();
      fetchCategorias();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/categorias/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar");
      fetchCategorias();
    } catch (err) {
      alert(err.message || "Error");
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <div>
          <button onClick={() => router.push("/dashboard")} className="mr-2 px-4 py-2 rounded bg-gray-200">Volver</button>
          <button onClick={openCreate} className="px-4 py-2 rounded bg-blue-600 text-white">Nueva categoría</button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white shadow rounded">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id_categoria} className="border-t">
                  <td className="px-4 py-3">{c.id_categoria}</td>
                  <td className="px-4 py-3">{c.nombre}</td>
                  <td className="px-4 py-3">{c.descripcion || "-"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(c)} className="mr-2 px-3 py-1 bg-yellow-300 rounded">Editar</button>
                    <button onClick={() => handleDelete(c.id_categoria)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal / Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{form.id ? "Editar categoría" : "Crear categoría"}</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm mb-1">Nombre</label>
                <input className="w-full px-3 py-2 border rounded" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="block text-sm mb-1">Descripción</label>
                <textarea className="w-full px-3 py-2 border rounded" value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} />
              </div>

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeForm} className="px-4 py-2 rounded border">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{form.id ? "Guardar" : "Crear"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
