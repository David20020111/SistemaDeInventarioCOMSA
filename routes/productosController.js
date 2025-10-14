const db = require("../db");

// Listar todos los productos
exports.listar = (req, res) => {
  db.query(
    `SELECT p.*, c.nombre AS categoria
     FROM Productos p
     JOIN Categorias c ON p.id_categoria = c.id_categoria`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// Obtener producto por ID
exports.obtener = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT * FROM Productos WHERE id_producto = ?`,
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ error: "Producto no encontrado" });
      res.json(results[0]);
    }
  );
};

// Crear producto
exports.crear = (req, res) => {
  const { codigo, nombre, id_categoria, stock_actual, stock_minimo, ubicacion } = req.body;

  if (!codigo || !nombre || !id_categoria)
    return res.status(400).json({ error: "Código, nombre y categoría son requeridos" });

  db.query(
    `INSERT INTO Productos (codigo, nombre, id_categoria, stock_actual, stock_minimo, ubicacion)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [codigo, nombre, id_categoria, stock_actual || 0, stock_minimo || 0, ubicacion || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id_producto: result.insertId, mensaje: "Producto creado" });
    }
  );
};

// Actualizar producto
exports.actualizar = (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, id_categoria, stock_actual, stock_minimo, ubicacion } = req.body;

  db.query(
    `UPDATE Productos
     SET codigo=?, nombre=?, id_categoria=?, stock_actual=?, stock_minimo=?, ubicacion=?
     WHERE id_producto=?`,
    [codigo, nombre, id_categoria, stock_actual, stock_minimo, ubicacion, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Producto no encontrado" });
      res.json({ mensaje: "Producto actualizado" });
    }
  );
};

// Eliminar producto
exports.eliminar = (req, res) => {
  const { id } = req.params;
  db.query(
    `DELETE FROM Productos WHERE id_producto=?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Producto no encontrado" });
      res.json({ mensaje: "Producto eliminado" });
    }
  );
};
