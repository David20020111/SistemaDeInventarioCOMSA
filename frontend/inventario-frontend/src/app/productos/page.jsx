"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductosPage() {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    id: null,
    codigo: "",
    nombre: "",
    id_categoria: "",
    stock_actual: 0,
    stock_minimo: 0,
    ubicacion: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    fetchProductos();
    fetchCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProductos() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/productos");
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategorias() {
    try {
      const res = await fetch("http://localhost:3000/categorias");
      if (!res.ok) throw new Error("Error al obtener categorías");
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error(err);
    }
  }

  function openCreate() {
    setForm({
      id: null,
      codigo: "",
      nombre: "",
      id_categoria: "",
      stock_actual: 0,
      stock_minimo: 0,
      ubicacion: "",
    });
    setShowForm(true);
  }

  function openEdit(p) {
    setForm({
      id: p.id_producto,
      codigo: p.codigo,
      nombre: p.nombre,
      id_categoria: p.id_categoria,
      stock_actual: p.stock_actual,
      stock_minimo: p.stock_minimo,
      ubicacion: p.ubicacion || "",
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setForm({
      id: null,
      codigo: "",
      nombre: "",
      id_categoria: "",
      stock_actual: 0,
      stock_minimo: 0,
      ubicacion: "",
    });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.nombre.trim() || !form.codigo.trim()) {
      return setError("El código y nombre son requeridos");
    }

    const token = localStorage.getItem("token");
    const payload = {
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      id_categoria: form.id_categoria,
      stock_actual: form.stock_actual,
      stock_minimo: form.stock_minimo,
      ubicacion: form.ubicacion,
    };

    try {
      const url = form.id
        ? `http://localhost:3000/productos/${form.id}`
        : "http://localhost:3000/productos";
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
      fetchProductos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/productos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar");
      fetchProductos();
    } catch (err) {
      alert(err.message || "Error");
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🔩 Materiales</h1>
        <div>
          <button
            onClick={() => router.push("/dashboard")}
            className="mr-2 px-4 py-2 rounded bg-gray-200"
          >
            Volver
          </button>
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Nuevo producto
          </button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Stock actual</th>
                <th className="px-4 py-3 text-left">Stock mínimo</th>
                <th className="px-4 py-3 text-left">Ubicación</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id_producto} className="border-t">
                  <td className="px-4 py-3">{p.id_producto}</td>
                  <td className="px-4 py-3">{p.codigo}</td>
                  <td className="px-4 py-3">{p.nombre}</td>
                  <td className="px-4 py-3">
                    {categorias.find((c) => c.id_categoria === p.id_categoria)?.nombre || "-"}
                  </td>
                  <td className="px-4 py-3">{p.stock_actual}</td>
                  <td className="px-4 py-3">{p.stock_minimo}</td>
                  <td className="px-4 py-3">{p.ubicacion || "-"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEdit(p)}
                      className="mr-2 px-3 py-1 bg-yellow-300 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id_producto)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Eliminar
                    </button>
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
            <h2 className="text-xl font-bold mb-4">
              {form.id ? "Editar producto" : "Crear producto"}
            </h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm mb-1">Código</label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  value={form.codigo}
                  onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm mb-1">Nombre</label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm mb-1">Categoría</label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={form.id_categoria}
                  onChange={(e) =>
                    setForm({ ...form, id_categoria: e.target.value })
                  }
                >
                  <option value="">Seleccione...</option>
                  {categorias.map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm mb-1">Stock actual</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded"
                  value={form.stock_actual}
                  onChange={(e) =>
                    setForm({ ...form, stock_actual: Number(e.target.value) })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm mb-1">Stock mínimo</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded"
                  value={form.stock_minimo}
                  onChange={(e) =>
                    setForm({ ...form, stock_minimo: Number(e.target.value) })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm mb-1">Ubicación</label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  value={form.ubicacion}
                  onChange={(e) =>
                    setForm({ ...form, ubicacion: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded border"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  {form.id ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
