# TasteYum - Full Stack Food Ordering Platform

A production-ready food ordering application built with the MERN stack, featuring real-time order tracking via WebSockets and integrated Razorpay payment gateway.

**Live Demo:** [tasteyum.vercel.app](https://taste-yum.vercel.app) (update with your actual URL)

## Features

### Core
- **User Authentication** — Signup/Login with bcrypt password hashing and JWT tokens
- **Email Validation** — Duplicate email detection during registration
- **Food Catalog** — Browse food items grouped by category with real-time search
- **Shopping Cart** — Add, update quantity, remove items with Context API + useReducer

### Payment
- **Razorpay Integration** — Secure payment flow with order creation, checkout modal, and server-side signature verification (HMAC-SHA256)
- **Test Mode** — Fully functional with Razorpay test credentials

### Real-Time Order Tracking
- **WebSocket Integration** — Socket.io for live status updates without page refresh
- **4-Stage Tracker** — Order Placed → Preparing → Out for Delivery → Delivered
- **Auto-Incrementing Order IDs** — Sequential IDs (ORD-1001, ORD-1002) using atomic MongoDB counters
- **Live Status Stepper** — Visual progress indicator on the My Orders page

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Bootstrap 5, Socket.io Client |
| Backend | Node.js, Express.js, Socket.io |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Payments | Razorpay |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```
TasteYum/
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Navbar, Card, Footer, ContextReducer
│   │   └── screens/         # Home, Login, Signup, Cart, MyOrder
│   ├── vercel.json          # Vercel deployment config
│   └── package.json
├── backend/                 # Express API server
│   ├── models/              # User, Order, OrderStatus, Counter
│   ├── routes/              # CreateUser, DisplayData, OrderData, Payment
│   ├── db.js                # MongoDB connection
│   ├── index.js             # Express + Socket.io server
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/createuser` | Register new user |
| POST | `/api/loginuser` | Login, returns JWT |
| POST | `/api/foodData` | Fetch food items and categories |
| POST | `/api/orderData` | Place order, triggers tracking |
| POST | `/api/myorderData` | Fetch user's order history with statuses |
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment signature |

## Running Locally

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Razorpay test account

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/TasteYum.git
cd TasteYum

# Backend
cd backend
npm install
# Create backend/.env with:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
# RAZORPAY_KEY_ID=rzp_test_xxx
# RAZORPAY_KEY_SECRET=your_secret
npm start

# Frontend (new terminal)
cd frontend
npm install
# Create frontend/.env with:
# REACT_APP_API_URL=http://localhost:5000
# REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxx
npm start
```

The app runs on `http://localhost:3000` with the API on `http://localhost:5000`.

## Architecture Highlights

- **Real-time updates** — Socket.io rooms per user email for targeted event delivery
- **Atomic counters** — MongoDB `findOneAndUpdate` with `$inc` for race-condition-safe order ID generation
- **Payment security** — Server-side HMAC-SHA256 signature verification, no client-side trust
- **State management** — Context API with useReducer for cart (avoids Redux overhead)
- **Environment separation** — All secrets in `.env` files, gitignored
