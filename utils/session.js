const session = require('express-session');
const {RedisStore} = require("connect-redis")
const { client: redisClient } = require('../redis/index');

const store = new RedisStore({
  client: redisClient,
  prefix: 'sess:', // Tu peux personnaliser ce préfixe
});

const sessionMiddleware = session({
  store,
  secret: process.env.SESSION_SECRET || 'super_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 jour
  },
});

module.exports = sessionMiddleware;
