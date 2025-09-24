const express = require('express');
const router = express.Router();
const db = require('../db');

// CRUD Roles
router.get('/', (req, res) => {
    db.query('SELECT * FROM Roles', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    db.query('INSERT INTO Roles (nombre_rol) VALUES (?)', [req.body.nombre_rol], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, nombre_rol: req.body.nombre_rol });
    });
});

router.put('/:id', (req, res) =>{
    db.query('UPDATE Roles SET nombre_rol=? WHERE id_rol=?', [req.body.nombre_rol, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Rol actualizado' });
    });
});

router.delete('/id', (req, res) =>{
    db.query('DELETE FROM Roles WHERE id_rol=?', [req.params.id], (err) => {
        if(err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Rol Eliminado' });
    });
});

// Vista
router.get('/vista/permisos', (req, res) => {
    db.query('SELECT * FROM vista_roles_permisos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

//Procedure
router.get('/:id/permisos', (req, res) => {
    db.query('CALL obtenerPermisoRol(?)', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

router.post('/:idRol/permisos/:idPermiso', (req, res) => {
    db.query('CALL asignarPermisoRol(?, ?)', [req.params.idRol, req.params.idPermiso], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Permiso Asignado' });
    });
});

router.delete('/:idRol/permisos/:idPermiso', (req, res) => {
    db.query('CALL quitarPermisoRol(?, ?)', [req.params.idRol, req.params.idPermiso], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({message: 'Permiso quitado' });
    });
});

module.exports = router;