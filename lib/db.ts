import "server-only";
import { createPool } from "mysql2/promise";

export const db = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: "+08:00", // 东八区 (UTC+8)
});