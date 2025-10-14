const express =  require('express');
const router = express.Router();
const db = require('../db');

//lista los productos cuyo stock_actual < stock_minimo
router.get('/bajo', (res, req) => {
    db.query('SELECT * FROM vista_inventario_bajo', (err, rows) => {
        if (err) {
            console.error('Error al consultar vista_inventario_bajo', err);
            return res.status(500).json({ error: 'error al obtener inventario bajo' });
        }
        res.json(rows);
    });
});

// devuelve la cantidad para el badge
router.get('bajo/cout', (req, res) => {
    db.query('SELECT * FROM vista_inventario_bajo', (err, rows) => {
        if (err) {
            console.error('Error al contar vista_inventario_bajo', err);
            return res.status(500).json({ error: 'Error al obtener contador' });
        }
        res.json({ total: rows[0].total });
    });
});

module.exports = router;