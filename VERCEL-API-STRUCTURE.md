# Vercel API Routes Structure

## Current Structure (Recommended)

```
supabase-neon-fusion/
├── backend/           ← Express server (Railway)
│   ├── server.js
│   └── package.json
├── src/              ← React frontend (Vercel)
│   ├── lib/
│   └── components/
└── package.json
```

## Vercel API Routes Structure (Alternative)

```
supabase-neon-fusion/
├── api/              ← Vercel API routes
│   ├── health.js
│   ├── neon-query.js
│   └── sync-user.js
├── src/              ← React frontend
│   ├── lib/
│   └── components/
├── package.json
└── vercel.json
```

## Example Vercel API Route (api/neon-query.js)

```javascript
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NEON_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query, params } = req.body;
    const result = await pool.query(query, params);

    res.json({
      rows: result.rows,
      rowCount: result.rowCount,
      command: result.command,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## vercel.json Configuration

```json
{
  "functions": {
    "api/*.js": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEON_CONNECTION_STRING": "@neon_connection_string"
  }
}
```

## Frontend Changes (src/lib/neon.ts)

```javascript
export const createNeonQuery = async (query: string, params: any[] = []) => {
  const response = await fetch("/api/neon-query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, params }),
  });

  return response.json();
};
```

## Pros and Cons

### Vercel API Routes

✅ Single deployment
✅ No CORS issues
✅ Serverless scaling
❌ Cold starts
❌ 30-second timeout limit
❌ Connection pooling issues
❌ More complex setup

### Separate Backend (Current)

✅ Persistent connections
✅ No timeout limits
✅ Better performance
✅ Easier debugging
❌ Two deployments
❌ CORS configuration needed

