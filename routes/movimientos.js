const express = require('express');
const router = express.Router();
const db = require('../db');

// CRUD Movimientos 
router.get('/', (req, res) => {
    db.query('SELECT * FROM Movimientos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Ultimos movimientos
router.get('/vista/ultimos', (req, res) => {
    db.query('SELECT * FROM vista_ultimos_movimientos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Movimientos diarios 
router.get('/vista/diarios', (req, res) => {
    db.query('SELECT * FROM vista_movimientos_diarios', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;