const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar todas las categorías
router.get('/', (req, res) => {
  db.query('SELECT * FROM Categorias ORDER BY nombre ASC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Crear categoría
router.post('/', (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

  db.query(
    'INSERT INTO Categorias (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Categoría creada correctamente' });
    }
  );
});

// Editar categoría
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  db.query(
    'UPDATE Categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
    [nombre, descripcion, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Categoría actualizada correctamente' });
    }
  );
});

// Eliminar categoría
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Categorias WHERE id_categoria = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Categoría eliminada correctamente' });
  });
});

module.exports = router;
