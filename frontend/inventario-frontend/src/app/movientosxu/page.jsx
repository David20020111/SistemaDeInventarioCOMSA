"use client";
import { useState } from "react";

export default function ReporteMovimientosPage() {
  const [idProducto, setIdProducto] = useState("");
  const [reporte, setReporte] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const obtenerReporte = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/movimientos/reporte/${idProducto}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setReporte(data);
        setMensaje("");
      } else {
        setMensaje(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error de conexión con el servidor");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Reporte de Movimientos por Producto</h2>

      <form onSubmit={obtenerReporte} className="mb-6 space-y-4">
        <div>
          <label className="block font-medium">ID Producto</label>
          <input
            type="text"
            value={idProducto}
            onChange={(e) => setIdProducto(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Obtener Reporte
        </button>
      </form>

      {mensaje && <p className="mb-4 text-red-500">{mensaje}</p>}

      {reporte.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">ID Movimiento</th>
                <th className="p-2 border">Tipo</th>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Cantidad</th>
                <th className="p-2 border">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {reporte.map((mov) => (
                <tr key={mov.id_movimiento} className="hover:bg-gray-100">
                  <td className="p-2 border">{mov.id_movimiento}</td>
                  <td className="p-2 border">{mov.tipo}</td>
                  <td className="p-2 border">{new Date(mov.fecha).toLocaleString()}</td>
                  <td className="p-2 border">{mov.cantidad}</td>
                  <td className="p-2 border">{mov.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
