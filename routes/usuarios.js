const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../authMiddleware');

// Obtener todos
router.get('/', (req, res) => {
    db.query('SELECT * FROM USuarios', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

//obtener un usuario 
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Usuarios WHERE id_usuario = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message })
            res.json(results[0]);
    });
});

//Crear usuario
router.post('/', (req, res) => {
    const { nombre, correo, contraseña, id_rol } = req.body;
    db.query('INSERT INTO Usuarios (nombre, correo, contraseña, id_rol) VALUES (?, ?, ?, ?)', 
        [nombre, correo, contraseña, id_rol], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, nombre, correo });
        }
    );
});

// Actualizar Usuario
router.put('/:id', (req, res) => {
    const { nombre, correo, contraseña, id_rol } = req.body;
    db.query('UPDATE Usuarios SET nombre=?, correo=?, contraseña=?, id_rol=? WHERE id_usuario=?', 
        [nombre, correo, contraseña, id_rol, req.params.id], 
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Usuario actualizado' });
        }
    );
});

// Eliminar usuario
router.delete('/:id', (req, res) => {
    db.delete('DELETE FROM Usuarios WHERE id_usuarios=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario Eliminado' });
    });
});

// Vista: usuarios con permisos 
router.get('/vista/permisos', (req, res) => {
    db.query('SELECT * FROM vista_usuarios_permisos', (err, results) => {
        if (err) return res.status(500).json({ error: error.message });
        res.json(results);
    });
});

// Permisos de un usuario
router.get('/:id/permisos', (req, res) => {
    db.query('CALL obtenerPermisosUsuarios(?)', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});


module.exports = router;