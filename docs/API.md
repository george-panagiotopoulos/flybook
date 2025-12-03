# SkyBook API Documentation

Base URL: `http://localhost:2345/api`

## Endpoints

### Airports

#### Search Airports
Search for airports by name, city, or IATA code.

```
GET /airports/search?q={query}
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| q | string | Search query (min 2 characters) |

**Response:**
```json
[
  {
    "code": "JFK",
    "name": "John F. Kennedy International Airport",
    "city": "New York",
    "country": "United States",
    "timezone": "America/New_York"
  }
]
```

---

### Flights

#### Search Flights
Search for available flights between two airports.

```
GET /flights/search?origin={code}&destination={code}&date={date}&passengers={count}
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| origin | string | Origin airport IATA code |
| destination | string | Destination airport IATA code |
| date | string | Departure date (YYYY-MM-DD) |
| passengers | number | Number of passengers (default: 1) |
| return_date | string | (Optional) Return date for round trips |

**Response:**
```json
{
  "outbound": [
    {
      "id": "FL-ABC123",
      "flight_number": "AA100",
      "airline": "AA",
      "airline_name": "American Airlines",
      "departure": {
        "airport": "JFK",
        "city": "New York",
        "scheduled": "2024-12-15T08:30:00",
        "local_time": "08:30"
      },
      "arrival": {
        "airport": "LHR",
        "city": "London",
        "scheduled": "2024-12-15T20:45:00",
        "local_time": "20:45"
      },
      "duration_minutes": 435,
      "stops": 0,
      "aircraft": "Boeing 777-300ER",
      "fares": {
        "economy_basic": {
          "price": 450,
          "currency": "USD",
          "available_seats": 45
        },
        "economy_standard": {
          "price": 550,
          "currency": "USD",
          "available_seats": 30
        },
        "economy_flex": {
          "price": 750,
          "currency": "USD",
          "available_seats": 15
        },
        "business": {
          "price": 2200,
          "currency": "USD",
          "available_seats": 8
        }
      }
    }
  ],
  "return": []
}
```

---

### Bookings

#### Create Booking
Create a new flight booking.

```
POST /booking
```

**Request Body:**
```json
{
  "flight_id": "FL-ABC123",
  "fare_class": "economy_standard",
  "passengers": [
    {
      "type": "adult",
      "title": "Mr",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-05-15",
      "nationality": "US"
    }
  ],
  "contact": {
    "email": "john@example.com",
    "phone": "+1-555-123-4567"
  },
  "seats": {
    "0": { "id": "14A", "row": 14, "col": "A" }
  },
  "extras": {
    "insurance": true,
    "priorityBoarding": false,
    "extraBaggage": 23,
    "meals": ["vegetarian"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "BK-XYZ789",
    "status": "confirmed",
    "flight": { ... },
    "passengers": [ ... ],
    "pricing": {
      "baseTotal": 550,
      "taxes": 82.50,
      "seatFees": 35,
      "extrasTotal": 49,
      "total": 716.50
    }
  }
}
```

#### Get Booking
Retrieve a booking by its reference number.

```
GET /booking/{booking_id}
```

**Response:**
```json
{
  "id": "BK-XYZ789",
  "status": "confirmed",
  "createdAt": "2024-12-01T10:30:00Z",
  "flight": { ... },
  "passengers": [ ... ],
  "pricing": { ... }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_REQUEST | 400 | Missing or invalid parameters |
| NOT_FOUND | 404 | Resource not found |
| SERVER_ERROR | 500 | Internal server error |

---

## Rate Limiting

The API is not currently rate limited. In production, implement appropriate rate limiting.

---

## CORS

The API accepts requests from:
- `http://localhost:5173`
- `http://localhost:5174`

For production, update CORS origins in `backend/app/__init__.py`.
