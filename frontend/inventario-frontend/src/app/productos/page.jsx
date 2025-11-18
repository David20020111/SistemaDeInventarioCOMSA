"use client";
import { useState, useEffect } from "react";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    id_producto: null,
    codigo: "",
    nombre: "",
    id_categoria: "",
    stock_actual: "",
    stock_minimo: "",
    ubicacion: "",
  });
  const [modoEditar, setModoEditar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://inventariocomsa.onrender.com";

  // --- Cargar productos y categorías al iniciar ---
  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    const res = await fetch(`${API_URL}/productos`);
    const data = await res.json();
    setProductos(data);
  };

  const fetchCategorias = async () => {
    const res = await fetch(`${API_URL}/categorias`);
    const data = await res.json();
    setCategorias(data);
  };

  // --- Guardar o actualizar producto ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = modoEditar
      ? `${API_URL}/productos/${form.id_producto}`
      : `${API_URL}/productos`;
    const method = modoEditar ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setModalVisible(false);
    setForm({
      id_producto: null,
      codigo: "",
      nombre: "",
      id_categoria: "",
      stock_actual: "",
      stock_minimo: "",
      ubicacion: "",
    });
    setModoEditar(false);
    fetchProductos();
  };

  // --- Abrir modal en modo agregar ---
  const openAddModal = () => {
    setModoEditar(false);
    setForm({
      id_producto: null,
      codigo: "",
      nombre: "",
      id_categoria: "",
      stock_actual: "",
      stock_minimo: "",
      ubicacion: "",
    });
    setModalVisible(true);
  };

  // --- Abrir modal en modo editar ---
  const handleEdit = (producto) => {
    setModoEditar(true);
    setForm(producto);
    setModalVisible(true);
  };

  // --- Eliminar producto ---
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    await fetch(`${API_URL}/productos/${id}`, { method: "DELETE" });
    fetchProductos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* LOGO Y TÍTULO */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img
            src="/logoComsa.png"
            alt="Logo"
            className="w-35 h-20"
          />
          <h1 className="text-3xl font-extrabold text-red-600">
            🧰Gestión de Productos
          </h1>
        </div>
        <button
          onClick={openAddModal}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition duration-300"
        >
          ➕ Agregar Producto
        </button>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-3">Código</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Ubicación</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr
                key={p.id_producto}
                className="border-t border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="p-3">{p.codigo}</td>
                <td className="p-3">{p.nombre}</td>
                <td className="p-3">{p.categoria}</td>
                <td className="p-3">
                  {p.stock_actual}{" "}
                  <span className="text-gray-400">/ {p.stock_minimo}</span>
                </td>
                <td className="p-3">{p.ubicacion}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 text-black px-3 py-1 rounded-lg hover:bg-yellow-400 font-semibold"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id_producto)}
                    className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded-lg font-semibold"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL (AlertDialog) */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-red-600">
            <h2 className="text-2xl font-bold text-center mb-4 text-red-500">
              {modoEditar ? "Editar Producto" : "Agregar Producto"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                placeholder="Código"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre del producto"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              <select
                value={form.id_categoria}
                onChange={(e) =>
                  setForm({ ...form, id_categoria: e.target.value })
                }
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
              >
                <option value="">-- Selecciona categoría --</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={form.stock_actual}
                  onChange={(e) =>
                    setForm({ ...form, stock_actual: e.target.value })
                  }
                  placeholder="Stock actual"
                  className="p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="number"
                  value={form.stock_minimo}
                  onChange={(e) =>
                    setForm({ ...form, stock_minimo: e.target.value })
                  }
                  placeholder="Stock mínimo"
                  className="p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <input
                value={form.ubicacion}
                onChange={(e) =>
                  setForm({ ...form, ubicacion: e.target.value })
                }
                placeholder="Ubicación"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500"
              />

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    modoEditar
                      ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {modoEditar ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
