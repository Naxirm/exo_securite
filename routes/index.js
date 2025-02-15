const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    res.send('<h1>Welcome to Vulnerable App</h1><p>Go to <a href="/login">Login</a></p>');
});

// on génère un token CSRF avec un input hidden pour protéger l'application
router.get('/login', (req, res) => {
    res.send(`
        <form method="post" action="/login">
            <input type="hidden" name="_csrf" value="${req.csrfToken()}">
            <input name="username" placeholder="Username"/>
            <input type="password" name="password" placeholder="Password"/>
            <button type="submit">Login</button>
        </form>
    `);
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // utilisation de requêtes préparées
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.user = results[0];
            res.send('Login successful!');
        } else {
            res.send('Invalid credentials!');
        }
    });
});

module.exports = router;
