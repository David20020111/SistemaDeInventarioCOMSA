// routes/movimientos.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Crear movimiento (entrada/salida)
router.post("/", (req, res) => {
  const { id_producto, tipo, cantidad, detalle, id_usuario } = req.body;

  if (!id_producto || !tipo || !cantidad || !id_usuario) {
    return res.status(400).json({ error: "Faltan datos en la petición" });
  }

  // 1. Insertar en Movimientos con detalle
  db.query(
    "INSERT INTO movimientos (id_producto, tipo, cantidad, detalle, fecha, id_usuario) VALUES (?, ?, ?, ?, NOW(), ?)",
    [id_producto, tipo, cantidad, detalle || null, id_usuario],
    (err, result) => {
      if (err) {
        console.error("Error al registrar movimiento:", err);
        return res.status(500).json({ error: "Error al registrar movimiento" });
      }

      // 2. Actualizar stock del producto
      const updateQuery =
        tipo === "entrada"
          ? "UPDATE Productos SET stock_actual = stock_actual + ? WHERE id_producto = ?"
          : "UPDATE Productos SET stock_actual = stock_actual - ? WHERE id_producto = ?";

      db.query(updateQuery, [cantidad, id_producto], (err2) => {
        if (err2) {
          console.error("Error al actualizar stock:", err2);
          return res.status(500).json({ error: "Error al actualizar stock" });
        }
        res.json({ message: "Movimiento registrado correctamente" });
      });
    }
  );
});

// Listar movimientos con detalle y usuario
router.get("/", (req, res) => {
  const { producto, usuario, fechaInicio, fechaFin } = req.query;

  let sql = `
    SELECT m.id_movimiento, p.nombre AS producto, m.tipo, m.cantidad, m.detalle,
           m.fecha, u.nombre AS usuario
    FROM movimientos m
    JOIN productos p ON m.id_producto = p.id_producto
    JOIN usuarios u ON m.id_usuario = u.id_usuario
    WHERE 1=1
  `;
  const params = [];

  if (producto) {
    sql += " AND p.nombre LIKE ?";
    params.push(`%${producto}%`);
  }

  if (usuario) {
    sql += " AND u.nombre LIKE ?";
    params.push(`%${usuario}%`);
  }

  if (fechaInicio && fechaFin) {
    sql += " AND DATE(m.fecha) BETWEEN ? AND ?";
    params.push(fechaInicio, fechaFin);
  }

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("Error al obtener movimientos:", err);
      return res.status(500).json({ error: "Error al obtener movimientos" });
    }
    res.json(rows);
  });
});

module.exports = router;
