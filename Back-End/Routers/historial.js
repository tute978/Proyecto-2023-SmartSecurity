const express = require('express');
const router = express.Router();
const authenticateToken = require('./authentication').authenticateToken;
const childProcess = require('child_process');

const mysql = require('mysql2');
const connection = mysql.createPool(process.env.DATABASE_URL).promise();

router.post('/card/register', authenticateToken, async (req, res) => {
    if(!req.body.id) return res.status(400).send("El id no puede estar vacio");

    const [query] = await connection.query('SELECT id FROM Cards WHERE id = ?', [req.body.id]);
    if(query.length != 0){
        res.status(400).send("El id de la tarjeta que se intenta registrar ya existe");
        return;
    }

    const [query1] = await connection.query('SELECT email FROM Users WHERE email = ?', [req.user.email]);
    if(query1.length === 0){
        res.status(400).json({message: "El ususario al que se le intenta asignar una tarjeta no existe"});
        return;
    }

    if(!req.body.name || !req.body.surname){
        res.status(400).send("El nombre o el apellido no pueden estar vacios");
        return;
    }

    if(req.body.isFingerPrint == null){
        res.status(400).send("isFingerPrint no puede estar vacio");
        return
    }

    await connection.query('INSERT INTO Cards (id, ownerEmail, name, surname, isFingerPrint) VALUES (?, ?, ?, ?, ?)', [req.body.id, req.user.email, req.body.name, req.body.surname, req.body.isFingerPrint]);
    res.sendStatus(200);
});

router.delete('/card/delete', authenticateToken, async (req, res) => {
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

    const [checkCard] = await connection.query('SELECT ownerEmail FROM Cards WHERE ownerEmail = ? AND id = ?', [req.body.ownerEmail, req.body.idCard]);
    if(checkCard.length === 0){
        res.status(403).json({message: "La tarjeta o el email no son correctos"});
        return;
    }

    const description = "ingreso";
    let date = new Date().toLocaleString().slice(0, 16);
    const bat = childProcess.spawn('cmd.exe', ['/c', 'C:/AppServ/www/Proyecto-2023-SmartSecurity/ffmpeg-6.0-essentials_build/bin/copyLastest.bat', 'C:/AppServ/www/Proyecto-2023-SmartSecurity/ffmpeg-6.0-essentials_build/bin']);

    let fileName;
    bat.stdout.on('data', (data) => {
        const output = data.toString().trim();

        // Extraer el valor de la variable del script de batch
        if(output.match(/NewestFileMp4=(.+)/)){
            fileName = output.match(/NewestFileMp4=(.+)/)[1].replace('"', "");
        }
    });

    bat.stdout.on('close', async () => {
        await connection.query('INSERT INTO Historial (idCard, userEmail, hour, description, videoName) VALUES (?, ?, ?, ?, ?)', [req.body.idCard, req.body.ownerEmail, date, description, fileName]);
    });

    res.sendStatus(200);
});

router.post('/register/delete', authenticateToken, async (req, res) => {
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

router.post('/register/video', authenticateToken, async (req, res) => {
    const [query] = await connection.query('SELECT videoName FROM Historial WHERE id = ? AND userEmail = ?', [req.body.id, req.user.email]);
    if(query.length === 0) return res.sendStatus(404);

    return res.status(200).json({
        videoName: query[0].videoName
    });
});

router.get('/tabla', async (req, res) => {
    const [query] = await connection.query('SELECT * FROM Historial');
    res.json(query);
});

module.exports = router;