export default () => ({
    jwt: {
        secret: process.env.SECRET_KEY,
    },
    database: {
        uri: process.env.MONGO_URI
    },
    cache: {
        redisurl: process.env.REDIS_URL,
        ttl: process.env.CACHE_TTL
    }
  });