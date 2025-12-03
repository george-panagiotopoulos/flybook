import random
import json
import os
from datetime import datetime, timedelta
from dateutil import parser

def load_airlines():
    data_path = os.path.join(os.path.dirname(__file__), 'airlines.json')
    with open(data_path, 'r') as f:
        return json.load(f)

def load_airports():
    data_path = os.path.join(os.path.dirname(__file__), 'airports.json')
    with open(data_path, 'r') as f:
        return json.load(f)

def get_airport_by_code(code):
    airports = load_airports()
    for a in airports:
        if a['code'] == code:
            return a
    return None

def generate_flights(origin, destination, departure_date, passengers=1, cabin_class='economy'):
    """Generate realistic stubbed flight data"""
    airlines = load_airlines()
    origin_airport = get_airport_by_code(origin)
    dest_airport = get_airport_by_code(destination)

    if not origin_airport or not dest_airport:
        return []

    # Parse the departure date
    try:
        dep_date = parser.parse(departure_date).date()
    except:
        dep_date = datetime.now().date() + timedelta(days=7)

    flights = []
    num_flights = random.randint(4, 8)

    # Base price varies by route
    base_price = random.randint(200, 800)

    for i in range(num_flights):
        airline = random.choice(airlines)
        flight_number = f"{airline['code']}{random.randint(100, 999)}"

        # Generate departure time
        hour = random.choice([6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21])
        minute = random.choice([0, 15, 30, 45])
        dep_time = datetime.combine(dep_date, datetime.min.time().replace(hour=hour, minute=minute))

        # Flight duration (3-14 hours depending on route)
        duration_mins = random.randint(180, 840)
        arr_time = dep_time + timedelta(minutes=duration_mins)

        # Number of stops
        if duration_mins > 600:
            stops = random.choice([0, 1, 1, 2])
        elif duration_mins > 400:
            stops = random.choice([0, 0, 1])
        else:
            stops = random.choice([0, 0, 0, 1])

        # Price variation
        price_variation = random.uniform(0.8, 1.4)
        economy_basic = int(base_price * price_variation)

        flight = {
            'id': f"FL-{dep_date.strftime('%Y%m%d')}-{flight_number}",
            'flight_number': flight_number,
            'airline': airline['code'],
            'airline_name': airline['name'],
            'aircraft': random.choice(['Boeing 777-300ER', 'Airbus A350-900', 'Boeing 787-9', 'Airbus A380']),
            'departure': {
                'airport': origin,
                'city': origin_airport['city'],
                'terminal': str(random.randint(1, 8)),
                'scheduled': dep_time.isoformat(),
                'local_time': dep_time.strftime('%H:%M')
            },
            'arrival': {
                'airport': destination,
                'city': dest_airport['city'],
                'terminal': str(random.randint(1, 8)),
                'scheduled': arr_time.isoformat(),
                'local_time': arr_time.strftime('%H:%M')
            },
            'duration_minutes': duration_mins,
            'stops': stops,
            'amenities': {
                'wifi': random.choice([True, True, False]),
                'power': True,
                'entertainment': random.choice(['Personal screens', 'Streaming', 'Overhead screens']),
                'meals': random.choice(['Full service', 'Snacks included', 'Buy on board'])
            },
            'fares': {
                'economy_basic': {
                    'price': economy_basic,
                    'currency': 'USD',
                    'baggage': 'carry_on_only',
                    'seat_selection': 'paid',
                    'seats_available': random.randint(10, 50)
                },
                'economy_standard': {
                    'price': int(economy_basic * 1.3),
                    'currency': 'USD',
                    'baggage': '1_checked',
                    'seat_selection': 'included',
                    'seats_available': random.randint(30, 100)
                },
                'economy_flex': {
                    'price': int(economy_basic * 1.6),
                    'currency': 'USD',
                    'baggage': '2_checked',
                    'seat_selection': 'included',
                    'seats_available': random.randint(10, 40)
                },
                'business': {
                    'price': int(economy_basic * 4.5),
                    'currency': 'USD',
                    'baggage': '2_checked',
                    'seat_selection': 'included',
                    'seats_available': random.randint(4, 20)
                }
            }
        }
        flights.append(flight)

    # Sort by departure time
    flights.sort(key=lambda x: x['departure']['scheduled'])
    return flights

def generate_calendar_prices(origin, destination, month):
    """Generate price calendar for a month"""
    try:
        year, month_num = map(int, month.split('-'))
    except:
        year = datetime.now().year
        month_num = datetime.now().month

    prices = {}
    base_price = random.randint(200, 600)

    # Generate prices for each day of the month
    from calendar import monthrange
    num_days = monthrange(year, month_num)[1]

    for day in range(1, num_days + 1):
        date_str = f"{year}-{month_num:02d}-{day:02d}"
        # Weekend prices higher
        date_obj = datetime(year, month_num, day)
        if date_obj.weekday() >= 5:  # Weekend
            prices[date_str] = int(base_price * random.uniform(1.1, 1.4))
        else:
            prices[date_str] = int(base_price * random.uniform(0.85, 1.15))

    return prices
