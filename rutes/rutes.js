const express = require('express');
const router = express.Router();
const axios = require('axios');
const bcrypt = require('bcrypt');
const users = require('../data/users');
const {generateToken, verifyToken} = require('../middlewares/auth')



router.get('/', (req, res) => {
    const loginForm = `
      <form action="/login" method="post">
      <label for="username">Usuario:</label>
      <input type="text" id="username" name="username" required><br>
  
        <label for="password">Contraseñas:</label>
        <input type="password" id="username" name="password" required><br>
  
        <button type="submit">Iniciar sesión</button>
      </form>
      <a href="/dashboard">dashboard</a>
    `;
  
    res.send(loginForm);
  });


// Ruta para iniciar sesión
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    //SI ES CORRECTO, BIEN
    if (user) {
      const token = generateToken(user);
      req.session.token = token;
      res.redirect('/dashboard');
  
      //SI NO ES CORRECTO SALDRA UN ERROR
    } else {
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
  });

// Ruta para obtener todos los personajes
router.get('/characters/', verifyToken, async (req, res) => {
    const url = 'https://rickandmortyapi.com/api/character/';
    try {
        const response = await axios.get(url);
        res.json(response.data.results);
    } catch (error) {
        res.status(404).json({ mensaje: 'No se encuentran los personajes' });
    }
});
// Ruta para buscar un personaje por nombre
router.get('/characters/:name', verifyToken, async (req, res) => {
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

router.get('/dashboard', verifyToken, (req, res) => {
    const userId = req.user;
    const user = users.find((user) => user.id === userId);
    if (user) {
      res.send(`
        <h1>Bienvenido, ${user.name}</h1>
        <p>ID: ${user.id}</p>
        <p>UserName: ${user.username}</p>
        <a href="/">HOME</a>
        <form action="/logout" method="post">
          <button type="submit">Cerrar sesión</button>
        </form>
      `);
    } else {
      res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }
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

module.exports = router;



