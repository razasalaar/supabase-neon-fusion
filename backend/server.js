// import express from "express";
// import { Pool } from "pg";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

// // ES module equivalent of __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Neon Database Connection
// let pool;
// let dbConnected = false;

// // Initialize database connection asynchronously
// async function initializeDatabase() {
//   try {
//     console.log("🔍 Checking database configuration...");

//     if (!process.env.NEON_CONNECTION_STRING) {
//       console.log(
//         "⚠️  NEON_CONNECTION_STRING not found, running without database"
//       );
//       return;
//     }

//     console.log("🔗 Initializing database connection...");
//     pool = new Pool({
//       connectionString: process.env.NEON_CONNECTION_STRING,
//       ssl: {
//         rejectUnauthorized: false,
//       },
//     });

//     // Test database connection
//     pool.on("connect", () => {
//       console.log("✅ Connected to Neon database");
//       dbConnected = true;
//     });

//     pool.on("error", (err) => {
//       console.error("❌ Database connection error:", err);
//       dbConnected = false;
//     });

//     // Test the connection
//     console.log("🧪 Testing database connection...");
//     const client = await pool.connect();
//     await client.query("SELECT NOW()");
//     client.release();
//     dbConnected = true;
//     console.log("✅ Database connection test successful");
//   } catch (error) {
//     console.error("❌ Failed to initialize database:", error.message);
//     console.error("📝 Database error details:", error);
//     dbConnected = false;
//     // Don't crash the server if database connection fails
//   }
// }

// // API Routes

// // Health check - Simple version that always works
// app.get("/api/health", (req, res) => {
//   console.log("Health check requested");
//   res.status(200).json({
//     status: "OK",
//     message: "Backend API server is running successfully!",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || "development",
//     port: process.env.PORT || 3001,
//     database: dbConnected ? "Connected" : "Not connected",
//     uptime: process.uptime(),
//   });
// });

// // Root health check - Railway uses this for health checks
// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "Supabase Neon Fusion Backend is running!",
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     database: dbConnected ? "Connected" : "Not connected",
//     uptime: process.uptime(),
//   });
// });

// // Root API endpoint
// app.get("/api", (req, res) => {
//   res.json({
//     message: "Welcome to Supabase Neon Fusion Backend API!",
//     version: "1.0.0",
//     endpoints: {
//       health: "/api/health",
//       neonQuery: "/api/neon-query",
//       syncUser: "/api/sync-user",
//     },
//   });
// });

// // Neon query endpoint
// app.post("/api/neon-query", async (req, res) => {
//   try {
//     if (!pool || !dbConnected) {
//       return res.status(503).json({
//         error: "Database not available",
//         message: "Database connection not established",
//         status: "Service Unavailable",
//       });
//     }

//     const { query, params } = req.body;

//     if (!query) {
//       return res.status(400).json({ error: "Query is required" });
//     }

//     console.log("Executing query:", query);
//     console.log("With params:", params);

//     const result = await pool.query(query, params);

//     res.json({
//       rows: result.rows,
//       rowCount: result.rowCount,
//       command: result.command,
//     });
//   } catch (error) {
//     console.error("Database query error:", error);
//     res.status(500).json({
//       error: "Database query failed",
//       message: error.message,
//     });
//   }
// });

// // User sync endpoint
// app.post("/api/sync-user", async (req, res) => {
//   try {
//     if (!pool || !dbConnected) {
//       return res.status(503).json({
//         error: "Database not available",
//         message: "Database connection not established",
//         status: "Service Unavailable",
//       });
//     }

//     const { id, email, name } = req.body;

//     if (!id || !email) {
//       return res.status(400).json({ error: "User ID and email are required" });
//     }

//     const query = `
//       INSERT INTO users (id, email, name, created_at, updated_at)
//       VALUES ($1, $2, $3, NOW(), NOW())
//       ON CONFLICT (id) DO UPDATE SET
//         email = EXCLUDED.email,
//         name = EXCLUDED.name,
//         updated_at = NOW()
//       RETURNING *;
//     `;

//     const result = await pool.query(query, [id, email, name]);

//     res.json({ success: true, user: result.rows[0] });
//   } catch (error) {
//     console.error("User sync error:", error);
//     res.status(500).json({
//       error: "Failed to sync user",
//       message: error.message,
//     });
//   }
// });

// // Serve static files in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "dist", "index.html"));
//   });
// }

// // Start server
// async function startServer() {
//   try {
//     console.log("🚀 Starting server...");
//     console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
//     console.log(`🔧 Port: ${PORT}`);

//     // Initialize database connection (non-blocking)
//     initializeDatabase().catch((err) => {
//       console.error("Database initialization failed:", err.message);
//     });

//     // Start the server
//     const server = app.listen(PORT, () => {
//       console.log(`🚀 Backend server running on port ${PORT}`);
//       console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
//       console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
//       console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
//       console.log(
//         `🔗 Database connection: ${dbConnected ? "Available" : "Not available"}`
//       );
//       console.log(`🌐 Server is ready to accept requests!`);
//     });

//     // Handle server errors
//     server.on("error", (err) => {
//       console.error("❌ Server error:", err);
//       if (err.code === "EADDRINUSE") {
//         console.error(`❌ Port ${PORT} is already in use`);
//         process.exit(1);
//       }
//     });
//   } catch (error) {
//     console.error("❌ Failed to start server:", error);
//     process.exit(1);
//   }
// }

// // Start the server
// startServer();

// // Handle server errors
// app.on("error", (err) => {
//   console.error("❌ Server error:", err);
// });

// process.on("uncaughtException", (err) => {
//   console.error("❌ Uncaught Exception:", err);
// });

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
// });

// export default app;
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Setup paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ==========================
// Database Connection
// ==========================
let pool;
let dbConnected = false;

async function connectDatabase() {
  try {
    const connectionString = process.env.NEON_CONNECTION_STRING;
    if (!connectionString) {
      console.warn("⚠️  Missing NEON_CONNECTION_STRING in .env");
      return;
    }

    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    // Test connection
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();

    dbConnected = true;
    console.log("✅ Connected to Neon Database");
  } catch (err) {
    dbConnected = false;
    console.error("❌ Database Connection Error:", err.message);
  }
}

// ==========================
// Routes
// ==========================

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend server running successfully!",
    database: dbConnected ? "Connected" : "Disconnected",
    time: new Date().toISOString(),
  });
});

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Backend API",
    endpoints: ["/api/health", "/api/query", "/api/sync-user"],
  });
});

// Query Endpoint
app.post("/api/query", async (req, res) => {
  try {
    if (!pool || !dbConnected)
      return res.status(503).json({ error: "Database not connected" });

    const { query, params } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Query Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// User Sync Endpoint
app.post("/api/sync-user", async (req, res) => {
  try {
    if (!pool || !dbConnected)
      return res.status(503).json({ error: "Database not connected" });

    const { id, email, name } = req.body;
    if (!id || !email)
      return res.status(400).json({ error: "User ID and Email required" });

    const query = `
      INSERT INTO users (id, email, name, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE 
        SET email = EXCLUDED.email, 
            name = EXCLUDED.name,
            updated_at = NOW()
      RETURNING *;
    `;
    const result = await pool.query(query, [id, email, name]);
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error("❌ Sync User Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// Serve Frontend (Production)
// ==========================
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (_, res) =>
    res.sendFile(path.join(__dirname, "dist", "index.html"))
  );
}

// ==========================
// Start Server
// ==========================
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectDatabase();
});

export default app;
