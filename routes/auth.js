const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Route pour afficher le formulaire d'inscription
router.get('/register', (req, res) => {
    res.send(`
        <form method="post" action="/register">
            <input type="hidden" name="_csrf" value="${req.csrfToken()}">
            <input name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    `);
});

// Route pour gérer l'inscription (utilisant des requêtes préparées pour éviter les injections SQL)
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // utilisation de requêtes préparées
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err) => {
        if (err) throw err;
        res.send('Registration successful! Go to <a href="/login">Login</a>');
    });
});

module.exports = router;
