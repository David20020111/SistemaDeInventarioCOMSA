const express = require('express');
const router = express.Router();
const db = require('../db');

// CRUD Productos
router.get('/', (req, res) => {
    db.query('SELECT * FROM Productos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { codigo, nombre, id_categoria, stock_actual, stock_minimo, ubicacion } = req.body
    db.query('INSER INTO Productos (codigo, nombre, id_categoria, stock_actual, stock_minimo, ubocacion) VALUES (?, ?, ?, ?, ?, ?)',
        [codigo, nombre, id_categoria, stock_actual, stock_minimo,ubicacion],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, codigo, nombre });
        }
    );
});

router.put('/:id', (req, res) => {
    const { codigo, nombre, id_categoria, stock_actual, stock_minimo, ubicacion } = req.body;
    db.query('UPDATE Productos SET codigo=?, nombre=?, id_categoria=?, stock_actual=?, stock_minimo=?, ubicacion=? WHERE id_producto',
        [codigo, nombre, id_categoria, stock_actual, stock_minimo, ubicacion, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Producto actualizado' });
        }
    );
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Productos WHERE id_producto=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Producto eliminado' });
    });
});

// Vista inventario bajo
router.get('/vista/inventario_bajo', (req, res) => {
    db.query('SELECT * FROM vista_inventario_bajo', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Reporte de inventario
router.get('/reporte', (req, res) => {
    db.query('CALL reporteInventario()', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// Movimientos por producto 
router.get('/:id/movimientos', (req, res) => {
    db.query('CALL reporteMovimientoProducto(?)', [req.params.id], (err, results)  =>{
        if (err) res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// Registrar entrada 
router.post('/:id/entrada', (req, res) => {
    const { cantidad, id_usuario } = req.body;
    db.query('CALL registrarEntrada(?, ?, ?)', [req.params.id, cantidad, id_usuario], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Entrada registrada' });
    });
});

// Registrar salida 
router.post('/:id/salida', (req, res) => {
    const { cantidad, id_usuario } = req.body;
    db.query('CALL registrarSalida(?, ?, ?)', [req.params.id, cantidad, id_usuario], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Salida registrada' })
    });
});

module.exports = router;