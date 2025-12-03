# SkyBook Backend Documentation

## Overview

The backend is a Flask REST API that provides endpoints for searching airports, flights, and managing bookings. It uses dynamically generated data to simulate a real flight booking system.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py            # Flask app factory
│   ├── routes/
│   │   ├── airports.py        # Airport search endpoint
│   │   ├── flights.py         # Flight search endpoint
│   │   └── booking.py         # Booking endpoints
│   └── data/
│       ├── airports.json      # Airport data
│       ├── airlines.json      # Airline data
│       └── flight_generator.py # Dynamic flight generation
│
├── app.py                      # Application entry point
├── config.py                   # Configuration settings
└── requirements.txt            # Python dependencies
```

## Configuration

Configuration is managed in `config.py`:

```python
class Config:
    DEBUG = True
    SECRET_KEY = 'your-secret-key'

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
```

## Flask Application Factory

The app factory pattern is used in `app/__init__.py`:

```python
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # Enable CORS
    CORS(app, origins=[
        'http://localhost:5173',
        'http://localhost:5174'
    ])

    # Register blueprints
    from app.routes import airports, flights, booking
    app.register_blueprint(airports.bp)
    app.register_blueprint(flights.bp)
    app.register_blueprint(booking.bp)

    return app
```

## Route Blueprints

### Airports (`routes/airports.py`)

```python
from flask import Blueprint, request, jsonify

bp = Blueprint('airports', __name__, url_prefix='/api/airports')

@bp.route('/search')
def search_airports():
    query = request.args.get('q', '')
    # Search logic...
    return jsonify(results)
```

### Flights (`routes/flights.py`)

```python
bp = Blueprint('flights', __name__, url_prefix='/api/flights')

@bp.route('/search')
def search_flights():
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    date = request.args.get('date')
    # Generate flights...
    return jsonify({'outbound': flights, 'return': []})
```

### Bookings (`routes/booking.py`)

```python
bp = Blueprint('booking', __name__, url_prefix='/api/booking')

@bp.route('', methods=['POST'])
def create_booking():
    data = request.json
    # Create booking...
    return jsonify({'success': True, 'booking': booking})

@bp.route('/<booking_id>')
def get_booking(booking_id):
    # Retrieve booking...
    return jsonify(booking)
```

## Data Files

### airports.json

Contains 30 major world airports:

```json
[
  {
    "code": "JFK",
    "name": "John F. Kennedy International Airport",
    "city": "New York",
    "country": "United States",
    "timezone": "America/New_York",
    "lat": 40.6413,
    "lng": -73.7781
  }
]
```

### airlines.json

Contains 20 major airlines:

```json
[
  {
    "code": "AA",
    "name": "American Airlines",
    "country": "United States",
    "hub": "DFW"
  }
]
```

## Flight Generator

The flight generator (`data/flight_generator.py`) creates realistic flight data:

```python
def generate_flights(origin, destination, date, count=10):
    """
    Generate random flights between two airports.

    Args:
        origin: Origin airport code
        destination: Destination airport code
        date: Departure date
        count: Number of flights to generate

    Returns:
        List of flight dictionaries
    """
    flights = []

    for _ in range(count):
        flight = {
            'id': generate_id(),
            'flight_number': generate_flight_number(),
            'airline': random_airline(),
            'departure': {...},
            'arrival': {...},
            'duration_minutes': calculate_duration(),
            'fares': generate_fares()
        }
        flights.append(flight)

    return flights
```

### Flight Generation Logic

1. **Flight Number**: Random airline code + 3-4 digit number
2. **Departure Time**: Random time between 6 AM and 10 PM
3. **Duration**: Based on distance between airports (100-1500 minutes)
4. **Pricing**: Base price with variations by fare class
5. **Available Seats**: Random availability per fare class

## Running the Server

### Development
```bash
cd backend
python app.py
```

Server runs on `http://localhost:2345`

### Production (with Gunicorn)
```bash
gunicorn -w 4 -b 0.0.0.0:2345 app:create_app()
```

## Dependencies

```
flask>=3.0.0
flask-cors>=4.0.0
python-dateutil>=2.8.0
```

## Error Handling

All routes include error handling:

```python
@bp.route('/search')
def search():
    try:
        # Logic...
        return jsonify(results)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500
```

## Adding New Routes

1. Create a new file in `app/routes/`
2. Define a Blueprint
3. Add route handlers
4. Register the blueprint in `app/__init__.py`

Example:
```python
# app/routes/new_feature.py
from flask import Blueprint, jsonify

bp = Blueprint('new_feature', __name__, url_prefix='/api/new-feature')

@bp.route('/endpoint')
def endpoint():
    return jsonify({'status': 'ok'})
```

```python
# app/__init__.py
from app.routes import new_feature
app.register_blueprint(new_feature.bp)
```

## Testing

Run tests with pytest:
```bash
pip install pytest
pytest
```

## Production Considerations

1. **Environment Variables**: Use environment variables for sensitive config
2. **Database**: Replace JSON files with a proper database
3. **Authentication**: Implement JWT or session-based auth
4. **Rate Limiting**: Add rate limiting with Flask-Limiter
5. **Logging**: Configure proper logging
6. **HTTPS**: Use HTTPS in production
