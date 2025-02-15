const express = require('express');
const router = express.Router();
const db = require('../config/database');

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Route pour afficher les commentaires et le formulaire
router.get('/comments', (req, res) => {
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

// Route pour ajouter un commentaire
router.post('/comments', (req, res) => {
    const safeText = DOMPurify.sanitize(req.body.text);
    const query = `INSERT INTO comments (text) VALUES ('${safeText}')`;
    db.query(query, (err) => {
        if (err) throw err;
        res.redirect('/comments');
    });
});

module.exports = router;
