const session = require('express-session');
const redis = require('../redis/index');
const { RedisStore } = require('connect-redis'); // Notez qu'on importe la classe RedisStore directement
const client = redis; // Le client Redis est déjà exporté dans redis/index.js

const store = new RedisStore({
  client, // Passer le client Redis ici
  prefix: 'sess:', // Tu peux personnaliser ce préfixe
});

const sessionMiddleware = session({
  store,
  secret: process.env.SESSION_SECRET || 'super_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Assure-toi d'ajuster ceci en fonction de ton environnement
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 jour
  },
});

module.exports = sessionMiddleware;
