"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://inventariocomsa.onrender.com";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ id_categoria: null, nombre: "", descripcion: "" });
  const [modoEditar, setModoEditar] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => { fetchCategorias(); }, []);

  const fetchCategorias = async () => {
    const res = await fetch(`${API_URL}/categorias`);
    const data = await res.json();
    setCategorias(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = modoEditar
      ? `${API_URL}/categorias/${form.id_categoria}`
      : `${API_URL}/categorias`;
    const method = modoEditar ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ id_categoria: null, nombre: "", descripcion: "" });
    setModoEditar(false);
    setMostrarModal(false);
    fetchCategorias();
  };

  const handleEdit = (categoria) => {
    setForm(categoria);
    setModoEditar(true);
    setMostrarModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    await fetch(`${API_URL}/categorias/${id}`, { method: "DELETE" });
    fetchCategorias();
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* LOGO Y ENCABEZADO */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img
            src="/logoComsa.png"
            alt="Logo"
            className="w-35 h-20"
          />
          <h1 className="text-3xl font-extrabold text-red-600">
            📦 Gestión de Categorías
          </h1>
        </div>
        <button
          onClick={() => {
            setForm({ id_categoria: null, nombre: "", descripcion: "" });
            setModoEditar(false);
            setMostrarModal(true);
          }}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition duration-300"
        >
          ➕ Nueva Categoría
        </button>
      </div>

      {/* TABLA DE CATEGORÍAS */}
      <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr
                key={c.id_categoria}
                className="border-t border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="p-3">{c.id_categoria}</td>
                <td className="p-3">{c.nombre}</td>
                <td className="p-3">{c.descripcion}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-yellow-500 text-black px-3 py-1 rounded-lg hover:bg-yellow-400 font-semibold"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(c.id_categoria)}
                    className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded-lg font-semibold"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categorias.length === 0 && (
          <p className="text-center text-gray-400 p-4">
            No hay categorías registradas
          </p>
        )}
      </div>

      {/* MODAL (AlertDialog) */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-red-600">
            <h2 className="text-2xl font-bold text-center mb-4 text-red-500">
              {modoEditar ? "Editar Categoría" : "Agregar Categoría"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500"
                required
              />
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500"
              />

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
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
