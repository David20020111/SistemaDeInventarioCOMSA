"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReporteInventarioPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: "",
    stock: "",
    nombre: "",
  });
  const router = useRouter();

  useEffect(() => {
    fetchReporte();
  }, []);

  async function fetchReporte() {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    const query = new URLSearchParams(filtros).toString();

    try {
      const res = await fetch(
        `http://localhost:3000/reportes/inventario?${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error cargando reporte inventario", err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  }

  function handleFilter(e) {
    e.preventDefault();
    fetchReporte();
  }

  function resetFiltros() {
    setFiltros({ categoria: "", stock: "", nombre: "" });
    fetchReporte();
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📊 Reporte de Inventario
      </h2>

      {/* Botones navegación */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          ⬅️ Volver al Dashboard
        </button>

        <button
          onClick={resetFiltros}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          🔄 Ver Todo
        </button>
      </div>

      {/* Filtros */}
      <form
        onSubmit={handleFilter}
        className="mb-4 bg-white shadow p-4 rounded flex gap-4 flex-wrap"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Buscar producto..."
          value={filtros.nombre}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          name="categoria"
          placeholder="Categoría"
          value={filtros.categoria}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        <select
          name="stock"
          value={filtros.stock}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">-- Stock --</option>
          <option value="bajo">Bajo</option>
          <option value="normal">Normal</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Filtrar
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : productos.length === 0 ? (
        <p className="text-red-600">No hay productos en el inventario.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Código</th>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-left">Categoría</th>
                <th className="px-4 py-2 text-left">Stock Actual</th>
                <th className="px-4 py-2 text-left">Stock Mínimo</th>
                <th className="px-4 py-2 text-left">Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p, idx) => (
                <tr
                  key={idx}
                  className="border-t hover:bg-gray-100 transition"
                >
                  <td className="px-4 py-2">{p.codigo}</td>
                  <td className="px-4 py-2">{p.nombre}</td>
                  <td className="px-4 py-2">{p.categoria}</td>
                  <td className="px-4 py-2">{p.stock_actual}</td>
                  <td className="px-4 py-2">{p.stock_minimo}</td>
                  <td className="px-4 py-2">{p.ubicacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
