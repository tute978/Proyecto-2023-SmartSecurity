require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    const user = {name: req.body.name, password: req.body.password};
    users.push(user);
    res.status(201).send();
});

app.listen(3000);

const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DATABASE_URL);
console.log('Connected to PlanetScale!');
connection.end();