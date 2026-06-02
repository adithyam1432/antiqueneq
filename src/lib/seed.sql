-- Initial User Credentials for Testing
INSERT INTO users (id, name, email, password, role, status) VALUES 
('u1', 'Admin User', 'admin@antiquity.com', 'admin123', 'ADMIN', 'APPROVED'),
('u2', 'Premium Buyer', 'buyer@antiquity.com', 'buyer123', 'BUYER', 'APPROVED'),
('u3', 'Heritage Seller', 'seller@antiquity.com', 'seller123', 'SELLER', 'APPROVED');

-- Initial Seller Profile
INSERT INTO seller_profiles (user_id, business_name, business_address, tax_id, status) VALUES
('u3', 'Heritage Arts India', '123 Museum Road, Kolkata', 'TAX1234567', 'APPROVED');

-- Initial Antique Listing (Pending Approval)
INSERT INTO antiques (id, seller_id, title, description, price, category, image_url, status) VALUES
('a1', 'u3', 'Victorian Filigree Vase', 'A rare 19th-century silver filigree vase with architectural gold accents.', 125000, 'Ceramics', '', 'PENDING');
