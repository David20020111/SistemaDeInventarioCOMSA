const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
    const sql = `
        SELECT u.id_usuario, u.nombre, u.correo, r.id_rol, r.nombre_rol
        FROM Usuarios u
        JOIN Roles r ON u.id_rol = r.id_rol
    `;
    db.query(sql, (err, rows) => {
        if (err) {
            console.error("Error al obtener usuarios:", err);
            return res.status(500).json({ error: "Error al obtener usuarios" });
        }
        res.json(rows)
    });
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, contraseña, id_rol } = req.body;

    if (!nombre || !correo || !id_rol) {
        return res.status(400).json({ error: "Faltan datos Obligatorios" });
    }

    try {
        let sql, params;

        if (contraseña && contraseña.trim() !=="") {
            const hashedPassword = await bcrypt.hash(contraseña, 10);
            sql = `
                UPDATE Usuarios
                SET nombre = ?, correo = ?, contraseña = ?, id_rol = ? 
                WHERE id_usuario = ?
            `;
            params = [nombre, correo, hashedPassword, id_rol, id];
        } else {
            sql = `
                UPDATE Usuarios
                SET nombre = ?, correo = ?, id_rol = ?
                WHERE id_usuario = ?
            `;
            params = [nombre, correo, id_rol, id_rol];
        }

        db.query(sql, params, (err) => {
            if (err) {
                console.error("Error al actualizar usuario:", err);
                return res.status(500).json({ error: "Error al actualizar al usuario" })
            }
            res.json({ message: "Usuario actualizado correctamente" });
        });
    } catch (err) {
        console.error("Error al encriptar contraseña:", err);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM Usuarios WHERE id_usuario = ?", [id], (err) => {
        if (err) {
            console.error("Error al eliminar usuario:", err);
            return res.status(500).json({ error: "Error al eliminar usuario" });
        }
        res.json({ message: "Usuario eliminado correctamente" });
    });
});

module.exports = router;