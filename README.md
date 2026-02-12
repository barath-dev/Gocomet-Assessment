# 🎮 High-Performance Gaming Leaderboard API

A robust, scalable leaderboard system capable of handling millions of records with real-time updates. Built with Node.js, PostgreSQL, Redis, and New Relic monitoring, designed to handle high concurrency with ACID compliance.

## 🚀 Key Features
* **Atomic Score Submission:** Uses Database Transactions (`Prisma.$transaction`) to ensure data integrity between game sessions and leaderboard updates.
* **High-Performance Reads:** Implements Redis caching (TTL 15s) for the Top 10 leaderboard, reducing database load by ~95% under stress.
* **Optimized Rank Calculation:** Utilizes B-Tree Indexes on `total_score` to enable O(log N) rank retrieval for any user among millions.
* **Real-Time Monitoring:** Integrated New Relic APM to track throughput, latency, and database bottlenecks.
* **Security:** Rate limiting enabled to prevent API abuse.
* **Real-time Frontend:** React-based frontend that auto-refreshes the leaderboard every 5 seconds.

## 🛠 Tech Stack

### Backend
* **Runtime:** Node.js & TypeScript
* **Framework:** Express.js
* **Database:** PostgreSQL (Primary), Redis (Caching)
* **ORM:** Prisma
* **Monitoring:** New Relic
* **Testing:** Python (Multi-threaded Load Simulation)

### Frontend
*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **Styling:** CSS

## ⚙️ Prerequisites
* Node.js (v18+)
* Docker (for Redis/Postgres) OR Local instances
* Python 3.x (for load simulation)

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd gaming-leaderboard
```

### 2. Backend Setup (`/server`)

#### install Dependencies
```bash
cd server
npm install
```

#### Environment Configuration
Create a `.env` file in the `server` directory:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/gaming_db"
REDIS_URL="redis://localhost:6379"
NEW_RELIC_APP_NAME="Gaming Leaderboard (Dev)"
NEW_RELIC_LICENSE_KEY="your_new_relic_license_key"
```

#### Database Setup
Initialize the database schema and populate it with 1 Million users (Seed):
```bash
# Push schema to DB
npx prisma db push

# Seed 1M users and 5M game sessions (Takes ~30-60s)
npm run seed
```

#### Running the Backend
```bash
# Development Mode (with New Relic & Hot Reload)
npm run dev

# Production Build
npm run build
npm start
```
Server runs on `http://localhost:3000`

### 3. Frontend Setup (`/client`)

#### Install Dependencies
```bash
cd client
npm install
```

#### Running the Frontend
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🧪 Load Testing & Simulation
A multi-threaded Python script is included to simulate real-world traffic patterns (concurrent writes & reads).

```bash
cd server
# Install dependencies
pip3 install requests

# Run simulation
npm run simulate_load
```
This script spawns 5 concurrent threads to submit scores and fetch leaderboards continuously.

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/leaderboard/submit` | Submit a new score (Atomic update) |
| `GET` | `/api/leaderboard/top` | Get Top 10 players (Cached via Redis) |
| `GET` | `/api/leaderboard/rank/:userId` | Get specific user rank (Real-time DB lookup) |

## 📊 Performance & Monitoring
Performance reports are available in the docs/ folder.
* **Throughput:** Tested up to 600 RPM.
* **Latency:** Average read latency < 5ms (Cache Hit).
* **Monitoring:** https://onenr.io/0LREZkOq8ja

## 📂 Project Structure
```plaintext
gaming-leaderboard/
├── client/            # React Frontend
│   ├── src/
│   │   ├── components/
│   │   └── App.tsx
│   └── package.json
├── server/            # Node.js Backend
│   ├── src/
│   │   ├── controllers/   # Business logic (Transactions, Caching)
│   │   ├── routes/        # API Routes
│   │   ├── utils/         # Redis & Prisma Clients
│   │   └── app.ts         # Entry point with New Relic
│   ├── prisma/            # Schema & Seed scripts
│   ├── scripts/           # Python Load Simulator
│   └── docs/              # Performance Reports
└── README.md          # Project Documentation
```
