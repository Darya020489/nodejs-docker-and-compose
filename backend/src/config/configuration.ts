export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    host: process.env.POSTGRES_HOST || "database",
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "123qweQWE",
    name: process.env.POSTGRES_DB || "postgres",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret_key!",
    ttl: process.env.JWT_TTL || "30000s",
  },
});
