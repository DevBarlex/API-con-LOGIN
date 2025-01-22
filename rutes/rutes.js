const express = require('express');
const router = express.Router();
const axios = require('axios');
const bcrypt = require('bcrypt');
const users = require('../data/users');
const {generateToken, verifyToken} = require('../middlewares/auth')

// Ruta para iniciar sesión
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = generateToken(user);
    console.log(token)
    req.session.token = token;

    res.json({ mensaje: 'Inicio de sesión exitoso', token });
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al cerrar sesión' });
        }
        res.json({ mensaje: 'Sesión cerrada con éxito' });
    });
});


// Ruta para obtener todos los personajes
router.get('/', verifyToken, async (req, res) => {
    const url = 'https://rickandmortyapi.com/api/character/';
    try {
        const response = await axios.get(url);
        res.json(response.data.results);
    } catch (error) {
        res.status(404).json({ mensaje: 'No se encuentran los personajes' });
    }
});
// Ruta para buscar un personaje por nombre
router.get('/:name', verifyToken, async (req, res) => {
    const characterName = req.params.name.toLowerCase();
    const url = `https://rickandmortyapi.com/api/character/?name=${characterName}`;
    try {
        const response = await axios.get(url);
        const data = response.data.results;
        if (data.length === 0) {
            return res.status(404).send('<h1>No se encontraron personajes</h1>');
        }
        const { name, gender, image, status, species, origin:{name:originName} } = data[0];
        res.send(`
            <h1>${name}</h1>
            <img src="${image}" alt="${name}" style="max-width: 200px;">
            <p>Status: ${status}</p>
            <p>Gender: ${gender}</p>
            <p>Species: ${species}</p>
            <p>Origin:${originName}</p>
        `);
    } catch (error) {
        res.status(404).send('<h1>No se encontró el personaje</h1>');
    }
});

module.exports = router;



