import express from "express";
import { Pool } from "pg";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Neon Database Connection
let pool;
try {
  pool = new Pool({
    connectionString: process.env.NEON_CONNECTION_STRING,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Test database connection
  pool.on("connect", () => {
    console.log("✅ Connected to Neon database");
  });

  pool.on("error", (err) => {
    console.error("❌ Database connection error:", err);
  });
} catch (error) {
  console.error("❌ Failed to create database pool:", error);
  // Don't crash the server if database connection fails
}

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend API server is running successfully!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root API endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Supabase Neon Fusion Backend API!",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      neonQuery: "/api/neon-query",
      syncUser: "/api/sync-user",
    },
  });
});

// Neon query endpoint
app.post("/api/neon-query", async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({
        error: "Database not available",
        message: "Database connection not established",
      });
    }

    const { query, params } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    console.log("Executing query:", query);
    console.log("With params:", params);

    const result = await pool.query(query, params);

    res.json({
      rows: result.rows,
      rowCount: result.rowCount,
      command: result.command,
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      error: "Database query failed",
      message: error.message,
    });
  }
});

// User sync endpoint
app.post("/api/sync-user", async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({
        error: "Database not available",
        message: "Database connection not established",
      });
    }

    const { id, email, name } = req.body;

    if (!id || !email) {
      return res.status(400).json({ error: "User ID and email are required" });
    }

    const query = `
      INSERT INTO users (id, email, name, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        updated_at = NOW()
      RETURNING *;
    `;

    const result = await pool.query(query, [id, email, name]);

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("User sync error:", error);
    res.status(500).json({
      error: "Failed to sync user",
      message: error.message,
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
