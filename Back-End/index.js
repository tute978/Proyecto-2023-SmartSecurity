require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Middleware personalizado para habilitar CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Cambia esto al dominio que deseas permitir
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE'); // Métodos HTTP permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Cabeceras permitidas
    next();
});

app.use('/', require('./Routers/authentication'));

//-----------------------------------------------------------------------------------------------------------

app.listen(3000, () => console.log("Server listening on port 3000"));