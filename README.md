# TextileHub - E-Commerce Web App

A lightweight e-commerce application for clothing fabrics, curtains, and bedding products.
https://essential-e-commerce-7hf8.bolt.host/
[Visit-Demo]([https://essential-e-commerce-7hf8.bolt.host/])
[Visit Demo]([https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3-nnf1sesr--5173--365214aa.local-credentialless.webcontainer-api.io/])

## Features

### User Features
- Browse products with category filters and search
- Add products to cart
- Unified login/register modal
- User dashboard with:
  - Profile management
  - Shopping cart with quantity controls
  - Order history
  - Checkout functionality

### Admin Features
- Product management (add, edit, delete)
- Order management with status updates
- Category-based organization

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Supabase (Database + Authentication)
- Vite

## Getting Started

The application is already configured and ready to use. Sample products have been added to the database.

### Default Access

To access admin features, you need to set the user's role to 'admin' in the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Select a user
4. Edit their raw_app_meta_data to include: `{"role": "admin"}`

## Database Schema

- **categories**: Product categories (Clothing Fabrics, Curtains, Bedding)
- **products**: Product catalog with pricing, stock, and images
- **cart_items**: User shopping carts
- **orders**: Order records
- **order_items**: Items within each order

All tables have Row Level Security (RLS) enabled for data protection.
