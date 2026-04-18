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
INSERT INTO categories (name, slug, image_url) VALUES
('Cookware & Prep', 'cookware-prep', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80'),
('Bakeware', 'bakeware', 'https://images.unsplash.com/photo-1628083282487-557f25112b61?w=600&q=80'),
('Tableware & Dining', 'tableware-dining', 'https://images.unsplash.com/photo-1603199506016-b7a5480f98d4?w=600&q=80'),
('Food Storage', 'food-storage', 'https://images.unsplash.com/photo-1584990349676-31a2b414fccf?w=600&q=80'),
('Kitchen Appliances', 'kitchen-appliances', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'),
('Utensils & Gadgets', 'utensils-gadgets', 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&q=80')
ON DUPLICATE KEY UPDATE name = VALUES(name), image_url = VALUES(image_url);

-- Product seed data (kitchen: cook, eat, store, large & small appliances)
INSERT INTO products (
  id, name, description, price, image_url, category_slug, stock_quantity,
  is_best_seller, is_featured, average_rating, total_ratings
) VALUES
(101, 'Stainless Steel Cookware Set', 'Pots and pans for everyday cooking and meal prep.', 129.99, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', 'cookware-prep', 40, 1, 1, 4.5, 128),
(102, 'Chef Knife & Cutting Board Set', 'Sharp knives and a sturdy board for chopping and slicing.', 79.50, 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&q=80', 'cookware-prep', 55, 0, 1, 4.2, 89),
(103, 'Non-Stick Bakeware Bundle', 'Sheets and pans for baking breads, cakes, and casseroles.', 64.00, 'https://images.unsplash.com/photo-1628083282487-557f25112b61?w=800&q=80', 'bakeware', 48, 1, 0, 4.7, 156),
(104, 'Ceramic Dinnerware (16-piece)', 'Plates and bowls for serving and enjoying meals at the table.', 89.99, 'https://images.unsplash.com/photo-1603199506016-b7a5480f98d4?w=800&q=80', 'tableware-dining', 35, 1, 1, 4.8, 203),
(105, 'Stainless Flatware Set', 'Forks, knives, and spoons for dining.', 42.00, 'https://images.unsplash.com/photo-1607623488073-5b5d75cfc4d4?w=800&q=80', 'tableware-dining', 60, 0, 0),
(106, 'Glass Food Storage Containers', 'Airtight lids — store leftovers and pantry staples safely.', 49.99, 'https://images.unsplash.com/photo-1584990349676-31a2b414fccf?w=800&q=80', 'food-storage', 70, 1, 0),
(107, 'Dry Goods Canister Set', 'Keep flour, sugar, and pasta organized on the counter.', 36.00, 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80', 'food-storage', 45, 0, 1),
(108, 'French Door Refrigerator', 'Large capacity cooling for fresh ingredients.', 1899.00, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80', 'kitchen-appliances', 8, 1, 1),
(109, 'Freestanding Gas Range', 'Oven and cooktop for preparing family meals.', 1499.00, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', 'kitchen-appliances', 6, 1, 1),
(110, 'Countertop Microwave', 'Quick reheating and defrosting.', 189.00, 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80', 'kitchen-appliances', 22, 0, 0),
(111, 'Electric Kettle', 'Boil water fast for tea, coffee, and cooking.', 39.99, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80', 'kitchen-appliances', 50, 1, 0),
(112, 'Silicone Utensil Set', 'Spatulas and spoons safe for non-stick cookware.', 28.00, 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&q=80', 'utensils-gadgets', 80, 0, 0)
ON DUPLICATE KEY UPDATE
name = VALUES(name),
description = VALUES(description),
price = VALUES(price),
image_url = VALUES(image_url),
category_slug = VALUES(category_slug),
stock_quantity = VALUES(stock_quantity),
is_best_seller = VALUES(is_best_seller),
is_featured = VALUES(is_featured),
average_rating = VALUES(average_rating),
total_ratings = VALUES(total_ratings);
