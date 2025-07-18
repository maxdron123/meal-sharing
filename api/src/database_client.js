import knex from "knex";

const connection = knex({
  client: "postgresql",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_USE_SSL === 'true' ? { rejectUnauthorized: false } : false
  },
  pool: {
    min: 0,
    max: 5,
    acquireTimeoutMillis: 60000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  }
});

export default connection;
