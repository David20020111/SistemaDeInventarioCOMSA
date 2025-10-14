"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    id_producto: "",
    tipo: "entrada",
    cantidad: "",
    detalle: "",
    id_usuario: 1, // 👈 de momento quemado, luego se toma del login
  });
  const [error, setError] = useState("");

  const [filtroProducto, setFiltroProducto] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState(""); 

  const router = useRouter();

  useEffect(() => {
    fetchMovimientos();
    fetchProductos();
  }, []);

  async function fetchMovimientos() {
    try {
      let url = "http://localhost:3000/movimientos?";
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
      const res = await fetch("http://localhost:3000/productos");
      const data = await res.json();
      setProductos(data);
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
      const res = await fetch("http://localhost:3000/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar movimiento");

      setForm({
        id_producto: "",
        tipo: "entrada",
        cantidad: "",
        detalle: "",
        id_usuario: 1,
      });
      fetchMovimientos();
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registro de Movimientos</h1>

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

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6">
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="mb-3">
          <label className="block mb-1">Producto</label>
          <select
            className="w-full border px-3 py-2 rounded"
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
        </div>

        <div className="mb-3">
          <label className="block mb-1">Tipo</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block mb-1">Cantidad</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={form.cantidad}
            onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Detalle</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={form.detalle}
            onChange={(e) => setForm({ ...form, detalle: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Registrar
        </button>
      </form>

      {/* Filtros */}
      <div className="mb-4 flex gap-4 flex-wrap bg-gray-100 p-3 rounded">
        <input
          type="text"
          placeholder="Buscar producto"
          className="border p-2 rounded"
          value={filtroProducto}
          onChange={(e) => setFiltroProducto(e.target.value)}
        />
        <input
          type="text"
          placeholder="Buscar usuario"
          className="border p-2 rounded"
          value={filtroUsuario}
          onChange={(e) => setFiltroUsuario(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
        <button
          onClick={fetchMovimientos}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Filtrar
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold mb-3">Historial de Movimientos</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Cantidad</th>
              <th className="px-4 py-2 text-left">Detalle</th>
              <th className="px-4 py-2 text-left">Usuario</th>
              <th className="px-4 py-2 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => (
              <tr key={m.id_movimiento} className="border-t">
                <td className="px-4 py-2">{m.id_movimiento}</td>
                <td className="px-4 py-2">{m.producto}</td>
                <td className="px-4 py-2">{m.tipo}</td>
                <td className="px-4 py-2">{m.cantidad}</td>
                <td className="px-4 py-2">{m.detalle}</td>
                <td className="px-4 py-2">{m.usuario}</td>
                <td className="px-4 py-2">
                  {new Date(m.fecha).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
