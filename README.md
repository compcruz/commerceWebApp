# Compcruz

A modern e-commerce web application for online shopping, featuring secure payments, order management, and an admin dashboard.

---

## Project Overview
Compcruz is a full-stack e-commerce platform that allows users to browse products, manage a shopping cart, securely pay with Stripe, and track their orders. Admin users can manage products and update order statuses via a dedicated dashboard. The app also sends professional email notifications with PDF invoices upon order completion.

---

## Tech Stack
- **Frontend:** React (Vite), Material-UI, Stripe.js
- **Backend:** Java Spring Boot 3+, Stripe Java SDK, OpenPDF, Spring Mail
- **Database:** H2 (in-memory, for development)
- **Other:** JWT authentication, RESTful APIs, HTML email with PDF invoice attachment

---

## Major Features
- **User Authentication:** Register, login, JWT-based session
- **Product Catalog:** Browse, search, and view product details
- **Shopping Cart:** Add/remove products, quantity management
- **Stripe Payments:** Secure checkout with Stripe Elements
- **Order Management:** Place orders, view order history, delivery address capture
- **Email Notifications:** HTML order confirmation with PDF invoice (sent to user and admin)
- **Order Status Tracking:** Track order status (Pending, Paid, Shipped, Delivered, Cancelled)
- **Admin Dashboard:** Update order status, view all orders, manage products

---

## How to Use This App

### 1. Prerequisites
- Java 17+
- Node.js 18+
- (Recommended) [Maven](https://maven.apache.org/) for backend

### 2. Backend Setup
```sh
cd backend
# Install dependencies and build
mvn clean install
# Start the Spring Boot server
mvn spring-boot:run
```
- The backend runs on `http://localhost:8080`.
- Configure Stripe and email credentials in `backend/src/main/resources/application.properties`.

### 3. Frontend Setup
```sh
cd frontend
npm install
npm run dev
```
- The frontend runs on `http://localhost:5173`.
- Configure Stripe publishable key in `frontend/.env`.

### 4. Usage
- Register or log in as a user to shop and place orders.
- Log in as an admin (role: `admin`) to access the "🛠️ Admin" dashboard for order management.
- Orders placed will trigger email notifications with PDF invoice attachments.

### 5. Admin Features
- Click the "🛠️ Admin" tab (visible for admin users) to manage and update order statuses.
- All order updates are reflected in real-time for users.

---

## Screenshots
1. Login
   <img width="1329" height="856" alt="Screenshot 2025-07-19 at 1 06 25 AM" src="https://github.com/user-attachments/assets/7acb5c0b-21e5-4547-9791-e2c0ede5ab95" />

2. Register
   <img width="1338" height="857" alt="Screenshot 2025-07-19 at 1 06 45 AM" src="https://github.com/user-attachments/assets/f846ea38-e5b0-4642-95be-0e603c167a11" />

3. Products
   <img width="1320" height="855" alt="Screenshot 2025-07-19 at 1 11 09 AM" src="https://github.com/user-attachments/assets/87d48e32-ce3b-4e69-85b7-c54e65afaec8" />

4. Add Product
   <img width="1298" height="858" alt="Screenshot 2025-07-19 at 1 07 33 AM" src="https://github.com/user-attachments/assets/0f760de2-8fc9-4f08-aed0-7f4220aa964b" />

5. Shopping Cart and Payment
   <img width="1212" height="860" alt="Screenshot 2025-07-19 at 1 13 09 AM" src="https://github.com/user-attachments/assets/5bc82d44-ae23-40ab-9f3f-1c677ec6131c" />

6. Order
   <img width="1480" height="846" alt="Screenshot 2025-07-19 at 1 14 13 AM" src="https://github.com/user-attachments/assets/c99384d1-19a3-4d66-af6e-2bbdbc60f012" />

7. Email Notifcation
   <img width="1078" height="633" alt="Screenshot 2025-07-19 at 4 13 27 PM" src="https://github.com/user-attachments/assets/ab2aa2f9-94d6-4de4-9866-886af82ba042" />

8. Admin Order Dashboard
   <img width="1450" height="741" alt="Screenshot 2025-07-19 at 5 03 08 PM" src="https://github.com/user-attachments/assets/dce88878-a70c-407f-a72b-ec2830ffab26" />

