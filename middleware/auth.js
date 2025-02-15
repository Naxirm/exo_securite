/* Ajout d'une authentification basique pour que seuls les utilisateurs
connectés puissent accéder à la page des commentaires */

function checkAuthentication(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

module.exports = checkAuthentication;