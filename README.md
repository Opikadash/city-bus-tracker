# City Bus Tracker 🚍

**Modern real-time bus tracking and journey planning web application**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Production%20Ready-blue.svg)](https://hub.docker.com/)

## ✨ Features

- 🗺️ **Interactive Journey Planner** - Find optimal routes with transfers & ETAs
- 📍 **Live Bus Tracking** - Real-time GPS positions on Leaflet maps
- 🎫 **Digital Ticketing** - QR code tickets with seat selection
- 👤 **User Accounts** - Authentication, favorites, trip history
- ⚡ **Real-time Updates** - WebSocket updates for live tracking
- 📱 **PWA Ready** - Installable, offline-capable
- 🔒 **Secure** - JWT auth, HTTPS-ready Docker deployment

## 🛠 Tech Stack

```
Frontend:    React 18 + TypeScript + Vite + Tailwind CSS + Leaflet.js
Backend:     Node.js + Express + TypeScript + Prisma ORM
Database:    PostgreSQL 15 + Redis (caching/WebSockets)
Deployment:  Docker Compose + Nginx (production-ready)
Real-time:   WebSocket (Socket.io)
Styling:     Tailwind CSS + PostCSS
Build:       Vite + esbuild
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+

### 1. Clone & Setup
```bash
git clone https://github.com/Opikadash/city-bus-tracker.git
cd city-bus-tracker
```

### 2. Production Deployment (Recommended)
```bash
# Start all services (frontend, backend, postgres, redis, nginx)
docker compose -f docker-compose.prod.yml up -d --build

# Access app at http://localhost
```

### 3. Development
```bash
# Install dependencies
npm install

# Start services:
npm run dev          # Development mode
# OR
docker compose up    # Containerized dev
```

**URLs:**
- App: http://localhost (production) / http://localhost:5173 (dev)
- Backend API: http://localhost:3000
- Database: postgres://postgres:password@localhost:5432/citybus

## 📋 Environment Setup

Copy example env files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**backend/.env:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/citybus"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3000
```

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/tracking/buses/:routeId` | Live bus positions |
| `POST` | `/api/planner` | Journey planning |
| `POST` | `/api/booking` | Book tickets |

## 🗺️ Sample Data

Pre-loaded with 50+ bus stops, 20+ routes across a fictional city.

**Test Journey:** Central Station → Airport Terminal

## 🔧 Docker Commands

```bash
# Production
docker compose -f docker-compose.prod.yml up -d --build

# Development  
docker compose up -d --build

# Logs
docker compose logs -f frontend
docker compose logs -f backend

# Stop
docker compose down
```

## 📊 Project Structure

```
city-bus-tracker/
├── backend/           # Express + TypeScript API
├── frontend/          # React + Vite + Tailwind SPA
├── shared/            # Shared TypeScript types
├── docker-compose.prod.yml  # Production deployment
├── docker-compose.yml       # Development
└── README.md
```

## 🎯 Demo Features

1. **Live Tracking**: Watch buses move in real-time
2. **Smart Planner**: Multi-modal routes with transfers  
3. **QR Tickets**: Generate scannable tickets
4. **Responsive**: Works on mobile/desktop
5. **Production Ready**: Dockerized, HTTPS-ready

## 🧑‍💻 Development Scripts

```bash
npm run dev          # Start dev servers
npm run build        # Build for production
npm run lint         # ESLint
npm run format       # Prettier
```

## 🔒 Security & Production

- ✅ JWT Authentication
- ✅ Input validation (Zod)
- ✅ Rate limiting
- ✅ CORS configured
- ✅ HTTPS via Nginx
- ✅ Docker security best practices

## 📈 Performance

- ⚡ Vite hot reload (<50ms)
- 🎯 Code splitting
- 📦 Bundle size ~150KB gzipped
- 🚀 Server-side prerendering ready

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push & PR

## 📄 License

MIT - See [LICENSE](LICENSE) file

## 🙏 Acknowledgments

Built with ❤️ using open-source tools. Inspired by real-world transit apps.

---

⭐ **Star on GitHub** if you find this useful!
