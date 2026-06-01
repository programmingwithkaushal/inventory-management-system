# Inventory & Order Management System

A production-ready, containerized full-stack application built for seamless inventory and fulfillment tracking. This project features a robust backend API and a premium, responsive React dashboard.

## Tech Stack
- **Frontend**: React, Vite, React Router, Recharts, Lucide Icons
- **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL
- **Infrastructure**: Docker, Docker Compose
- **Deployment**: Render (Backend & DB), Vercel (Frontend)

## 🌟 Bonus Feature: JWT Authentication
**Additional feature: JWT-based authentication.**
The entire application is securely protected behind a custom JWT Authentication layer. Unauthenticated users are strictly blocked and redirected to a custom-built Login portal.

- Fully database-backed multi-user authentication with secure `bcrypt` password hashing.
- API endpoints are protected using FastAPI `Depends(get_current_user)`.
- Frontend utilizes local storage and Axios interceptors for smooth session management.
- Features a beautiful glassmorphic login interface: "Welcome to **Inventory Management**"

## Features
- **Dashboard Analytics**: Real-time charts for stock levels and revenue tracking.
- **Relational Integrity**: Strict backend constraints prevent accidental deletion of products/customers with active orders.
- **Inventory Alerts**: Built-in modal alerts for low-stock items.
- **Search Capabilities**: Instant, real-time table filtering across all entities.
- **Premium Aesthetics**: Fully responsive Dark Mode UI featuring glassmorphism and micro-animations.

## Running Locally

1. Clone the repository
2. Ensure Docker and Docker Compose are installed.
3. Run the application:
```bash
docker compose up --build
```
4. Access the frontend at `http://localhost:5173`
5. Use the backend `/docs` endpoint (or an API client) to `POST` to `/register` and create your first administrator account, then log in via the frontend!

## Submission Artifacts
- **Docker Hub Backend Image**: [codingwithkaushal/inventory-backend](https://hub.docker.com/r/codingwithkaushal/inventory-backend)
- **Live Frontend**: Deployed on Vercel
- **Live Backend**: Deployed on Render
