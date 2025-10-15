// API utilities for Neon database operations
import { createNeonQuery } from "./neon";

// Types based on your database schema
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface Workshop {
  id: string;
  workshop_name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  product_name: string;
  item_no?: string;
  product_quantity: number;
  cost_per_piece: number;
  sell_price_per_piece: number;
  total_cost: number;
  workshop_id: string;
  created_at: string;
  updated_at: string;
  date_added: string;
}

export interface Sale {
  id: string;
  customer_name: string;
  customer_phone?: string;
  sold_quantity: number;
  selling_price_piece: number;
  cost_price_piece: number;
  profit: number;
  total_sale_price: number;
  total_cost: number;
  sale_date: string;
  sale_transaction_id: string;
  workshop_id: string;
  product_id: string;
  created_at: string;
  // Additional fields from JOIN queries
  product_name?: string;
  item_no?: string;
  workshop_name?: string;
}

export interface ProfitSummary {
  product_id: string;
  item_no?: string;
  product_name: string;
  sell_price_per_piece: number;
  remaining_stock: number;
  workshop_id: string;
  workshop_name: string;
  total_quantity_sold: number;
  total_sales_amount: number;
  total_cost_amount: number;
  total_profit: number;
}

// API Functions
export const api = {
  // User operations
  async syncUser(user: { id: string; email: string; name?: string }) {
    const query = `
      INSERT INTO users (id, email, name, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        updated_at = NOW()
      RETURNING *;
    `;
    return createNeonQuery(query, [user.id, user.email, user.name]);
  },

  // Workshop operations
  async getWorkshops(userId: string): Promise<Workshop[]> {
    const query =
      "SELECT * FROM workshops WHERE user_id = $1 ORDER BY created_at DESC";
    const result = await createNeonQuery(query, [userId]);
    return result.rows || [];
  },

  async createWorkshop(workshop: {
    workshop_name: string;
    user_id: string;
  }): Promise<Workshop> {
    const query = `
      INSERT INTO workshops (workshop_name, user_id, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING *;
    `;
    const result = await createNeonQuery(query, [
      workshop.workshop_name,
      workshop.user_id,
    ]);
    return result.rows[0];
  },

  async updateWorkshop(id: string, workshop_name: string): Promise<Workshop> {
    const query = `
      UPDATE workshops 
      SET workshop_name = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const result = await createNeonQuery(query, [workshop_name, id]);
    return result.rows[0];
  },

  async deleteWorkshop(id: string): Promise<void> {
    const query = "DELETE FROM workshops WHERE id = $1";
    await createNeonQuery(query, [id]);
  },

  // Product operations
  async getProducts(workshopId: string): Promise<Product[]> {
    const query =
      "SELECT * FROM products WHERE workshop_id = $1 ORDER BY created_at DESC";
    const result = await createNeonQuery(query, [workshopId]);
    return result.rows || [];
  },

  async getAllProducts(userId: string): Promise<Product[]> {
    const query = `
      SELECT p.* FROM products p
      JOIN workshops w ON p.workshop_id = w.id
      WHERE w.user_id = $1
      ORDER BY p.created_at DESC
    `;
    const result = await createNeonQuery(query, [userId]);
    // Convert decimal strings to numbers
    return (result.rows || []).map((product) => ({
      ...product,
      cost_per_piece: Number(product.cost_per_piece),
      sell_price_per_piece: Number(product.sell_price_per_piece),
      total_cost: Number(product.total_cost),
      product_quantity: Number(product.product_quantity),
    }));
  },

  async createProduct(product: {
    product_name: string;
    item_no?: string;
    product_quantity: number;
    cost_per_piece: number;
    sell_price_per_piece: number;
    workshop_id: string;
  }): Promise<Product> {
    const total_cost = product.product_quantity * product.cost_per_piece;
    const query = `
      INSERT INTO products (
        product_name, item_no, product_quantity, cost_per_piece, 
        sell_price_per_piece, total_cost, workshop_id, created_at, updated_at, date_added
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
      RETURNING *;
    `;
    const result = await createNeonQuery(query, [
      product.product_name,
      product.item_no,
      product.product_quantity,
      product.cost_per_piece,
      product.sell_price_per_piece,
      total_cost,
      product.workshop_id,
    ]);
    return result.rows[0];
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const fields = Object.keys(updates).filter((key) => key !== "id");
    const values = fields.map((field, index) => `${field} = $${index + 2}`);
    const query = `
      UPDATE products 
      SET ${values.join(", ")}, updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const result = await createNeonQuery(query, [
      id,
      ...Object.values(updates),
    ]);
    return result.rows[0];
  },

  async deleteProduct(id: string): Promise<void> {
    const query = "DELETE FROM products WHERE id = $1";
    await createNeonQuery(query, [id]);
  },

  // Sales operations
  async getSales(workshopId: string): Promise<Sale[]> {
    const query =
      "SELECT * FROM sales WHERE workshop_id = $1 ORDER BY sale_date DESC";
    const result = await createNeonQuery(query, [workshopId]);
    return result.rows || [];
  },

  async getAllSales(userId: string): Promise<Sale[]> {
    const query = `
      SELECT 
        s.*,
        p.product_name,
        p.item_no,
        w.workshop_name
      FROM sales s
      JOIN workshops w ON s.workshop_id = w.id
      JOIN products p ON s.product_id = p.id
      WHERE w.user_id = $1
      ORDER BY s.sale_date DESC
    `;
    const result = await createNeonQuery(query, [userId]);
    return result.rows || [];
  },

  async createSale(sale: {
    customer_name: string;
    customer_phone?: string;
    sold_quantity: number;
    selling_price_piece: number;
    cost_price_piece: number;
    workshop_id: string;
    product_id: string;
  }): Promise<Sale> {
    const total_sale_price = sale.sold_quantity * sale.selling_price_piece;
    const total_cost = sale.sold_quantity * sale.cost_price_piece;
    const profit = total_sale_price - total_cost;
    const sale_transaction_id = crypto.randomUUID();

    // First, check if there's enough stock available
    const stockCheckQuery = `
      SELECT product_quantity FROM products WHERE id = $1
    `;
    const stockResult = await createNeonQuery(stockCheckQuery, [
      sale.product_id,
    ]);

    if (!stockResult.rows || stockResult.rows.length === 0) {
      throw new Error("Product not found");
    }

    const availableStock = Number(stockResult.rows[0].product_quantity);
    if (availableStock < sale.sold_quantity) {
      throw new Error(
        `Insufficient stock. Available: ${availableStock}, Requested: ${sale.sold_quantity}`
      );
    }

    // Create the sale record
    const saleQuery = `
      INSERT INTO sales (
        customer_name, customer_phone, sold_quantity, selling_price_piece,
        cost_price_piece, profit, total_sale_price, total_cost,
        sale_date, sale_transaction_id, workshop_id, product_id, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10, $11, NOW())
      RETURNING *;
    `;

    const saleResult = await createNeonQuery(saleQuery, [
      sale.customer_name,
      sale.customer_phone,
      sale.sold_quantity,
      sale.selling_price_piece,
      sale.cost_price_piece,
      profit,
      total_sale_price,
      total_cost,
      sale_transaction_id,
      sale.workshop_id,
      sale.product_id,
    ]);

    // Update product stock quantity and total cost
    const updateProductQuery = `
      UPDATE products 
      SET 
        product_quantity = product_quantity - $1,
        total_cost = (product_quantity - $1) * cost_per_piece,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;

    await createNeonQuery(updateProductQuery, [
      sale.sold_quantity,
      sale.product_id,
    ]);

    return saleResult.rows[0];
  },

  // Dashboard statistics
  async getDashboardStats(userId: string) {
    const query = `
      SELECT 
        COUNT(DISTINCT p.id) as total_products,
        COUNT(DISTINCT s.id) as total_sales,
        COALESCE(SUM(s.total_sale_price), 0) as total_revenue,
        COALESCE(SUM(s.profit), 0) as total_profit
      FROM workshops w
      LEFT JOIN products p ON w.id = p.workshop_id
      LEFT JOIN sales s ON w.id = s.workshop_id
      WHERE w.user_id = $1
    `;
    const result = await createNeonQuery(query, [userId]);
    const stats = result.rows[0];
    // Convert decimal strings to numbers
    return {
      total_products: Number(stats.total_products),
      total_sales: Number(stats.total_sales),
      total_revenue: Number(stats.total_revenue),
      total_profit: Number(stats.total_profit),
    };
  },

  // Reports
  async getProfitSummary(userId: string): Promise<ProfitSummary[]> {
    const query = `
      SELECT ps.* FROM profit_summary ps
      JOIN workshops w ON ps.workshop_id = w.id
      WHERE w.user_id = $1
      ORDER BY ps.total_profit DESC
    `;
    const result = await createNeonQuery(query, [userId]);
    return result.rows || [];
  },

  async getSalesReport(userId: string, startDate?: string, endDate?: string) {
    let query = `
      SELECT 
        s.*,
        p.product_name,
        p.item_no,
        w.workshop_name
      FROM sales s
      JOIN products p ON s.product_id = p.id
      JOIN workshops w ON s.workshop_id = w.id
      WHERE w.user_id = $1
    `;
    const params = [userId];

    if (startDate) {
      query += ` AND s.sale_date >= $${params.length + 1}`;
      params.push(startDate);
    }
    if (endDate) {
      query += ` AND s.sale_date <= $${params.length + 1}`;
      params.push(endDate);
    }

    query += " ORDER BY s.sale_date DESC";
    const result = await createNeonQuery(query, params);
    return result.rows || [];
  },
};
