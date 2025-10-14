"use client";
import { useEffect, useState } from "react";

export default function UsuarioPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState ({
        id_usuario: null,
        nombre: "",
        correo: "",
        contraseña: "",
        id_rol: "",
    });
    const [modoEditar, setModoEditar] = useState(false);

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);

    async function fetchUsuarios() {
        const res = await fetch("http://localhost:3000/usuarios");
        const data = await res.json();
        setUsuarios(data);
    }

    async function fetchRoles() {
        const res = await fetch("http://localhost:3000/roles");
        const data = await res.json();
        setRoles(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const url = `http://localhost:3000/usuarios/${form.id_usuario}`;

        const res = await fetch(url, {
            method: "PUT", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        alert(data.message || data.error);
        setForm({ id_usuario: null, nombre: "", correo: "", contraseña: "", id_rol: ""});
        setModoEditar(false);
        fetchUsuarios();
    }

    async function handleDelete(id) {
        if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;
        const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        alert(data.message);
        fetchUsuarios();
    }

    function handleEdit(usuario) {
        setForm({
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            contraseña: "",
            id_rol: usuario.id_rol,
        });
        setModoEditar(true);
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">👤 Gestión de Usuarios</h2>
            
            {/* Formulario de Edicion */}
            {modoEditar && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow p-4 rounded mb-6 space-y-3"
                >
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Correo"
                        value={form.correo}
                        onChange={(e) => setForm({ ...form, correo: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Nueva ontraseña (Opcional)"
                        value={form.contraseña}
                        onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
                        className="border p-2 rounded w-full"
                    />

                    <select
                        value={form.id_rol}
                        onChange={(e) => setForm({ ...form, id_rol: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    >
                        <option value="">Seleccione un rol</option>
                        {roles.map((r) => (
                            <option key={r.id_rol} value={r.id_rol}>
                                {r.nombre_rol}
                            </option>
                        ))}
                    </select>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded">
                        💾 Guardar Cambios
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setForm({ id_usuario: null, nombre: "", correo: "", contraseña: "", id_rol: "" });
                            setModoEditar(false);
                        }}
                        className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                </form>
            )}

            {/* Tabla de usuarios */}
            <div className="bg-white shadow rounded p-4">
                <h3 className="text-lg font-bold mb-3">📋 Lista de Usuarios Registrados</h3>
                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">Nombre</th>
                            <th className="p-2 text-left">Correo</th>
                            <th className="p-2 text-left">Rol</th>
                            <th className="p-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id_usuario} className="border-t hover:bg-gray-50">
                                <td className="p-2">{u.id_usuario}</td>
                                <td className="p-2">{u.nombre}</td>
                                <td className="p-2">{u.correo}</td>
                                <td className="p-2">{u.nombre_rol}</td>
                                <td className="p-2 space-x-2">
                                    <button 
                                    onClick={() => handleEdit(u)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => handleDelete(u.id_usuario)}
                                        className="bg-red-600 text-white px-2 py-1 rounded"
                                    >
                                        Eliminar 
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}