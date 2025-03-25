// redis/index.js
const Redis = require('ioredis');

// Créer un client Redis avec ioredis
const redis = new Redis({
  host: 'redis',  // Ou l'URL de votre instance Redis
  port: 6379,         // Port de votre instance Redis
});

redis.on('connect', () => {
  console.log('Connecté à Redis');
});

redis.on('error', (err) => {
  console.error('Erreur Redis :', err);
});

module.exports = redis;
