"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import LowStockBadge from "../components/LowStockBadge";

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login"); 
        } else {
            fetchData();
        }
    }, [router]);

    const fetchData = async () => {
        try {
            const res = await fetch("http://localhost:3000/dashboard/stats");
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Error al cargar datos al dashboard", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-indigo-600 to-purple-700 text-white flex-col shadow-lg">
                <div className="p-6 text-center border-b border-purple-500">
                    <h1 className="text-2xl font-bold">COMSA</h1>
                    <p className="text-sm text-purple-200">Bienvenidos</p>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-3">
                        <li>
                            <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-purple-500 transition">
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <Link href="/categorias" className="block px-3 py-2 rounded-lg hover:bg-purple-500 transition">
                                📦 Categorías
                            </Link>
                        </li>
                        <li>
                            <Link href="/productos" className="block px-3 py-2 rounded-lg hover:bg-purple-500 transition">
                                🧰​ Material
                            </Link>
                        </li>
                        <li>
                            <a href="/reporte-inventario" className="block px-3 py-2 rounded-lg hover:bg-purple-500 transition">
                                 📊Reporte Inventario
                            </a>
                        </li>
                        <li>
                            <Link href="/movimientos" className="block px-3 py-2 rounded-lg hover:bg-purple-500 transition">
                                🔄 Movimientos
                            </Link>
                        </li>
                       
                        {/* ... */}
                        <li>
                            <a href="/inventario" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-500 transition">
                                 📉 Inventario bajo
                                <LowStockBadge />
                             </a>
                        </li>
                        <li>
                            <Link href="/usuarios" className="block px-3 py-2 rounded-lg hover:bg-purple-500 transition">
                                👤 Usuarios
                            </Link>
                        </li>
                        <li>
                            <Link href="/roles" className="block px-3 py-2 rounded-lg hover:bg-purple-500 transition">
                                🔑 Roles
                            </Link>
                        </li>
                        <li>
                            <Link href="/permisos" className="block px-3 py-2 rounded-lg hover:bg-purple-500 transition">
                                ⚙️ Permisos
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="p-4 border-t border-purple-500">
                    <button 
                        onClick={handleLogout} 
                        className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-semibold transition"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Panel de control</h2>
                
                {!stats ? (
                    <p className="text-gray-500">Cargando estadísticas...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card title="Categorías" value={stats.categorias} color="blue" />
                        <Card title="Productos" value={stats.productos} color="green" />
                        <Card title="Movimientos" value={stats.movimientos} color="yellow" />
                        <Card title="Usuarios" value={stats.usuarios} color="purple" />
                        <Card title="Roles" value={stats.roles} color="pink" />
                        <Card title="Permisos" value={stats.permisos} color="indigo" />
                    </div>
                )}
            </main>
        </div>
    );
}

function Card({ title, value, color }) {
    const colors = {
        blue: "from-blue-500 to-blue-700",
        green: "from-green-500 to-green-700",
        yellow: "from-yellow-500 to-yellow-700",
        purple: "from-purple-500 to-purple-700",
        pink: "from-pink-500 to-pink-700",
        indigo: "from-indigo-500 to-indigo-700",
    };

    return (
        <div
            className={`p-6 bg-gradient-to-r ${colors[color]} text-white rounded-xl shadow-md hover:scale-105 transition`}
        >
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}
