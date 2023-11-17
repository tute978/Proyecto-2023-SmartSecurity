const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();


var jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const connection = mysql.createPool(process.env.DATABASE_URL).promise();


router.use(cookieParser());

router.post('/register', async (req, res) => {

    const [row] =  await connection.query(`SELECT email FROM Users WHERE email = ?`, [req.body.email]);

    payload = {
        email: req.body.email
    };

    credential = loginRegister(payload, row, (row, credential) => {

        if(row.length != 0) {
            credential.message = "El correo ya esta registrado, por favor use otro";
            return credential;
        }
        if(!req.body.email.includes('@')){
            credential.message = "El email no es valido"
            return credential;
        }
        if(req.body.password != req.body.confirmPassword){
            credential.message = "Las contraseñas no coinciden";
            return credential;
        }
        if(!req.body.name || !req.body.surname){
            credential.message = "El nombre o el apellido no puede estar vacio";
            return credential;
        }

        credential.success = true;
        return credential;
    });

    if(credential.success) { 
        refreshToken = await updateRefreshToken({email: req.body.email});

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true
        });
npm 
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await connection.query('INSERT INTO Users (email, name, surname, password, refreshToken) VALUES (?, ?, ?, ?, ?)', [req.body.email, req.body.name, req.body.surname, hashedPassword, refreshToken]);
    }

    res.json(credential);
});

router.delete('/deleteAccount', authenticateToken, async (req, res) => {
    const [password] = await connection.query('SELECT password FROM Users WHERE email = ?', [req.user.email]);
    if(password.length === 0){
        res.sendStatus(403);
        return;
    }
    
    const passwordChecked = await comparePassword(req.user.email, req.body.password);

    if(!passwordChecked){
        res.sendStatus(403);
        return;
    }

    await connection.query('DELETE FROM Users WHERE email = ?', [req.user.email]);
    await connection.query('DELETE FROM Historial WHERE userEmail = ?', [req.user.email]);
    res.sendStatus(200);
});

router.get('/login', authenticateToken, (req, res) => {
    res.json(req.user);
});

router.post('/login', async (req, res) => {

    const [row] =  await connection.query(`SELECT password, email FROM Users WHERE email = ?`, [req.body.email]);
    passwordChecked = await comparePassword(req.body.email, req.body.password);
    payload = {
        email: req.body.email
    };

    credential = loginRegister(payload, row, (row, credential) => {

        if(row.length == 0) {
            credential.message = "El correo no existe";
            return credential;
        }
        if(!passwordChecked){
            credential.message = "La constraseña es incorrecta";
            return credential;
        }

        credential.success = true;
        return credential;
    });

    if(credential.success) res.cookie('refreshToken', await updateRefreshToken({email: req.body.email}), {
        httpOnly: true
    });

    res.json(credential);
});

router.delete('/logout', async (req, res) => {
    res.clearCookie('refreshToken');
    deleteRefreshToken(req.cookies.refreshToken);
    res.sendStatus(204);
});

router.get('/token', async (req, res) => { 
    const refreshToken = req.cookies.refreshToken;
    const [sqlRefreshToken] = await connection.query('SELECT refreshToken FROM Users WHERE refreshToken = ?', [refreshToken]);
    if(!refreshToken) return res.sendStatus(401);
    if(sqlRefreshToken.length == 0) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
        if(err) return res.sendStatus(403);

        res.cookie('refreshToken', await updateRefreshToken(payload), {
            httpOnly: true
        });

        res.json(generateAccessToken({
            email: payload.email
        }));
    });
});

router.get('/tablas', async (req, res) => {
    const [query] = await connection.query('SELECT * FROM Users');
    res.json(query);
});

async function comparePassword(email, password){
    const [query] = await connection.query('SELECT password FROM Users WHERE email = ?', [email]);
    if(query.length === 0){
        return false;
    } else {
        return await bcrypt.compare(password, query[0].password);
    }
}

function generateAccessToken(payload){
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
}

async function updateRefreshToken(payload){
    const user = {
        email: payload.email
    }
    
    refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '90d'});
    await connection.query('UPDATE Users SET refreshToken = ? WHERE email = ?', [refreshToken, user.email]);
    return refreshToken;
}

async function deleteRefreshToken(token){
    await connection.query('UPDATE Users SET refreshToken = NULL WHERE refreshToken = ?', [token]);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    //Si authHeader != "" o null, entonces asignarle el string del token
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err) return res.sendStatus(403);
        req.user = {
            email: payload.email
        };
        next();
    })
}

function loginRegister(payload, row, conditions){
    let credential = {
        success: false,
        message: null,
        accessToken: null
    };

    credential = conditions(row, credential);

    if(!credential.success){
        return credential;
    }

    credential.accessToken = generateAccessToken(payload);
    credential.message = "Inicio de sesion exitoso"

    return credential;
}

module.exports = {
    router,
    authenticateToken
};