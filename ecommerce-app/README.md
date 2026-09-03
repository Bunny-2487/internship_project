# MyShop - Simple E-commerce Website (Student Project)

This is a basic full stack e-commerce website I made while learning backend development.
It uses HTML, CSS, JavaScript, basic React (no build tools, just CDN), Node.js, Express,
MongoDB and JWT authentication.

## Folder Structure
```
ecommerce-app/
  backend/      -> Node.js + Express + MongoDB API
  frontend/     -> Simple React app (HTML/CSS/JS, no npm needed for frontend)
```

## Features
- User Register/Login with JWT (passwords hashed with bcrypt)
- View all products (fetched from MongoDB)
- Add to cart, change quantity, remove items (cart works in browser, no login needed to browse)
- Checkout (saves order to database) - requires login
- View "My Orders" page after checkout
- Logged in user stays logged in after refresh (using localStorage)

## How to Run

### 1. Backend Setup
```
cd backend
npm install
```
- Copy `.env.example` to `.env` and update values if needed (Mongo connection string, JWT secret).
- Make sure MongoDB is running locally (or use a MongoDB Atlas URI in `.env`).
- Add some sample products to the database:
```
node seed.js
```
- Start the server:
```
npm start
```
Server will run on `http://localhost:5000`

### 2. Frontend Setup
No installation needed! Just open `frontend/index.html` in your browser
(or use VS Code Live Server extension for best results, since it avoids
some browser file:// issues).

Make sure the backend is running first, otherwise products won't load.

## Notes / What I learned making this
- How to hash passwords with bcryptjs instead of storing plain text
- How JWT tokens work (signing, verifying, sending in headers)
- Connecting Express to MongoDB using Mongoose
- Building protected routes using middleware
- Basic React using hooks (useState, useEffect) without create-react-app
- Managing simple "pages" with state instead of react-router (haven't learned that yet)

## Things I want to improve later
- Add product search and filtering
- Add an admin panel to add/edit products from the UI
- Use react-router instead of manual page state
- Add proper image upload instead of just image URLs
- Better error handling and loading states
