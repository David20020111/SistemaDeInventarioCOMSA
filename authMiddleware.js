const jwt = require('jsonwebtoken');
const db = require('./db');
const JWT_SECRET = process.env.JWT_SECRET || 'mi_super_secreto';


//verificar token 
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    
    const parts = authHeader.split(' ');
    if (parts.lenght !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Formato invalido de token' })
    }

    const token = parts[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        db.query( 'SELECT id_usuario, nombre, correo, id_rol FROM Usuarios WHERE id_usuario = ?',
            [payload.id],
            (err, results) => {
                if (err) return res.status(500).json({ error: 'Error en la base de datos' });

                if (!results || results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

                req.user = results[0];
                next();
            }
         );
    } catch (err) {
        return res.status(401).json({ error: 'token invalido o expirado' });
    }
}

//verificar rol admin
function requireAdmin (req, res, next) {
    const ADMIN_ROLE_ID = 1;

    if (!req.user || req.user.id_rol !== ADMIN_ROLE_ID) {
        return res.status(403).json({ error: 'Acceso denegado requiero rol admin' })
    }
    next()
}

module.exports = {authenticateToken, requireAdmin};