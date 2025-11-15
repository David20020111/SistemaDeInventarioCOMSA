const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateToken } = require('../authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_super_secreto';

// Registro de usuario
// =======================
router.post('/register', async (req, res) => {
  const { nombre, correo, contraseña, id_rol } = req.body;

  if (!nombre || !correo || !contraseña) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Si no envían rol, asignar por defecto rol 2 (usuario normal)
    const rol = id_rol || 2;

    db.query(
      'INSERT INTO usuarios (nombre, correo, contraseña, id_rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hashedPassword, rol],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al registrar usuario' });
        }
        res.status(201).json({ message: 'Usuario registrado correctamente' });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Registro de usuario
// =======================
router.post('/login', (req, res) => {
  const { correo, contraseña } = req.body; 
  
  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  } 

  db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) =>{
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const usuario = results[0];

    //comparar contraseña
    const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    //Crear JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, id_rol: usuario.id_rol },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        id_rol: usuario.id_rol
      }
    });
  });
});

//validar token / obtener datos usuarios actual
// =========================
router.get('/usuarios/me', authenticateToken, (req, res) =>{
  res.json(req.user);
});

module.exports = router;