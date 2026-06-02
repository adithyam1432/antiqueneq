-- SQL Schema for Antiquity Marketplace
-- Database: antiquity_db

CREATE DATABASE IF NOT EXISTS antiquity_db;
USE antiquity_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  contact_number VARCHAR(50),
  payment_info JSON,
  role ENUM('BUYER', 'SELLER', 'ADMIN') DEFAULT 'BUYER',
  status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seller Profiles (For more details like PAN/Address)
CREATE TABLE IF NOT EXISTS seller_profiles (
  user_id VARCHAR(255) PRIMARY KEY,
  business_name VARCHAR(255),
  pan_number VARCHAR(20),
  id_proof_url VARCHAR(255), -- Corrected to match API
  business_address TEXT,
  tax_id VARCHAR(50),
  status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Antiques Table
CREATE TABLE IF NOT EXISTS antiques (
  id VARCHAR(255) PRIMARY KEY,
  seller_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(15, 2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(255), -- Added for simple image hosting
  images JSON, -- Store array of image URLs
  status ENUM('PENDING', 'APPROVED', 'REJECTED', 'SOLD') DEFAULT 'PENDING',
  commission_rate DECIMAL(5, 2) DEFAULT 10.00,
  delivery_charge DECIMAL(10, 2) DEFAULT 500.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  buyer_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  shipping_address TEXT NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  commission_earned DECIMAL(15, 2) NOT NULL,
  delivery_charge DECIMAL(10, 2) NOT NULL,
  status ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'RETURN_REQUESTED', 'RETURNED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES antiques(id)
);

-- 5. Cart Table
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES antiques(id) ON DELETE CASCADE
);

-- 6. Payouts Table
CREATE TABLE IF NOT EXISTS payouts (
  id VARCHAR(255) PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  seller_id VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status ENUM('PROCESSING', 'COMPLETED') DEFAULT 'PROCESSING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
);
