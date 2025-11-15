const express = require("express");
const router = express.Router();
const db = require("../db");

// 📌 Obtener todos los roles
router.get("/", (req, res) => {
    db.query("SELECT * FROM roles", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 📌 Crear un rol
router.post("/", (req, res) => {
    const { nombre_rol } = req.body;
    if (!nombre_rol) {
        return res.status(400).json({ error: "El nombre del rol es obligatorio" });
    }

    db.query("INSERT INTO roles (nombre_rol) VALUES (?)", [nombre_rol], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Rol creado correctamente", id: result.insertId });
    });
});

// 📌 Eliminar un rol
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM roles WHERE id_rol = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Rol no encontrado" });
        }
        res.json({ message: "Rol eliminado correctamente" });
    });
});

module.exports = router;
