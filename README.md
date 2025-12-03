# SkyBook - Flight Booking Application

A modern flight booking application built with React and Flask, featuring a complete booking flow, user authentication, and trip management.

## Features

- **Flight Search** - Search flights by origin, destination, dates, and passengers
- **Smart Results** - Sort by price, duration, or departure time with filtering options
- **Complete Booking Flow** - 5-step process: Passengers > Seats > Extras > Payment > Confirmation
- **Interactive Seat Map** - Visual seat selection with extra legroom options
- **Travel Extras** - Add insurance, priority boarding, extra baggage, and meal preferences
- **User Authentication** - Login/register with booking history
- **My Trips** - View and manage past bookings

## Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS v4
- Zustand (state management)
- React Router v6
- Axios

**Backend:**
- Flask 3.x
- Flask-CORS
- Dynamic flight generation

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/george-panagiotopoulos/flybook.git
cd flybook
```

2. **Setup Backend**
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on http://localhost:2345

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## Demo Credentials

For testing login functionality:
- **Email:** `demo@skybook.com`
- **Password:** `demo123`

## Promo Codes

Try `SKYBOOK10` at checkout for 10% off!

## Project Structure

```
skybook/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand state stores
│   │   └── services/     # API services
│   └── package.json
│
├── backend/           # Flask API
│   ├── app/
│   │   ├── routes/       # API endpoints
│   │   └── data/         # Mock data & generators
│   └── app.py
│
└── docs/              # Documentation
    ├── API.md
    ├── FRONTEND.md
    └── BACKEND.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/airports/search` | Search airports |
| GET | `/api/flights/search` | Search flights |
| POST | `/api/booking` | Create booking |
| GET | `/api/booking/:id` | Get booking details |

See [docs/API.md](docs/API.md) for full API documentation.

## Screenshots

The application includes:
- Home page with search widget
- Search results with flight cards
- Passenger details form
- Interactive seat map
- Extras selection (insurance, baggage, meals)
- Secure payment form
- Booking confirmation

## License

This project is for demonstration purposes.

---

Built with React + Flask
