export default () => ({
    jwt: {
        secret: process.env.SECRET_KEY,
    },
    database: {
        uri: process.env.MONGO_URI
    }
  });