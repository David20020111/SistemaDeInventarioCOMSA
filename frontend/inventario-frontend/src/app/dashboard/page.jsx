"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

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
        <div className="min-h-screen flex bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-black to-gray-900 text-white flex flex-col shadow-xl">
                <div className="flex items-center justify-center flex-col p-6 border-b border-gray-700">
                    <div className="w-25 h-25 mb-1">
                        <img
                            src="/logoComsa.png"
                            alt="COMSA"
                            width={100}
                            height={100}
                            className="rounded-full object-contain"
                        />
                    </div>
                    <p className="text-sm text-gray-400">Bienvenido</p>
                </div>

                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <MenuItem href="/reporte-inventario" icon="📊" text="Reporte de inventario" />
                        <MenuItem href="/categorias" icon="📦" text="Categorías" />
                        <MenuItem href="/productos" icon="🧰" text="Materiales" />
                        <MenuItem href="/movimientos" icon="🔄" text="Movimientos" />
                        <MenuItem href="/usuarios" icon="👤" text="Usuarios" />
                        <MenuItem href="/roles" icon="🔑" text="Roles" />
                        <MenuItem href="/permisos" icon="⚙️" text="Permisos" />
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8 bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Panel de control</h2>
                
                {!stats ? (
                    <p className="text-gray-500">Cargando estadísticas...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card title="Categorías" value={stats.categorias} color="red" />
                        <Card title="Materiales" value={stats.productos} color="gray" />
                        <Card title="Movimientos" value={stats.movimientos} color="dark" />
                        <Card title="Usuarios" value={stats.usuarios} color="black" />
                        <Card title="Roles" value={stats.roles} color="red" />
                        <Card title="Permisos" value={stats.permisos} color="gray" />
                    </div>
                )}
            </main>
        </div>
    );
}

function Card({title, value, color}) {
    const colors = {
        red: "from-red-600 to-red-800",
        gray: "from-gray-600 to-gray-800",
        dark: "from-black to-gray-800",
        black: "from-gray-900 to-black",
    };

    return (
        <div
            className={`p-6 bg-gradient-to-r ${colors[color]} text-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-200`}
        >
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}

function MenuItem({ href, icon, text }) {
    return (
        <li>
            <Link
                href={href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
                <span>{icon}</span>
                <span>{text}</span>
            </Link>
        </li>
    );
}
