const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'metro.proxy.rlwy.net', 
    port: process.env.DB_PORT || '35505',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'ABfJQBCJvkqYMYRBbYmzXgISgZxYiZYn',
    database: process.env.DB_NAME || 'railway',
    multipleStatements: true
});



module.exports = db;