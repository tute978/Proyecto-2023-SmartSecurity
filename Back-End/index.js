require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const connection = mysql.createPool(process.env.DATABASE_URL).promise();
const app = express();

app.use(express.json());

// Middleware personalizado para habilitar CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Cambia esto al dominio que deseas permitir
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE'); // Métodos HTTP permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Cabeceras permitidas
    next();
});

//-----------------------------------------------------------------------------------------------------------

app.get('/users', async (req, res) => {
    const [row] =  await connection.query('SELECT * FROM Users');
    res.json(row);
});

app.post('/users', async (req, res) => {
    let success = false;
    let message;

    const [row] =  await connection.query(`SELECT password FROM Users WHERE email = ?`, [req.body.email]);

    if(row.length != 0) {
        if(req.body.password == row[0].password){
            success = true;
            message = "Inicio de sesion exitoso";
        } else {
            success = false;
            message = "La constraseña es incorrecta";
        }
    }
    else {
        message = "El correo no existe";
    }

    // res.json({
    //     success: success,
    //     message: message,
    //     user: {
    //         email: req.body.email
    //     }
    // });

    res.json(req.body);
});

app.listen(3000);
console.log('Connected to PlanetScale!');
//connection.end();

// const checkBannedChars = (string, array) => {
//     for(let i = 0; i < array.length; i++){
//         if (string.includes(array[i])) return true;
//     }
// }