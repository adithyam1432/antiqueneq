-- SQL Schema for Antiques Marketplace
-- Database: antiques_db

CREATE DATABASE IF NOT EXISTS antiques_db;
USE antiques_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  contact_number VARCHAR(50),
  payment_info JSON,
  permanent_address TEXT,
  role ENUM('BUYER', 'ADMIN') DEFAULT 'BUYER',
  status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
  reset_otp VARCHAR(6) NULL,
  reset_otp_expiry TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Antiques Table
CREATE TABLE IF NOT EXISTS antiques (
  id VARCHAR(255) PRIMARY KEY,
  seller_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(15, 2) NOT NULL,
  category VARCHAR(100),
  year_created VARCHAR(100) DEFAULT 'Circa 1850',
  stock INT DEFAULT 1,
  image_url VARCHAR(255), -- Added for simple image hosting
  images JSON, -- Store array of image URLs
  status ENUM('PENDING', 'APPROVED', 'REJECTED', 'SOLD') DEFAULT 'PENDING',
  commission_rate DECIMAL(5, 2) DEFAULT 10.00,
  delivery_charge DECIMAL(10, 2) DEFAULT 500.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  buyer_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  shipping_address TEXT NOT NULL,
  contact_number VARCHAR(50),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  receipt_url VARCHAR(255),
  total_amount DECIMAL(15, 2) NOT NULL,
  commission_earned DECIMAL(15, 2) NOT NULL,
  delivery_charge DECIMAL(10, 2) NOT NULL,
  status ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'SHIPPED', 'DELIVERED', 'RETURN_REQUESTED', 'RETURNED') DEFAULT 'PENDING',
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES antiques(id)
);

-- 4. Cart Table
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES antiques(id) ON DELETE CASCADE
);

