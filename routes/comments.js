const express = require('express');
const router = express.Router();
const db = require('../config/database');
const ensureAuthenticated = require('../middleware/auth');
const { JSDOM } = require('jsdom');
const DOMPurify = require('dompurify')(new JSDOM().window);

// assainissement des données
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Les routes get et post sont protégées par ensureAuthenticated, venant du middleware
// on génère un token CSRF avec un input hidden pour protéger l'application
router.get('/comments', checkAuthentication, (req, res) => {
    db.query('SELECT * FROM comments', (err, results) => {
        if (err) throw err;
        const commentsHTML = results.map(comment => `<p>${escapeHtml(comment.text)}</p>`).join('');
        res.send(`
            <form method="post" action="/comments">
                <input type="hidden" name="_csrf" value="${req.csrfToken()}">
                <textarea name="text" placeholder="Your comment"></textarea>
                <button type="submit">Post Comment</button>
            </form>
            ${commentsHTML}
        `);
    });
});

router.post('/comments', checkAuthentication, (req, res) => {
    const { text } = req.body;
    const safeText = DOMPurify.sanitize(text);

    // utilisation de requêtes préparées
    const query = 'INSERT INTO comments (text) VALUES (?)';
    db.query(query, [safeText], (err) => {
        if (err) throw err;
        res.redirect('/comments');
    });
});

module.exports = router;