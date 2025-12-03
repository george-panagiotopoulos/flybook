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
