from flask import Blueprint, request, jsonify
from app.data.flight_generator import generate_flights, generate_calendar_prices

bp = Blueprint('flights', __name__, url_prefix='/api')

@bp.route('/flights/search')
def search_flights():
    origin = request.args.get('origin', '').upper()
    destination = request.args.get('destination', '').upper()
    departure_date = request.args.get('departure_date', '')
    return_date = request.args.get('return_date', '')
    passengers = request.args.get('passengers', '1,0,0')  # adults,children,infants
    cabin_class = request.args.get('cabin_class', 'economy')

    if not origin or not destination or not departure_date:
        return jsonify({
            'success': False,
            'error': {
                'code': 'INVALID_INPUT',
                'message': 'Origin, destination, and departure date are required'
            }
        }), 400

    # Parse passengers
    try:
        adults, children, infants = map(int, passengers.split(','))
        total_passengers = adults + children
    except:
        total_passengers = 1

    # Generate outbound flights
    outbound = generate_flights(origin, destination, departure_date, total_passengers, cabin_class)

    # Generate return flights if round-trip
    return_flights = []
    if return_date:
        return_flights = generate_flights(destination, origin, return_date, total_passengers, cabin_class)

    return jsonify({
        'success': True,
        'data': {
            'outbound': outbound,
            'return': return_flights,
            'search_params': {
                'origin': origin,
                'destination': destination,
                'departure_date': departure_date,
                'return_date': return_date,
                'passengers': {'adults': adults if 'adults' in dir() else 1, 'children': children if 'children' in dir() else 0, 'infants': infants if 'infants' in dir() else 0},
                'cabin_class': cabin_class
            }
        }
    })

@bp.route('/flights/<flight_id>')
def get_flight(flight_id):
    # In a real app, would fetch from database
    # For now, return a sample flight
    return jsonify({
        'success': True,
        'data': {
            'id': flight_id,
            'message': 'Flight details endpoint - returns full flight info'
        }
    })

@bp.route('/flights/calendar')
def get_calendar_prices():
    origin = request.args.get('origin', '').upper()
    destination = request.args.get('destination', '').upper()
    month = request.args.get('month', '')  # YYYY-MM

    if not origin or not destination or not month:
        return jsonify({
            'success': False,
            'error': {
                'code': 'INVALID_INPUT',
                'message': 'Origin, destination, and month are required'
            }
        }), 400

    prices = generate_calendar_prices(origin, destination, month)

    return jsonify({
        'success': True,
        'data': prices
    })

@bp.route('/flights/<flight_id>/seats')
def get_flight_seats(flight_id):
    """Get seat map and availability for a specific flight"""
    import random
    
    # In a real app, would fetch from database based on flight_id
    # For now, generate a realistic seat map
    
    # Determine aircraft type and seat configuration
    aircraft_types = {
        'Boeing 777-300ER': {'rows': 50, 'economy_cols': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'], 'business_rows': 14},
        'Airbus A350-900': {'rows': 45, 'economy_cols': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'], 'business_rows': 12},
        'Boeing 787-9': {'rows': 40, 'economy_cols': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'], 'business_rows': 10},
        'Airbus A380': {'rows': 60, 'economy_cols': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'], 'business_rows': 16}
    }
    
    # Randomly select aircraft configuration
    aircraft_config = random.choice(list(aircraft_types.values()))
    total_rows = aircraft_config['rows']
    economy_cols = aircraft_config['economy_cols']
    business_rows = aircraft_config['business_rows']
    
    # Generate seat map
    seats = []
    seat_types = {
        'window': ['A', economy_cols[-1]],
        'aisle': [economy_cols[len(economy_cols)//2 - 1], economy_cols[len(economy_cols)//2]],
        'middle': [col for col in economy_cols if col not in ['A', economy_cols[-1], economy_cols[len(economy_cols)//2 - 1], economy_cols[len(economy_cols)//2]]]
    }
    
    for row in range(1, total_rows + 1):
        for col in economy_cols:
            seat_id = f"{row}{col}"
            
            # Determine seat type
            if col in seat_types['window']:
                seat_type = 'window'
            elif col in seat_types['aisle']:
                seat_type = 'aisle'
            else:
                seat_type = 'middle'
            
            # Determine cabin class
            if row <= business_rows:
                cabin = 'business'
                price = random.randint(50, 200)
            else:
                cabin = 'economy'
                price = random.randint(10, 50)
            
            # Randomly assign availability (70% available)
            is_available = random.random() > 0.3
            is_premium = row in [business_rows + 1, business_rows + 2] and cabin == 'economy'  # Exit rows
            
            seats.append({
                'seat_id': seat_id,
                'row': row,
                'column': col,
                'cabin': cabin,
                'type': seat_type,
                'available': is_available,
                'premium': is_premium,
                'price': price if is_available else None,
                'features': {
                    'extra_legroom': is_premium,
                    'window': seat_type == 'window',
                    'aisle': seat_type == 'aisle'
                }
            })
    
    # Calculate summary statistics
    total_seats = len(seats)
    available_seats = sum(1 for s in seats if s['available'])
    business_available = sum(1 for s in seats if s['cabin'] == 'business' and s['available'])
    economy_available = sum(1 for s in seats if s['cabin'] == 'economy' and s['available'])
    
    return jsonify({
        'success': True,
        'data': {
            'flight_id': flight_id,
            'seat_map': {
                'total_seats': total_seats,
                'available_seats': available_seats,
                'occupied_seats': total_seats - available_seats,
                'business_available': business_available,
                'economy_available': economy_available
            },
            'seats': seats,
            'cabin_layout': {
                'business_rows': f"1-{business_rows}",
                'economy_rows': f"{business_rows + 1}-{total_rows}",
                'columns': economy_cols
            }
        }
    })
