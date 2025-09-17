import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "canteendb",
  password: "1234abc",
  port: 5432,
});

export default pool;
