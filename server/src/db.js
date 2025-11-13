import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const sslEnabled = (process.env.DATABASE_SSL || "false").toLowerCase() === "true";

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: sslEnabled ? { rejectUnauthorized: true } : false,
});