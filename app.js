const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const dotenv = require('dotenv').config();
const db = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

const csrfProtection = csrf({ cookie: true });

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    // déplacement du secret dans le .env pour plus de sécurité
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(csrfProtection);

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', commentRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});