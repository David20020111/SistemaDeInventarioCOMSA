// routes/reportes.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Reporte de inventario con filtros opcionales
router.get("/inventario", (req, res) => {
  const { categoria, stock, nombre } = req.query;

  let query = `
    SELECT p.codigo, p.nombre, c.nombre AS categoria, 
           p.stock_actual, p.stock_minimo, p.ubicacion
    FROM Productos p
    JOIN Categorias c ON p.id_categoria = c.id_categoria
    WHERE 1=1
  `;
  const params = [];

  if (categoria) {
    query += " AND c.nombre LIKE ?";
    params.push(`%${categoria}%`);
  }

  if (nombre) {
    query += " AND p.nombre LIKE ?";
    params.push(`%${nombre}%`);
  }

  if (stock === "bajo") {
    query += " AND p.stock_actual < p.stock_minimo";
  } else if (stock === "normal") {
    query += " AND p.stock_actual >= p.stock_minimo";
  }

  query += "ORDER BY p.nombre ASC"

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error ejecutando reporte inventario: ", err);
      return res.status(500).json({ error: "Error al generar reporte" });
    }
    res.json(results);
  });
});

module.exports = router;
