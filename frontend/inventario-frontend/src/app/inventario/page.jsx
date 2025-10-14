"use client"; 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function InventarioBajoPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect (() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("login");
      return;
    }
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token"); 
      const res = await fetch("http://localhost:3000/inventario/bajo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Error al cargar inventario bajo");

      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    if (!items || items.length === 0) return;
    const headers = [ "ID", "Producto", "Categoría", "StockActual", "StockMinimo", "Ubicacion" ];
    const rows = items.map((p) => [
      p.id_producto,
      p.nombre || p.producto || "",
      p.categoria || "",
      p.stock_actual,
      p.stock_minimo,
      p.ubicacion || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventario_bajo_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url); 
  }

  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📉 Inventario Bajo</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-1 bg-slate-700 text-white rounded hover:opacity-90"
          >
            Exportar CSV
          </button>
          <button
            onClick={fetchData}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Refrescar
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-green-600">✅ No hay productos con inventario bajo</p>
      ) : (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Stock actual</th>
                <th className="px-4 py-3 text-left">Stock mínimo</th>
                <th className="px-4 py-3 text-left">Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id_producto} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-3">{p.id_producto}</td>
                  <td className="px-4 py-3">{p.nombre || p.producto}</td>
                  <td className="px-4 py-3">{p.categoria}</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">
                    {p.stock_actual}
                  </td>
                  <td className="px-4 py-3">{p.stock_minimo}</td>
                  <td className="px-4 py-3">{p.ubicacion || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}