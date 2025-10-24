const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar productos con su categoría
router.get('/', (req, res) => {
  const sql = `
    SELECT p.id_producto, p.codigo, p.nombre, c.nombre AS categoria, 
           p.stock_actual, p.stock_minimo, p.ubicacion
    FROM Productos p
    JOIN Categorias c ON p.id_categoria = c.id_categoria
    ORDER BY p.nombre ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Crear producto
router.post('/', (req, res) => {
  const { codigo, nombre, id_categoria, stock_actual, stock_minimo, ubicacion } = req.body;
  if (!codigo || !nombre || !id_categoria)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });

  db.query(
    `INSERT INTO Productos (codigo, nombre, id_categoria, stock_actual, stock_minimo, ubicacion)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [codigo, nombre, id_categoria, stock_actual || 0, stock_minimo || 0, ubicacion || ''],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Producto agregado correctamente' });
    }
  );
});

// Actualizar producto
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, id_categoria, stock_actual, stock_minimo, ubicacion } = req.body;

  const sql = `
    UPDATE Productos 
    SET codigo=?, nombre=?, id_categoria=?, stock_actual=?, stock_minimo=?, ubicacion=?
    WHERE id_producto=?
  `;

  db.query(sql, [codigo, nombre, id_categoria, stock_actual, stock_minimo, ubicacion, id], (err, result) => {
    if (err) {
      console.error("❌ Error actualizando producto:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json({ message: "Producto actualizado correctamente" });
  });
});

// Eliminar producto
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Productos WHERE id_producto = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Producto eliminado correctamente' });
  });
});

module.exports = router;
