const redis = require("redis");
const { promisify } = require("util");

// Utiliser l'URL de la variable d'environnement au lieu de localhost
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
console.log("Tentative de connexion à Redis sur :", redisUrl);

// Créer un client Redis
const client = redis.createClient({
  url: redisUrl,
});

client.on("error", (err) => {
  console.log("❌ Redis error:", err);
});

client.on("connect", () => {
  console.log("✅ Connected to Redis");
});

// Promisify quelques méthodes Redis pour utiliser async/await
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = { client, getAsync, setAsync };
