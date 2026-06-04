-- Initial User Credentials for Testing
INSERT INTO users (id, name, email, password, role, status) VALUES 
('u1', 'Admin User', 'admin@antiques.com', 'admin123', 'ADMIN', 'APPROVED'),
('u2', 'Premium Buyer', 'buyer@antiques.com', 'buyer123', 'BUYER', 'APPROVED');

-- Initial Antique Listing (Pending Approval)
INSERT INTO antiques (id, seller_id, title, description, price, category, image_url, status) VALUES
('a1', 'u1', 'Victorian Filigree Vase', 'A rare 19th-century silver filigree vase with architectural gold accents.', 125000, 'Ceramics', '', 'PENDING');

