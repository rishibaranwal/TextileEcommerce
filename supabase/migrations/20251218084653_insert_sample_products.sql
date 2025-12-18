/*
  # Insert Sample Products

  1. Sample Data
    - Adds sample products across all three categories
    - Includes clothing fabrics, curtains, and bedding items
    - Each product has realistic pricing and stock levels
*/

-- Insert sample products for Clothing Fabrics
INSERT INTO products (name, description, price, category_id, image_url, stock) 
SELECT 
  'Cotton Poplin Fabric',
  'Lightweight and breathable cotton poplin, perfect for shirts and dresses. 100% cotton.',
  12.99,
  id,
  'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg',
  50
FROM categories WHERE name = 'Clothing Fabrics';

INSERT INTO products (name, description, price, category_id, image_url, stock) 
SELECT 
  'Linen Blend Fabric',
  'Premium linen blend with a natural texture. Ideal for summer clothing and lightweight garments.',
  18.99,
  id,
  'https://images.pexels.com/photos/6214485/pexels-photo-6214485.jpeg',
  35
FROM categories WHERE name = 'Clothing Fabrics';

INSERT INTO products (name, description, price, category_id, image_url, stock) 
SELECT 
  'Silk Satin Fabric',
  'Luxurious silk satin with a smooth finish. Perfect for elegant dresses and blouses.',
  34.99,
  id,
  'https://images.pexels.com/photos/6214481/pexels-photo-6214481.jpeg',
  20
FROM categories WHERE name = 'Clothing Fabrics';

INSERT INTO products (name, description, price, category_id, image_url, stock) 
SELECT 
  'Denim Fabric',
  'Durable cotton denim fabric, perfect for jeans, jackets, and casual wear.',
  15.99,
  id,
  'https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg',
  45
FROM categories WHERE name = 'Clothing Fabrics';

-- Insert sample products for Curtains
INSERT INTO products (name, description, price, category_id, image_url, stock) 
SELECT 
  'Velvet Blackout Curtain',
  'Elegant velvet blackout curtains that block 99% of light. Available in rich colors.',
  49.99,
  id,
  'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg',
  25
FROM categories WHERE name = 'Curtains';

INSERT INTO products (name, description, price, category_id, image_url, stock) 
SELECT 
  'Sheer Linen Curtain',
  'Light and airy sheer linen curtains that filter natural light beautifully.',
  29.99,
  id,
  'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg',
  40
FROM categories WHERE name = 'Curtains';

INSERT INTO products (name, description, price, category_id, image_url, stock) 
SELECT 
  'Thermal Insulated Curtain',
  'Energy-efficient thermal curtains that help regulate room temperature.',
  39.99,
  id,
  'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg',
  30
FROM categories WHERE name = 'Curtains';

-- Insert sample products for Bedding
INSERT INTO products (name, description, price, category_id, image_url, stock) 
SELECT 
  'Egyptian Cotton Sheet Set',
  'Luxurious 800-thread-count Egyptian cotton sheets. Includes fitted sheet, flat sheet, and pillowcases.',
  89.99,
  id,
  'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
  15
FROM categories WHERE name = 'Bedding';

INSERT INTO products (name, description, price, category_id, image_url, stock) 
SELECT 
  'Down Alternative Comforter',
  'Hypoallergenic down alternative comforter with superior warmth and comfort.',
  69.99,
  id,
  'https://images.pexels.com/photos/1034620/pexels-photo-1034620.jpeg',
  22
FROM categories WHERE name = 'Bedding';

INSERT INTO products (name, description, price, category_id, image_url, stock) 
SELECT 
  'Silk Pillowcase Set',
  'Premium mulberry silk pillowcases, gentle on skin and hair. Set of 2.',
  45.99,
  id,
  'https://images.pexels.com/photos/271897/pexels-photo-271897.jpeg',
  30
FROM categories WHERE name = 'Bedding';

INSERT INTO products (name, description, price, category_id, image_url, stock) 
SELECT 
  'Linen Duvet Cover',
  'Natural linen duvet cover with a relaxed, lived-in look. Breathable and durable.',
  79.99,
  id,
  'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
  18
FROM categories WHERE name = 'Bedding';