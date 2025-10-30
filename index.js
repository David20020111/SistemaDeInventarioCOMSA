const express = require('express');
const cors = require('cors');
require ('dotenv').config();

const app = express();

app.use(cors({
    origin: '*'
}))

app.use(express.json());

//rutas
app.use('/usuarios', require('./routes/usuarios'));
app.use('/roles', require('./routes/roles'));
app.use('/permisos', require('./routes/permisos'));
app.use('/categorias', require('./routes/categorias'));
app.use('/productos', require('./routes/productos'));
app.use('/movimientos', require('./routes/movimientos'));
app.use('/', require('./routes/authRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/inventario', require('./routes/inventario'));
app.use('/reportes', require('./routes/reportes'))


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 servidor corriendo en http://localhost:${PORT}`)
})

