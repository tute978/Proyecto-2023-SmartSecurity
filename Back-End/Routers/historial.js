const express = require('express');
const router = express.Router();
const authenticateToken = require('./authentication').authenticateToken;

const mysql = require('mysql2');
const connection = mysql.createPool(process.env.DATABASE_URL).promise();

router.post('/card/register', async (req, res) => {
    const [query] = await connection.query('SELECT id FROM Cards WHERE id = ?', [req.body.id]);
    if(query.length != 0){
        res.status(400).send("El id de la tarjeta que se intenta registrar ya existe");
        return;
    }

    if(!req.body.name || !req.body.surname){
        res.status(400).send("El nombre o el apellido no pueden estar vacios");
        return;
    }

    if(req.body.isFingerPrint === null){
        res.status(400).send("isFingerPrint no puede estar vacio");
        return
    }

    await connection.query('INSERT INTO Cards (id, name, surname, isFingerPrint) VALUES (?, ?, ?, ?)', [req.body.id, req.body.name, req.body.surname, req.body.isFingerPrint]);
    res.sendStatus(200);
});

router.delete('/card/delete', async (req, res) => {
    const [query] = await connection.query('SELECT id FROM Cards WHERE id = ?', [req.body.id]);
    if(query.length === 0){
        res.status(400).json({message: "El id de la tarjeta que se intenta eliminar no existe"});
        return;
    }

    await connection.query('DELETE FROM Cards WHERE id = ?', [req.body.id]);
    res.sendStatus(200);
});

router.get('/card', async (req,res) => {
    const [query] = await connection.query('SELECT id, name, surname FROM Cards WHERE isFingerPrint = ?', [false]);
    res.status(200).json(query);
});

router.get('/card/finger-print', async (req, res) => {
    const [query] = await connection.query('SELECT id, name, surname FROM Cards WHERE isFingerPrint = ?', [true]);
    res.status(200).json(query);
});

router.get('/register', authenticateToken, async (req, res) => {
    const [query] = await connection.query('SELECT Historial.id AS historial_id, hour, description, name, surname FROM Historial INNER JOIN Cards ON Historial.idCard = Cards.id WHERE userEmail = ?', [req.user.email])
    if(query.length === 0){
        res.status(404).send("No se hayaron registros");
        return
    }

    let registers = [];

    for(register of query){
        registers.push({
            id: register.historial_id,
            hour: register.hour,
            description: register.description = `${register.name} ${register.surname} ${register.description}`
        });
    }

    res.status(200).json(registers);
});

router.post('/register/create', async (req, res) => {
    const [query] = await connection.query('SELECT id FROM Cards WHERE id = ?', [req.body.idCard]);
    if(query.length === 0){
        res.status(400).json({message: "El id de la tarjeta que se intenta registrar no existe"});
        return;
    }

    const [query1] = await connection.query('SELECT email FROM Users WHERE email = ?', [req.body.ownerEmail])
    if(query1.length === 0){
        res.status(400).json({message: "El ususario al que se le intenta asignar un registro no existe"});
        return;
    }

    const description = "ingreso";

    let date = new Date().toLocaleString().slice(0, 16);
    await connection.query('INSERT INTO Historial (idCard, userEmail, hour, description) VALUES (?, ?, ?, ?)', [req.body.idCard, req.body.ownerEmail, date, description]);

    res.sendStatus(200);
});

router.post('/register/delete', async (req, res) => {
    const [query] = await connection.query('SELECT id FROM Historial WHERE id = ?', [req.body.id]);
    if(query.length === 0){
        res.status(400).json({
            success: false,
            message: 'El id del registro no existe'
        });
        return;
    }

    await connection.query('DELETE FROM Historial WHERE id = ?', [req.body.id]);
    res.status(200).json({
        success: true,
        message: 'El registro fue eliminado correctamente'
    })
});

router.get('/tabla', async (req, res) => {
    const [query] = await connection.query('SELECT * FROM Historial');
    res.json(query);
});

module.exports = router;