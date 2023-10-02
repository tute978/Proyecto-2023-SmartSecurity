require('dotenv').config();
const express = require('express');
var jwt = require('jsonwebtoken');
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

app.get('/tablas', async (req, res) => {
    const [query] = await connection.query('SELECT * FROM Users');
    res.json(query);
})

app.get('/login', authenticateToken, (req, res) => {
    res.json(req.user);
});

app.post('/login', async (req, res) => {
    let success = false;
    let message;
    let accessToken = "";
    let refreshToken = "";

    const [row] =  await connection.query(`SELECT password, email FROM Users WHERE email = ?`, [req.body.email]);

    if(row.length != 0) {
        if(req.body.password == row[0].password){
            const user = {
                email: row[0].email,
                password: row[0].password
            };

            success = true;
            message = "Inicio de sesion exitoso";

            accessToken = generateAccessToken(user, '15s');
            refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
            console.log(refreshToken);
            await connection.query('UPDATE Users SET refreshToken = ? WHERE email = ?', [refreshToken, row[0].email]);
        } else {
            success = false;
            message = "La constraseña es incorrecta";
        }
    }
    else {
        message = "El correo no existe";
    }

    res.json({
        success: success,
        message: message,
        accessToken: accessToken,
        refreshToken: refreshToken
    });
});

app.delete('/logout', async (req, res) => {
    const query = await connection.query('UPDATE Users SET refreshToken = NULL WHERE refreshToken = ?', [req.body.token]);
    res.sendStatus(204);
});

app.post('/token', async (req, res) => {
    const refreshToken = req.body.refreshToken;
    const [sqlRefreshToken] = await connection.query('SELECT refreshToken FROM Users WHERE refreshToken = ?', [refreshToken]);
    if(!refreshToken) return res.sendStatus(401);
    if(sqlRefreshToken.length == 0) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if(err) return res.sendStatus(403);

        res.json(generateAccessToken({
            email: payload.email,
            password: payload.password
        }, '15s'));

    })

});

app.listen(3000, () => console.log("Server listening on port 3000"));

function generateAccessToken(payload, expireTime){
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: expireTime});
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    //Si authHeader != "" o null, entonces asignarle el string del token
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err) return res.sendStatus(403);
        req.user = {
            email: payload.email,
            password: payload.password
        };
        next();
    })
}

// const checkBannedChars = (string, array) => {
//     for(let i = 0; i < array.length; i++){
//         if (string.includes(array[i])) return true;
//     }
// }