# ✈️ QuickWing — Modern Flight Booking Platform

![React](https://img.shields.io/badge/React-19-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-green)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Active-success)

**QuickWing** is a full-stack flight booking platform designed for **speed, scalability, and a seamless user experience**.  
It combines a modern **React + TypeScript frontend** with a **FastAPI backend**, powered by real-time flight data and deployed using Docker.

🔗 **Live Demo:** https://quikwing.vercel.app

---

## 🚀 Features

- ✈️ **Real-Time Flight Search**  
  Live flight data via RapidAPI (Kiwi.com)


- 📑 **Booking Management**  
  Book flights and view booking history


- ⚡ **High Performance**  
  Redis caching & async database operations

---

## 🧠 Architecture Overview

QuickWing follows a **decoupled, scalable architecture**:

Frontend (React + Vite)
|
| REST API
v
Backend (FastAPI)
|
├── PostgreSQL (Database)
├── Redis (Cache)
└── Celery / Arq (Background Tasks)


All services are containerized using **Docker Compose** for consistency across environments.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React v19
- **Build Tool:** Vite v6
- **Language:** TypeScript
- **Styling:** CSS Modules & Animations
- **Icons:** Lucide React
- **AI:** Google GenAI SDK

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **Server:** Uvicorn / Gunicorn
- **Database:** PostgreSQL (SQLAlchemy + AsyncPG)
- **Caching:** Redis
- **Task Queue:** Celery / Arq
- **Containerization:** Docker & Docker Compose

---

## 📁 Project Structure
```
quickwing/
│
├── backend/
│ ├── src/
│ │ ├── api/
│ │ ├── core/
│ │ ├── models/
│ │ ├── services/
│ │ └── main.py
│ ├── docker-compose.yml
│ ├── setup.py
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ └── main.tsx
│ ├── vite.config.ts
│ └── package.json
│
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### ✅ Prerequisites

Ensure you have:

- Docker Desktop
- Node.js v18+
- Python v3.10+
- Git

---

## 1️⃣ Clone the Repository

```
git clone https://github.com/elleonel10/quickwing.git
cd quickwing
```
2️⃣ Backend Setup

```
cd backend
```
# Run setup script
```
python setup.py local
```
Configure Environment Variables
Edit .env or src/.env:

env
```
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=kiwi-com-cheap-flights.p.rapidapi.com
```
Start Backend Services
```
docker compose up
```
📌 API Documentation:
http://127.0.0.1:8000/docs

3️⃣ Frontend Setup
```
cd frontend
```
# Install dependencies

```
npm install
```
# Run development server
```
npm run dev
```
📌 Frontend URL:
http://localhost:5173

👥 Team
===
Fadi Abbara
===
Anas Zahran
===
Miras
===
Danylo
===
📄 License
This project is licensed under the MIT License.
See the LICENSE file for details.

⭐ Support
If you find this project useful, please consider giving it a ⭐ on GitHub.
