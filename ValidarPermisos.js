const db = require("../API prueba/db")

const validarPermiso = (modulo, accion) => {
    return (req, res, next) => {
        const idUsuario = req.user.id_usuario;

        db.query(
            `SELECT rp.*
            JOIN Roles_Permisos rp
            JOIN Permisos p ON rp.id_permiso = p.id_permiso
            JOIN Usuarios u ON u.id_rol = rp.id_rol
            WHERE u.id_usuario = ? AND p.nombre_modulo = ?`,
            [idUsuario, modulo],
            (err, results) => {
                if (err) {
                    console.error("ERROR Validando Permiso", err);
                    return res.status(500).json({ error: "Error interno en el servidor" });
                }

                if (results.length === 0) {
                    return res.status(403).json({ error: "No tienes acceso a este modulo" });
                }

                const permiso = results[0];
                if (!permiso[`puede_${accion}`]) {
                    return res.status(403).json({ error: `No tienes permiso para ${accion}` })
                }

                next();
            }
        );
    };
};

module.exports = validarPermiso;