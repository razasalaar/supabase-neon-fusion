// Neon Database Configuration
// This file contains utilities for connecting to your Neon PostgreSQL database

export const NEON_CONNECTION_STRING = import.meta.env
  .VITE_NEON_CONNECTION_STRING;

// Helper to create fetch-based database queries
// Since we're in a browser environment, we'll use our API server to interact with Neon
export const createNeonQuery = async (query: string, params: any[] = []) => {
  try {
    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:3001";
    const response = await fetch(`${API_BASE_URL}/api/neon-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, params }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Database query failed");
    }

    return response.json();
  } catch (error) {
    console.error("Neon query error:", error);
    throw error;
  }
};

// Helper to handle API responses
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }
  return response.json();
};
