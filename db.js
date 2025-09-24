const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost', 
    port:'3306',
    user: 'root',
    password: 'Root123',
    database: 'inventario_empresa_comsa2'
});

db.connect(err => {
    if (err) {
        console.error('Error de conexion:', err);
    } else {
        console.log('conectando a MySQL - inventario_empresa_comsa2');
    }
});

module.exports = db;