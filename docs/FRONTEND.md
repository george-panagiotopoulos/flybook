# SkyBook Frontend Documentation

## Overview

The frontend is built with React 18, Vite, and Tailwind CSS v4. It uses Zustand for state management and React Router for navigation.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── booking/           # Booking flow components
│   │   │   ├── ProgressBar.jsx
│   │   │   └── FlightSummary.jsx
│   │   ├── flights/           # Flight-related components
│   │   │   └── FlightCard.jsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   └── search/            # Search components
│   │       ├── SearchWidget.jsx
│   │       ├── AirportInput.jsx
│   │       ├── DateInput.jsx
│   │       └── PassengerSelector.jsx
│   │
│   ├── pages/
│   │   ├── booking/           # Booking flow pages
│   │   │   ├── PassengersPage.jsx
│   │   │   ├── SeatsPage.jsx
│   │   │   ├── ExtrasPage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   └── ConfirmationPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── SearchResultsPage.jsx
│   │   ├── MyTripsPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   │
│   ├── store/                 # Zustand stores
│   │   ├── searchStore.js
│   │   ├── bookingStore.js
│   │   └── userStore.js
│   │
│   ├── utils/
│   │   └── formatters.js      # Formatting utilities
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.js
├── postcss.config.js
└── tailwind.config.js
```

## State Management

### Search Store (`searchStore.js`)
Manages flight search state:
- Origin/destination airports
- Travel dates
- Passenger counts
- Search results
- Loading state

```javascript
import { useSearchStore } from './store/searchStore'

// Usage
const { origin, setOrigin, searchFlights } = useSearchStore()
```

### Booking Store (`bookingStore.js`)
Manages booking flow state:
- Selected flight and fare class
- Passenger details
- Seat assignments
- Selected extras
- Pricing calculation
- Current step tracking

```javascript
import { useBookingStore } from './store/bookingStore'

// Usage
const { selectedFlight, passengers, calculatePricing } = useBookingStore()
```

### User Store (`userStore.js`)
Manages user authentication:
- User profile
- Authentication state
- Booking history
- Login/logout/register actions

```javascript
import { useUserStore } from './store/userStore'

// Usage
const { user, isAuthenticated, login, logout } = useUserStore()
```

## Routing

Routes are defined in `App.jsx`:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Landing page with search |
| `/search` | SearchResultsPage | Flight search results |
| `/booking/passengers` | PassengersPage | Passenger details form |
| `/booking/seats` | SeatsPage | Seat selection |
| `/booking/extras` | ExtrasPage | Add-ons and extras |
| `/booking/payment` | PaymentPage | Payment processing |
| `/booking/confirmation` | ConfirmationPage | Booking confirmation |
| `/my-trips` | MyTripsPage | Booking history |
| `/login` | LoginPage | User login |
| `/register` | RegisterPage | User registration |

## Components

### SearchWidget
Main search form with airport inputs, date pickers, and passenger selector.

**Props:** None (uses searchStore)

### FlightCard
Displays flight information with fare options.

**Props:**
- `flight`: Flight object
- `onSelect`: Callback when fare is selected

### ProgressBar
Shows booking progress steps.

**Props:**
- `currentStep`: Current step number (1-5)

### FlightSummary
Sidebar component showing selected flight and pricing breakdown.

**Props:** None (uses bookingStore)

## Styling

The application uses Tailwind CSS v4 with custom configuration:

### Custom Colors
```css
/* Primary: Navy Blue */
--color-primary-500: #1a365d;

/* Accent: Orange */
--color-accent: #ed8936;

/* Success: Green */
--color-success: #22c55e;
```

### Custom Container
```css
.container-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
```

## Utility Functions

### formatters.js

```javascript
// Format duration in minutes to "Xh Ym"
formatDuration(435) // "7h 15m"

// Format price to "$X.XX"
formatPrice(450.50) // "$450.50"
```

## Development

### Running Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Environment Variables

Create a `.env` file for configuration:
```
VITE_API_URL=http://localhost:2345/api
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```
