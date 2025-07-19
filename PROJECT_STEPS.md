# Compcruz E-commerce Web App: Step-by-Step Project Journey

This document summarizes all the key steps, decisions, and enhancements made during the development of the Compcruz e-commerce web application, from initial setup to advanced features and deployment.

---

## 1. Project Initialization
- **Created project structure:**
  - `/backend` — Spring Boot (Java) REST API
  - `/frontend` — React web app (Vite + Material UI)
- **Initialized Git repository** and set up remote GitHub repo for version control.

## 2. Backend Setup (Spring Boot)
- **Generated Spring Boot starter project** (with Maven, Java 17+).
- **Configured H2 in-memory database** for development in `application.properties`.
- **Created core entities:**
  - `User` (id, username, password, email, role)
  - `Product` (id, name, description, price, stock, imageUrl)
  - `Order` (id, user, products, orderDate)
- **Implemented JPA repositories:**
  - `UserRepository`, `ProductRepository`, `OrderRepository`
- **Implemented REST controllers:**
  - `AuthController` (login, register)
  - `ProductController` (CRUD)
  - `OrderController` (order placement, history)
- **Added security:**
  - JWT authentication for protected endpoints
  - Password hashing with BCrypt
  - Enabled H2 console for dev

## 3. Frontend Setup (React)
- **Created React app** using Vite.
- **Installed dependencies:**
  - React Router, Material UI, etc.
- **Set up folder structure:**
  - `src/AuthContext.jsx`, `ProductList.jsx`, `ProductForm.jsx`, `OrderHistory.jsx`, etc.
- **Implemented authentication context** to manage login state, JWT, and user role.

## 4. Core Features Implementation
- **User authentication:**
  - Login and registration forms
  - JWT token and role handling (frontend + backend)
- **Product browsing:**
  - Product list, product details, add to cart
- **Shopping cart and checkout:**
  - Cart context, order placement, order history

## 5. Role-Based Access Control (RBAC)
- **Enhanced AuthContext and backend:**
  - Added `role` to user model and registration
  - Allowed admin/user role selection at registration (frontend demo)
  - Backend registration accepts and stores role
  - Login returns role in response
- **Frontend restrictions:**
  - Only admins can add/edit products
  - Regular users can only browse, add to cart, and checkout
  - UI elements (Add Product, Edit) hidden or disabled for non-admins

## 6. UI/UX Enhancements (Etsy Theme)
- **Restyled Add/Edit Product form** for an Etsy-like appearance:
  - Soft backgrounds, rounded corners, accent orange, modern card layout
  - Product image preview on form
- **Improved Orders page:**
  - Displays product images for each item in order history
- **General UI improvements:**
  - Responsive layouts, modern buttons, typography

## 7. Testing and Debugging
- **Verified role-based UI and API behavior**
- **Debugged frontend/backend integration:**
  - Fixed case-sensitivity issues with role checks
  - Ensured correct role propagation on login/register
- **Used browser DevTools** to inspect localStorage and API payloads

## 8. Deployment Preparation
- **Created and updated README.md** with project structure and setup
- **Set up GitHub repo and pushed code** (using PAT for authentication)

## 9. Useful Tips and Troubleshooting
- **If you see permission errors pushing to GitHub:**
  - Use a Personal Access Token (PAT) instead of password
  - Ensure your GitHub user has push access to the repo
- **To view the H2 database:**
  - Enable H2 console in `application.properties`
  - Access via `http://localhost:8080/h2-console`

---

## Summary
This document captures the end-to-end workflow for building, securing, and styling the Compcruz e-commerce app. For further improvements, see the README or open issues in your GitHub repo!
