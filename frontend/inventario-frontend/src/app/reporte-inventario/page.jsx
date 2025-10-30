"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReporteInventarioPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nombres, setNombres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: "",
    stock: "",
    nombre: "",
  });
  const router = useRouter();

  useEffect(() => {
    fetchDatos();
  }, []);

  async function fetchDatos() {
    await Promise.all([fetchReporte(), fetchCategorias(), fetchNombres()]);
  }

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

  async function fetchCategorias() {
    try {
      const res = await fetch("http://localhost:3000/categorias");
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error("Error cargando las categorias:", err);
    }
  }

  async function fetchNombres() {
    try {
      const res = await fetch("http://localhost:3000/productos");
      const data = await res.json();
      setNombres(data);
    } catch (err) {
      console.error("Error cargando nombres de productos", err);
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
    <div
      className="min-h-screen p-6"
      style={{
        background: `linear-gradient(to bottom, ${COLORS.backgroundTop}, ${COLORS.backgroundBottom})`,
      }}
    >
      {/* Encabezado con logo y título */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <img src="/logoComsa.png" alt="Logo" className="w-36 h-20" />
          <h1
            className="text-3xl font-bold"
            style={{ color: COLORS.primary }}
          >
            📊 Reporte de Inventario
          </h1>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded text-white font-semibold shadow-lg hover:opacity-90 transition"
          style={{ background: COLORS.primary }}
        >
          🏠​ Volver al inicio
        </button>
      </div>

      {/* Filtros */}
      <div className="rounded-xl shadow-lg p-6 mb-6"
        style={{
          backgroundColor: COLORS.tableBody,
          color: COLORS.text,
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: COLORS.primary }}
        >
          🔍 Filtros de búsqueda
        </h2>

        <form
                    onSubmit={handleFilter}
          className="flex flex-wrap gap-4 items-center"
        >
          {/* Filtro por nombre (select dinámico) */}
          <select
            name="nombre"
            value={filtros.nombre}
            onChange={handleChange}
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">-- Seleccionar producto --</option>
            {nombres.map((p) => (
              <option key={p.id_producto} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>

          {/* Filtro por categoría (select dinámico) */}
          <select
            name="categoria"
            value={filtros.categoria}
            onChange={handleChange}
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">-- Seleccionar categoría --</option>
            {categorias.map((c) => (
              <option key={c.id_categoria} value={c.nombre}>
                {c.nombre}
              </option>
            ))}
          </select>

          {/* Filtro por stock */}
          <select
            name="stock"
            value={filtros.stock}
            onChange={handleChange}
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded"
          >
            <option value="">-- Stock --</option>
            <option value="bajo">Bajo</option>
            <option value="normal">Normal</option>
          </select>

          {/* Botones */}
          <button
            type="submit"
            className="px-4 py-2 rounded text-white font-semibold shadow-md hover:opacity-90 transition"
            style={{ background: COLORS.primary }}
          >
            🖇️ Filtrar
          </button>

          <button
            type="button"
            onClick={resetFiltros}
            className="px-4 py-2 rounded text-white font-semibold shadow-md hover:opacity-90 transition"
            style={{ background: "#555555" }}
          >
            🔄 Ver Todo
          </button>
        </form>
      </div>

      {/* Tabla de resultados */}
      <div
        className="rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: COLORS.tableBody }}
      >
        {loading ? (
          <p className="text-center p-6 text-gray-400">Cargando datos...</p>
        ) : productos.length === 0 ? (
          <p className="text-center p-6 text-gray-400">
            No hay productos en el inventario.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead style={{ backgroundColor: COLORS.tableHeader }}>
              <tr>
                <th className="p-3 text-left text-white">Código</th>
                <th className="p-3 text-left text-white">Producto</th>
                <th className="p-3 text-left text-white">Categoría</th>
                <th className="p-3 text-left text-white">Stock Actual</th>
                <th className="p-3 text-left text-white">Stock Mínimo</th>
                <th className="p-3 text-left text-white">Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-800 transition"
                  style={{ color: COLORS.text }}
                >
                  <td className="p-3 border-t border-gray-700">{p.codigo}</td>
                  <td className="p-3 border-t border-gray-700">{p.nombre}</td>
                  <td className="p-3 border-t border-gray-700">{p.categoria}</td>
                  <td className="p-3 border-t border-gray-700">{p.stock_actual}</td>
                  <td className="p-3 border-t border-gray-700">{p.stock_minimo}</td>
                  <td className="p-3 border-t border-gray-700">{p.ubicacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const COLORS = {
  backgroundTop: "#1c1c1c",
  backgroundBottom: "#4f4f4f",
  tableHeader: "#424242",
  tableBody: "#000000",
  text: "#ffffff",
  primary: "#d32f2f",
}
