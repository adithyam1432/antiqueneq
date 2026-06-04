-- SQL Schema for Antiques Marketplace (Java JDBC Version)
-- Database: antiques_jdbc_db

CREATE DATABASE IF NOT EXISTS antiques_jdbc_db;
USE antiques_jdbc_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  contact_number VARCHAR(50),
  shipping_address TEXT,
  role ENUM('BUYER', 'ADMIN') DEFAULT 'BUYER',
  status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Antiques Table
CREATE TABLE IF NOT EXISTS antiques (
  id VARCHAR(255) PRIMARY KEY,
  seller_id VARCHAR(255) NOT NULL, -- Points to Admin lister
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(15, 2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(255),
  status ENUM('PENDING', 'APPROVED', 'REJECTED', 'SOLD') DEFAULT 'APPROVED',
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
  total_amount DECIMAL(15, 2) NOT NULL,
  delivery_charge DECIMAL(10, 2) NOT NULL,
  status ENUM('PENDING', 'CONFIRMED', 'PACKED', 'DELIVERING', 'SHIPPED', 'REJECTED') DEFAULT 'PENDING',
  proof_url VARCHAR(255),
  remarks TEXT,
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

-- Seed Initial Data
INSERT IGNORE INTO users (id, name, email, password, contact_number, role, status) VALUES 
('admin-001', 'Antiques Admin', 'admin@antiques.com', 'admin123', '0000000000', 'ADMIN', 'APPROVED'),
('buyer-001', 'Vikas Collector', 'buyer@antiques.com', 'buyer123', '+919998887776', 'BUYER', 'APPROVED');

INSERT IGNORE INTO antiques (id, seller_id, title, description, price, category, status, image_url) VALUES
('antique-001', 'admin-001', 'Teal Filigree Vase', 'Hand-painted masterpiece from the late 17th century.', 85000.00, 'Ceramics', 'APPROVED', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=600'),
('antique-002', 'admin-001', 'Victorian Pocket Watch', 'Exquisite gold watch with intricate carvings.', 45000.00, 'Horology', 'APPROVED', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600'),
('antique-003', 'admin-001', 'Tanjore Saraswati Painting', 'Traditional Tanjore painting with 22ct gold foil and precious stones from Tamil Nadu.', 120000.00, 'Fine Art', 'APPROVED', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600'),
('antique-004', 'admin-001', 'Mughal Brass Astrolabe', 'Intricate 17th-century astronomical instrument used to calculate time and celestial positions.', 95000.00, 'Scientific', 'APPROVED', 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=600'),
('antique-005', 'admin-001', 'Chola Dynasty Bronze Nataraja', 'A rare, hand-cast lost-wax bronze representation of Lord Shiva as the cosmic dancer.', 350000.00, 'Sculpture', 'APPROVED', 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600'),
('antique-006', 'admin-001', 'Royal Rajasthani Mirror', 'Heavily ornamented teakwood mirror frame decorated with inlaid mirror mosaics from Jaipur.', 150000.00, 'Furniture', 'APPROVED', 'https://images.unsplash.com/photo-1596162954151-cd5415b30796?auto=format&fit=crop&q=80&w=600'),
('antique-007', 'admin-001', 'Mysore Rosewood Keepsake Box', '19th-century Mysore rosewood keepsake box with delicate ivory-imitation bone floral inlay.', 65000.00, 'Collectibles', 'APPROVED', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600'),
('antique-008', 'admin-001', 'Anglo-Indian Carved Armchair', 'Late Victorian period armchair featuring intricate floral carvings and cabriole legs.', 110000.00, 'Furniture', 'APPROVED', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600'),
('antique-009', 'admin-001', 'Peshwa Silver Bidri Hookah Base', 'Traditional Bidriware zinc-copper alloy vessel inlaid with pure silver wires from Deccan.', 78000.00, 'Metalware', 'APPROVED', 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600'),
('antique-010', 'admin-001', 'Kutch Embroidered Silk Tapestry', 'Color mirror-work silk panel hand-embroidered by Kutchi tribal artisans, circa 1880.', 55000.00, 'Textiles', 'APPROVED', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600');
