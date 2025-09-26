const express = require('express');
const cors = require('cors');
const app = express();
require ('dotenv').config();

app.use(cors());
app.use(express.json());

//rutas
app.use('/usuarios', require('./routes/usuarios'));
app.use('/roles', require('./routes/roles'));
app.use('/permisos', require('./routes/permisos'));
app.use('/categorias', require('./routes/categorias'));
app.use('/productos', require('./routes/productos'));
app.use('/movimientos', require('./routes/movimientos'));
app.use('/', require('./routes/authRoutes'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

