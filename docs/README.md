# SkyBook - Flight Booking Application

SkyBook is a modern flight booking application built with React and Flask. It provides a seamless experience for searching flights, booking tickets, and managing travel itineraries.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Features](#features)
- [Project Structure](#project-structure)
- [API Documentation](./API.md)
- [Frontend Guide](./FRONTEND.md)
- [Backend Guide](./BACKEND.md)

## Overview

SkyBook is designed as a demonstration flight booking platform featuring:
- Flight search with flexible date and passenger options
- Multi-step booking flow with seat selection
- User authentication and booking history
- Responsive design for all devices

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│              React + Vite + Tailwind CSS                │
│                   (Port 5173)                           │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST
                      ▼
┌─────────────────────────────────────────────────────────┐
│                      Backend                            │
│                   Flask REST API                        │
│                   (Port 2345)                           │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   Data Layer                            │
│           JSON Files + Dynamic Generation               │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack

**Frontend:**
- React 18 with hooks
- Vite for build tooling
- Tailwind CSS v4 for styling
- Zustand for state management
- React Router v6 for navigation
- Lucide React for icons
- React Day Picker for date selection
- Axios for HTTP requests

**Backend:**
- Flask 3.x
- Flask-CORS for cross-origin requests
- Dynamic flight generation with realistic data

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/george-panagiotopoulos/flybook.git
cd skybook
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server:
```bash
cd backend
python app.py
```
The API will be available at `http://localhost:2345`

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`

## Features

### Flight Search
- Search by origin and destination airports
- Select departure and return dates
- Specify number of passengers (adults, children, infants)
- Choose trip type (one-way, round-trip)

### Search Results
- View available flights with pricing
- Sort by price, duration, or departure time
- Filter by number of stops
- Select fare class (Economy Basic, Economy Standard, etc.)

### Booking Flow
1. **Passengers**: Enter passenger details (name, date of birth, nationality)
2. **Seats**: Interactive seat map with extra legroom options
3. **Extras**: Add travel insurance, priority boarding, extra baggage, meals
4. **Payment**: Secure card payment with promo code support
5. **Confirmation**: Booking reference and itinerary summary

### User Features
- User registration and login
- View booking history (My Trips)
- Booking status tracking

## Project Structure

```
skybook/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand state stores
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Root component
│   └── package.json
│
├── backend/                  # Flask backend API
│   ├── app/
│   │   ├── routes/          # API route handlers
│   │   └── data/            # JSON data and generators
│   └── app.py               # Application entry point
│
└── docs/                     # Documentation
    ├── README.md            # This file
    ├── API.md               # API documentation
    ├── FRONTEND.md          # Frontend guide
    └── BACKEND.md           # Backend guide
```

## Demo Credentials

For testing the login functionality:
- Email: `demo@skybook.com`
- Password: `demo123`

## Promo Codes

For testing the payment flow:
- Use code `SKYBOOK10` for 10% discount

## License

This project is for demonstration purposes.
