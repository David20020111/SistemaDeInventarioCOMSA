"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    id_producto: "",
    tipo: "entrada",
    cantidad: "",
    detalle: "",
    id_usuario: 1, // 👈 de momento quemado, luego se toma del login
  });
  const [error, setError] = useState("");
  const [alerta, setAlerta] = useState(null);

  const [filtroProducto, setFiltroProducto] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState(""); 

  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://inventariocomsa.onrender.com";

  useEffect(() => {
    fetchMovimientos();
    fetchProductos();
    fetchUsuarios();
  }, []);

  async function fetchMovimientos() {
    try {
      let url = `${API_URL}/movimientos?`;
      if (filtroProducto) url += `producto=${filtroProducto}&`;
      if (filtroUsuario) url += `usuario=${filtroUsuario}&`;
      if (fechaInicio && fechaFin)
        url += `fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

      const res = await fetch(url);
      const data = await res.json();
      setMovimientos(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchProductos() {
    try {
      const res = await fetch(`${API_URL}/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchUsuarios() {
    try {
      const res = await fetch(`${API_URL}/usuarios`);
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.id_producto || !form.cantidad) {
      return setError("Debe seleccionar un producto y una cantidad");
    }

    try {
      const res = await fetch(`${API_URL}/movimientos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar movimiento");

      setAlerta("Movimiento registrado correctamente");

      setForm({
        id_producto: "",
        tipo: "entrada",
        cantidad: "",
        detalle: "",
        id_usuario: 1,
      });
      fetchMovimientos();

      setTimeout(() => setAlerta(null), 2500);
    } catch (err) {
      setError(err.message);
    }
  }

  // 🔄 Reset de filtros
  function resetFiltros() {
    setFiltroProducto("");
    setFiltroUsuario("");
    setFechaInicio("");
    setFechaFin("");
    fetchMovimientos();
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: `linear-gradient(to bottom, ${COLORS.backgroundTop}, ${COLORS.backgroundBotton})`,
        color: COLORS.text,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <img src="/logoComsa.png" alt="Logo" className="w-36 h-20" />
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
            ⚙️ Registro de Movimientos
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

      {/* Formulario */}
      <div
        className="p-6 rounded-xl shadow-lg mb-6"
        style={{ backgroundColor: COLORS.tableBody }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: COLORS.primary }}
        >
          ➕ Registrar Movimiento
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {alerta && (
          <div className="bg-green-600 text-white p-3 rounded mb-3 text-center font-semibold">
            {alerta}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded"
            value={form.id_producto}
            onChange={(e) => setForm({ ...form, id_producto: e.target.value })}
          >
            <option value="">Seleccione un producto</option>
            {productos.map((p) => (
              <option key={p.id_producto} value={p.id_producto}>
                {p.nombre} (Stock: {p.stock_actual})
              </option>
            ))}
          </select>

          <select
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>

          <input
            type="number"
            placeholder="Cantidad"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded"
            value={form.cantidad}
            onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
          />

          <input
            type="text"
            placeholder="Detalle"
            className="md:col-span-2 border border-gray-600 bg-gray-800 text-white p-2 rounded"
            value={form.detalle}
            onChange={(e) => setForm({ ...form, detalle: e.target.value })}
          />

          <button
            type="submit"
            className="px-4 py-2 rounded text-white font-semibold shadow-md hover:opacity-90 transition"
            style={{ background: COLORS.primary }}
          >
            💾​ Guardar Movimiento
          </button>
        </form>
      </div>

      {/* Filtros */}
      <div
        className="p-6 rounded-xl shadow-lg mb-6"
        style={{ backgroundColor: COLORS.tableBody }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: COLORS.primary }}
        >
          🔍 Filtros de búsqueda
        </h2>

        <div className="flex flex-wrap gap-4">
          <select
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded"
            value={filtroProducto}
            onChange={(e) => setFiltroProducto(e.target.value)}
          >
            <option value="">-- Producto --</option>
            {productos.map((p) => (
              <option key={p.id_producto} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded"
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
          >
            <option value="">-- Usuario --</option>
            {usuarios.map((u) => (
              <option key={u.id_usuario} value={u.nombre}>
                {u.nombre}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <input
            type="date"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />

          <button
            onClick={fetchMovimientos}
            className="px-4 py-2 rounded text-white font-semibold shadow-md hover:opacity-90 transition"
            style={{ background: COLORS.primary }}
          >
            🖇️ Filtrar
          </button>

          <button
            onClick={resetFiltros}
            className="px-4 py-2 rounded text-white font-semibold shadow-md hover:opacity-90 transition"
            style={{ background: "#555555" }}
          >
            🔄 Ver todos los movimientos
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div
        className="rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: COLORS.tableBody }}
      >
        <table className="w-full border-collapse">
          <thead style={{ backgroundColor: COLORS.tableHeader }}>
            <tr>
              <th className="p-3 text-left text-white">ID</th>
              <th className="p-3 text-left text-white">Producto</th>
              <th className="p-3 text-left text-white">Tipo</th>
              <th className="p-3 text-left text-white">Cantidad</th>
              <th className="p-3 text-left text-white">Detalle</th>
              <th className="p-3 text-left text-white">Usuario</th>
              <th className="p-3 text-left text-white">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-400">
                  No hay movimientos registrados.
                </td>
              </tr>
            ) : (
              movimientos.map((m) => (
                <tr
                  key={m.id_movimiento}
                  className="hover:bg-gray-800 transition"
                  style={{ color: COLORS.text }}
                >
                  <td className="p-3 border-t border-gray-700">{m.id_movimiento}</td>
                  <td className="p-3 border-t border-gray-700">{m.producto}</td>
                  <td className="p-3 border-t border-gray-700">{m.tipo}</td>
                  <td className="p-3 border-t border-gray-700">{m.cantidad}</td>
                  <td className="p-3 border-t border-gray-700">{m.detalle}</td>
                  <td className="p-3 border-t border-gray-700">{m.usuario}</td>
                  <td className="p-3 border-t border-gray-700">
                    {new Date(m.fecha).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const COLORS = {
  backgroundTop: "#1c1c1c",
  backgroundBotton: "#2b2b2b",
  primary: "#c0392b",
  tableHeader: "#3d3d3d",
  tableBody: "#141414",
  text: "#ffffff",
}