const redis = require("redis");

const redisClient = redis.createClient({
  host: "redis", // Your Redis container name from Docker Compose
  port: 6379, // Default Redis port
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = { client: redisClient };
