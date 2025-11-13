import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { pool } from "./db.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
  },
});

io.on("connection", () => {});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/users", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, role, phone, company, email, created_at, updated_at FROM users ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "internal_error" });
  }
});

app.post("/api/users", async (req, res) => {
  const { name, role, phone, company, email } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "invalid_payload" });
  try {
    const result = await pool.query(
      "INSERT INTO users(name, role, phone, company, email) VALUES($1, $2, $3, $4, $5) RETURNING id, name, role, phone, company, email, created_at, updated_at",
      [name, role || null, phone || null, company || null, email]
    );
    const row = result.rows[0];
    io.emit("users:changed", { action: "create", data: row });
    res.status(201).json(row);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "email_exists" });
    res.status(500).json({ error: "internal_error" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, role, phone, company, email } = req.body || {};
  if (!id) return res.status(400).json({ error: "invalid_id" });
  try {
    const result = await pool.query(
      "UPDATE users SET name=$1, role=$2, phone=$3, company=$4, email=$5, updated_at=NOW() WHERE id=$6 RETURNING id, name, role, phone, company, email, created_at, updated_at",
      [name, role || null, phone || null, company || null, email, id]
    );
    if (!result.rowCount) return res.status(404).json({ error: "not_found" });
    const row = result.rows[0];
    io.emit("users:changed", { action: "update", data: row });
    res.json(row);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "email_exists" });
    res.status(500).json({ error: "internal_error" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "invalid_id" });
  try {
    const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING id", [id]);
    if (!result.rowCount) return res.status(404).json({ error: "not_found" });
    io.emit("users:changed", { action: "delete", data: { id } });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "internal_error" });
  }
});

const port = Number(process.env.PORT || 8081);
server.listen(port, () => {});