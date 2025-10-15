# Neon Database Setup Guide

## Architecture Overview

This application uses a **hybrid architecture**:
- **Supabase**: Authentication only (via Lovable Cloud)
- **Neon PostgreSQL**: All database tables and data

## Important: SQL Migration for Neon

The SQL you provided includes RLS policies with `auth.uid()` which are **Supabase-specific** and won't work in plain Neon PostgreSQL. Below is the **corrected SQL** that will work with Neon.

## Complete SQL Migration for Neon DB

```sql
-- =============================================
-- NIMBLE WORKSHOP DATABASE MIGRATION
-- Complete SQL for Neon PostgreSQL
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS TABLE (synced from Supabase Auth)
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY,  -- Will match Supabase auth user ID
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. WORKSHOPS TABLE
-- =============================================
CREATE TABLE workshops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workshop_name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(255) NOT NULL,
    item_no VARCHAR(100),
    product_quantity INTEGER DEFAULT 0,
    cost_per_piece DECIMAL(10,2) DEFAULT 0.00,
    sell_price_per_piece DECIMAL(10,2) DEFAULT 0.00,
    total_cost DECIMAL(10,2) DEFAULT 0.00,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. SUB_PRODUCTS TABLE
-- =============================================
CREATE TABLE sub_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_product_name VARCHAR(255) NOT NULL,
    cost_per_piece DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. SALES TABLE
-- =============================================
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    sold_quantity INTEGER NOT NULL,
    selling_price_piece DECIMAL(10,2) NOT NULL,
    cost_price_piece DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) DEFAULT 0.00,
    total_sale_price DECIMAL(10,2) DEFAULT 0.00,
    total_cost DECIMAL(10,2) DEFAULT 0.00,
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sale_transaction_id UUID NOT NULL,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. PROFIT_SUMMARY VIEW
-- =============================================
CREATE VIEW profit_summary AS
SELECT 
    p.id as product_id,
    p.item_no,
    p.product_name,
    p.sell_price_per_piece,
    p.product_quantity as remaining_stock,
    w.id as workshop_id,
    w.workshop_name,
    COALESCE(SUM(s.sold_quantity), 0) as total_quantity_sold,
    COALESCE(SUM(s.total_sale_price), 0) as total_sales_amount,
    COALESCE(SUM(s.total_cost), 0) as total_cost_amount,
    COALESCE(SUM(s.profit), 0) as total_profit
FROM products p
LEFT JOIN workshops w ON p.workshop_id = w.id
LEFT JOIN sales s ON p.id = s.product_id
GROUP BY p.id, p.item_no, p.product_name, p.sell_price_per_piece, 
         p.product_quantity, w.id, w.workshop_name;

-- =============================================
-- 7. INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);

-- Workshops indexes
CREATE INDEX idx_workshops_user_id ON workshops(user_id);
CREATE INDEX idx_workshops_name ON workshops(workshop_name);

-- Products indexes
CREATE INDEX idx_products_workshop_id ON products(workshop_id);
CREATE INDEX idx_products_item_no ON products(item_no);
CREATE INDEX idx_products_name ON products(product_name);
CREATE INDEX idx_products_quantity ON products(product_quantity);

-- Sub-products indexes
CREATE INDEX idx_sub_products_product_id ON sub_products(product_id);

-- Sales indexes
CREATE INDEX idx_sales_workshop_id ON sales(workshop_id);
CREATE INDEX idx_sales_product_id ON sales(product_id);
CREATE INDEX idx_sales_transaction_id ON sales(sale_transaction_id);
CREATE INDEX idx_sales_customer_name ON sales(customer_name);
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);

-- =============================================
-- 8. TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 9. FUNCTIONS FOR BUSINESS LOGIC
-- =============================================

-- Function to calculate product cost from sub-products
CREATE OR REPLACE FUNCTION calculate_product_cost(product_uuid UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total_cost DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(cost_per_piece), 0) INTO total_cost
    FROM sub_products
    WHERE product_id = product_uuid;
    
    RETURN total_cost;
END;
$$ LANGUAGE plpgsql;

-- Function to update product cost when sub-products change
CREATE OR REPLACE FUNCTION update_product_cost()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET cost_per_piece = calculate_product_cost(COALESCE(NEW.product_id, OLD.product_id))
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product cost when sub-products change
CREATE TRIGGER update_product_cost_trigger
    AFTER INSERT OR UPDATE OR DELETE ON sub_products
    FOR EACH ROW EXECUTE FUNCTION update_product_cost();

-- =============================================
-- MIGRATION COMPLETE
-- =============================================
```

## Setup Steps

### 1. Create Neon Database
1. Go to https://console.neon.tech/
2. Create a new project
3. Copy your connection string

### 2. Run the SQL Migration
Execute the above SQL in your Neon database console or using psql:
```bash
psql "your-neon-connection-string" < migration.sql
```

### 3. Configure Environment Variable
Add your Neon connection string to Lovable Cloud secrets:
- Secret name: `NEON_CONNECTION_STRING`
- Value: Your Neon PostgreSQL connection string

### 4. Create Edge Function for User Sync
You'll need to create an edge function that syncs Supabase auth users to Neon. This function should:
- Trigger when a user signs up in Supabase
- Insert the user record into Neon's users table
- Handle the sync via the `/api/sync-user` endpoint

## Key Differences from Original SQL

1. **Removed RLS Policies**: Neon doesn't have access to Supabase's `auth.uid()` function
2. **Removed Password Field**: Passwords are handled by Supabase auth, not stored in Neon
3. **Security**: Application-level security will be handled in edge functions
4. **User Sync**: Users are synced from Supabase auth to Neon's users table

## Next Steps

After running the migration:
1. Configure auto-confirm email in Supabase auth settings
2. Create edge functions to:
   - Sync users from Supabase to Neon
   - Query Neon database securely
   - Handle all CRUD operations with proper auth checks
3. The frontend is ready to connect once edge functions are set up
