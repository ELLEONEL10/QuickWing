QuickWing ✈️

A Modern Flight Booking Platform designed for speed, reliability, and user experience.

🌐 Live Demo

quikwing.vercel.app

📖 About The Project

QuickWing is a full-stack flight booking application that separates the user interface from business logic using a decoupled architecture. It features a responsive React frontend and a high-performance Python FastAPI backend, containerized with Docker for consistent deployment.

Key Features

Real-time Flight Search: Integration with RapidAPI (Kiwi.com) for live flight data.

User Authentication: Secure login and registration.

Booking Management: Users can book flights and view their history.

Tiered Access: Different user tiers for exclusive benefits.

Admin Dashboard: For managing flights, users, and bookings.

🛠️ Tech Stack

Frontend

Framework: React (v19)

Build Tool: Vite (v6)

Language: TypeScript

Styling: CSS Modules / Animations

Icons: Lucide React

AI Integration: Google GenAI SDK

Backend

Framework: FastAPI (Python 3.10+)

Server: Uvicorn / Gunicorn

Database: PostgreSQL (via SQLAlchemy & AsyncPG)

Caching: Redis

Task Queue: Celery / Arq

Containerization: Docker & Docker Compose

🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

Prerequisites

Ensure you have the following installed:

Docker Desktop

Node.js (v18+)

Python (v3.10+)

Git

1. Clone the Repository

git clone [https://github.com/elleonel10/quickwing.git](https://github.com/elleonel10/quickwing.git)
cd quickwing


2. Backend Setup

The backend utilizes a custom setup script for easy configuration.

cd backend

# 1. Run the setup script for local development
python setup.py local

# 2. Configure Environment Variables
# Open the newly created .env file and add your API keys:
# RAPIDAPI_KEY=9116e9e0c4msh9fbf18d4b0d0295p1a6c68jsn578dc2de4695
# RAPIDAPI_HOST=kiwi-com-cheap-flights.p.rapidapi.com

# 3. Start the Backend Services (API + DB + Redis)
docker compose up


Note: The API will be available at http://127.0.0.1:8000/docs

3. Frontend Setup

The frontend uses Vite for a fast development experience.

# Open a new terminal and navigate to the frontend directory
cd frontend

# 1. Install Dependencies
npm install

# 2. Run the Development Server
npm run dev


Note: The application will be running at http://localhost:5173

👥 Team Members

Fadi Abbara

Anas Zahran

Miras

Danylo

🎓 Supervisor

Prof. Ali Mehmood Khan

📄 License

This project is licensed under the MIT License
