const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint para obtener estadísticas
router.get("/stats", (req, res) => {
  const queries = {
    categorias: "SELECT COUNT(*) AS total FROM Categorias",
    productos: "SELECT COUNT(*) AS total FROM Productos",
    movimientos: "SELECT COUNT(*) AS total FROM Movimientos",
    usuarios: "SELECT COUNT(*) AS total FROM Usuarios",
    roles: "SELECT COUNT(*) AS total FROM Roles",
    permisos: "SELECT COUNT(*) AS total FROM Permisos",
  };

  const results = {};

  // Ejecutamos todas las consultas en paralelo
  let completed = 0;
  for (let key in queries) {
    db.query(queries[key], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      results[key] = rows[0].total;
      completed++;

      if (completed === Object.keys(queries).length) {
        res.json(results);
      }
    });
  }
});

module.exports = router;