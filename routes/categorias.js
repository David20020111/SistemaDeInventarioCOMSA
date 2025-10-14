// routes/categorias.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // tu conexión mysql2
const { authenticateToken, requireAdmin } = require("../authMiddleware");

// GET /categorias  -> listar todas
router.get("/", (req, res) => {
  db.query("SELECT id_categoria, nombre, descripcion FROM Categorias ORDER BY nombre", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /categorias/:id -> obtener 1
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT id_categoria, nombre, descripcion FROM Categorias WHERE id_categoria = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(rows[0]);
  });
});

// POST /categorias -> crear (admin)
router.post("/", (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre || nombre.trim() === "") return res.status(400).json({ error: "El nombre es requerido" });

  db.query("INSERT INTO Categorias (nombre, descripcion) VALUES (?, ?)", [nombre.trim(), descripcion || null], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "Ya existe una categoría con ese nombre" });
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id_categoria: result.insertId, nombre: nombre.trim(), descripcion: descripcion || null });
  });
});

// PUT /categorias/:id -> actualizar (admin)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  if (!nombre || nombre.trim() === "") return res.status(400).json({ error: "El nombre es requerido" });

  db.query(
    "UPDATE Categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?",
    [nombre.trim(), descripcion || null, id],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "Ya existe una categoría con ese nombre" });
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) return res.status(404).json({ error: "Categoría no encontrada" });
      res.json({ message: "Categoría actualizada" });
    }
  );
});

// DELETE /categorias/:id -> eliminar (admin)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM Categorias WHERE id_categoria = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json({ message: "Categoría eliminada" });
  });
});

module.exports = router;
