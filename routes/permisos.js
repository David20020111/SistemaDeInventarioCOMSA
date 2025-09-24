const express = require('express');
const router = express.Router();
const db = require('../db');

//CRUD Permisos
router.get('/', (req, res) => {
    db.query('SELECT * FROM Permisos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    db.query('INSERT INTO Permisos (nombre_permiso) VALUES (?)', [req.body.nombre_permiso], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, nombre_permiso: req.body.nombre_permiso});
    });
});

router.put('/:id', (req, res) => {
    db.query('UPDATE Permisos SET nombre_permiso=? WHERE id_permiso=?', [req.body.nombre_permiso, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Permiso actualizado' });
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Permisos WHERE id_permiso=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Permiso eliminado '});
    });
});

module.exports = router;