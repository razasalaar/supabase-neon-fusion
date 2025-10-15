// Neon Database Configuration
// This file contains utilities for connecting to your Neon PostgreSQL database

export const NEON_CONNECTION_STRING = import.meta.env.VITE_NEON_CONNECTION_STRING;

// Helper to create fetch-based database queries
// Since we're in a browser environment, we'll use edge functions to interact with Neon
export const createNeonQuery = async (query: string, params: any[] = []) => {
  const response = await fetch('/api/neon-query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, params }),
  });

  if (!response.ok) {
    throw new Error('Database query failed');
  }

  return response.json();
};
