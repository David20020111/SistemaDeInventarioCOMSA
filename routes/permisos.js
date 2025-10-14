const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
    db.query("SELECT id_permiso, nombre_modulo FROM Permisos ORDER BY id_permiso", (err, rows) => {
        if (err) {
            console.error("Error al obtener permisos:", err);
            return res.status(500).json({ error: "Error al obtener permisos" });
        }
        res.json(rows);
    });
});

router.get("/rol/:id_rol", (req, res) => {
    const { id_rol } = req.params;
    const sql = `
        SELECT p.id_permiso, p.nombre_modulo,
            IFNULL(rp.puede_ver, 0) AS puede_ver,
            IFNULL(rp.puede_crear, 0) AS puede_crear,
            IFNULL(rp.puede_editar, 0) AS puede_editar,
            IFNULL(rp.puede_eliminar, 0) AS puede_eliminar
        FROM Permisos p
        LEFT JOIN Roles_Permisos rp ON p.id_permiso = rp.id_permiso AND rp.id_rol = ?
        ORDER BY p.id_permiso
    `;
    db.query(sql, [id_rol], (err, rows) => {
        if (err) {
            console.error("Error al obtener permisos por rol", err);
            return res.status(500).json({ error: "Error al obtener permisos por rol" });
        }
        res.json(rows);
    });
});

router.post("/asignar", (req, res) => {
    const { id_rol, id_permiso, puede_ver, puede_crear, puede_editar, puede_eliminar } = req.body;
    if (!id_rol || !id_permiso) {
        return res.status(400).json({ error: "id_rol e id_permiso son obligatorios" });
    }

    const sql = `
        INSERT INTO Roles_Permisos (id_rol, id_permiso, puede_ver, puede_crear, puede_editar, puede_eliminar)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            puede_ver = VALUES(puede_ver),
            puede_crear = VALUES(puede_crear),
            puede_editar = VALUES(puede_editar),
            puede_eliminar = VALUES(puede_eliminar)
    `;
    const params = [
        id_rol,
        id_permiso,
        puede_ver ? 1 : 0,
        puede_crear ? 1 : 0,
        puede_editar ? 1 : 0,
        puede_eliminar ? 1 : 0,
    ];

    db.query(sql,params, (err, result) => {
        if (err) {
            console.error("Error al asignar permisos", err);
            return res.status(500).json({ error: "Error al asignar permisos" });
        }
        res.json({ message: "Permiso asignado/actualizado" });
    });
});

router.delete("/rol/:id_rol/permiso/:id_permiso", (req, res) => {
    const { id_rol, id_permiso } = req.params;
    db.query("DELETE FROM Roles_Permisos WHERE id_rol = ? AND id_permiso = ?", [id_rol, id_permiso], (err) => {
        if (err) {
            console.error("Error al eliminar el permiso del rol:", err);
            return res.status(500).json({ error: "Error al eliminar permiso del rol" });
        }
        res.json({ message: "Asignacion eliminada" })
    });
});

module.exports = router;