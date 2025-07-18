import knex from "knex";

const connection = knex({
  client: "postgresql",
  connection: process.env.DATABASE_URL,
});

export default connection;
