const express = require('express');
const router = express.Router();
const db = require('../db');

// CRUD Catgorias
router.get('/', (req, res) => {
    db.query('SELECT * FROM Categorias', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    db.query('INSERT INTO Categorias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, nombre, descripcion });
    });
});

router.put('/:id', (req, res) => {
    db.query('UPDATE Categorias SET nombre=?, descripcion=? WHERE id_categoria=?', [nombre, descripcion, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json( {message: 'Categoria actualizada' });
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELATE FROM Categorias WHERE id_categorias=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Categoria Eliminada' })
    });
});

module.exports = router;