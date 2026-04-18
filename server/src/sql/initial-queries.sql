-- Project database schema for Brothers Kitchenware backend
-- This script creates all tables if they don't exist

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin', 'employee') NOT NULL DEFAULT 'customer',
  marketing_opt_in TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  image_url TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  image_url TEXT NOT NULL,
  category_slug VARCHAR(120) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  is_best_seller TINYINT(1) NOT NULL DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_ratings INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category_slug),
  INDEX idx_best_seller (is_best_seller),
  INDEX idx_featured (is_featured)
) ENGINE=InnoDB;

-- Product ratings table
CREATE TABLE IF NOT EXISTS product_ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NULL,
  user_name VARCHAR(255) NULL,
  rating INT NOT NULL,
  review TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product_rating (product_id),
  INDEX idx_user_rating (user_id),
  CONSTRAINT fk_product_ratings_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_product_ratings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NULL,
  status ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'processing',
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method ENUM('telebirr', 'mpesa', 'card', 'cash') NOT NULL DEFAULT 'cash',
  payment_provider VARCHAR(32) NULL,
  payment_reference VARCHAR(120) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  payment_confirmed_at TIMESTAMP NULL,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Add missing columns to orders table (for existing databases)
ALTER TABLE orders ADD COLUMN payment_method ENUM('telebirr', 'mpesa', 'card', 'cash') NOT NULL DEFAULT 'cash';
ALTER TABLE orders ADD COLUMN payment_provider VARCHAR(32) NULL;
ALTER TABLE orders ADD COLUMN payment_reference VARCHAR(120) NULL;
ALTER TABLE orders ADD COLUMN payment_confirmed_at TIMESTAMP NULL;

-- Add rating columns to products table (commented out to avoid duplicate column errors)
-- ALTER TABLE products ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.00;
-- ALTER TABLE products ADD COLUMN total_ratings INT DEFAULT 0;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image_url VARCHAR(512) NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  provider ENUM('telebirr', 'mpesa', 'card', 'cash') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  external_reference VARCHAR(120) NULL,
  status ENUM('initialized', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'initialized',
  metadata_json JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payment_order (order_id),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  read_at TIMESTAMP NULL,
  related_order_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_user (user_id, read_at),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_notifications_order FOREIGN KEY (related_order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  purchased_at DATE NOT NULL
) ENGINE=InnoDB;

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  incurred_at DATE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment_returns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NULL,
  amount DECIMAL(12,2) NOT NULL,
  reason VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_returns_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Seed data
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@bk.com', '$2b$10$N4IxbB6ZgIWeieR9Nkkf8u/5DB9aBn43.c3vWU60EmXq0sagbzEnm', 'BK Admin', 'admin'),
('employee@bk.com', '$2b$10$J.AI8gF7o0sR8DQ8bbHTlOKX3fxPqeTD0.uE5RMOQsUGtheQ6RGMS', 'BK Employee', 'employee'),
('customer@test.com', '$2b$10$tVZMnpXHQcpveFU1mQW61eBsaqVm/81TCgqmSxTYvZwHm8yxV/Vne', 'Test Customer', 'customer')
ON DUPLICATE KEY UPDATE email = email;

-- Categories: prepare, eat, store, appliances & electronics, plus bakeware and gadgets
INSERT INTO categories (id, name, slug, image_url) VALUES
(1, 'Cookware & Prep', 'cookware-prep', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80'),
(2, 'Bakeware', 'bakeware', 'https://images.unsplash.com/photo-1628083282487-557f25112b61?w=600&q=80'),
(3, 'Tableware & Dining', 'tableware-dining', 'https://images.unsplash.com/photo-1603199506016-b7a5480f98d4?w=600&q=80'),
(4, 'Food Storage', 'food-storage', 'https://images.unsplash.com/photo-1584990349676-31a2b414fccf?w=600&q=80'),
(5, 'Kitchen Appliances', 'kitchen-appliances', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'),
(6, 'Utensils & Gadgets', 'utensils-gadgets', 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&q=80'),
(7, 'Electronics', 'electronics', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'),
(8, 'Coffee & Tea', 'coffee-tea', 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80')
ON DUPLICATE KEY UPDATE name = VALUES(name), image_url = VALUES(image_url);

-- Product seed data (kitchen: cook, eat, store, large & small appliances)
-- Note: Products are now populated from catalog.json via the install service
-- This section is kept for reference but not executed
