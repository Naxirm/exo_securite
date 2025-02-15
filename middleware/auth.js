/* Ajout d'une authentification basique pour que seuls les utilisateurs
connectés puissent accéder à la page des commentaires */

function checkAuthentication(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

function ensureAdmin(req, res, next) {
    if (req.session.user && req.session.role === 'admin') {
        return next(); // si l'utilisateur est un admin, autorise l'accès à la page
    }
    res.status(403).send('Access denied: Admins only.'); // Sinon, erreur
}

module.exports = {
    checkAuthentication,
    ensureAdmin
};