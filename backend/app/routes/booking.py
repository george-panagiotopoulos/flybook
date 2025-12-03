from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime

bp = Blueprint('booking', __name__, url_prefix='/api')

# In-memory booking storage (would be database in production)
bookings = {}

@bp.route('/booking/create', methods=['POST'])
def create_booking():
    data = request.json

    booking_id = f"BK-{uuid.uuid4().hex[:8].upper()}"
    booking = {
        'id': booking_id,
        'created_at': datetime.utcnow().isoformat(),
        'status': 'pending',
        'flights': data.get('flights', []),
        'passengers': [],
        'extras': {},
        'pricing': data.get('pricing', {}),
    }

    bookings[booking_id] = booking

    return jsonify({
        'success': True,
        'data': {
            'booking_id': booking_id,
            'expires_at': (datetime.utcnow()).isoformat()
        }
    })

@bp.route('/booking/<booking_id>')
def get_booking(booking_id):
    booking = bookings.get(booking_id)
    if not booking:
        return jsonify({
            'success': False,
            'error': {'code': 'NOT_FOUND', 'message': 'Booking not found'}
        }), 404

    return jsonify({'success': True, 'data': booking})

@bp.route('/booking/<booking_id>/passengers', methods=['PUT'])
def update_passengers(booking_id):
    booking = bookings.get(booking_id)
    if not booking:
        return jsonify({
            'success': False,
            'error': {'code': 'NOT_FOUND', 'message': 'Booking not found'}
        }), 404

    data = request.json
    booking['passengers'] = data.get('passengers', [])

    return jsonify({'success': True, 'data': booking})

@bp.route('/booking/<booking_id>/payment', methods=['POST'])
def process_payment(booking_id):
    booking = bookings.get(booking_id)
    if not booking:
        return jsonify({
            'success': False,
            'error': {'code': 'NOT_FOUND', 'message': 'Booking not found'}
        }), 404

    # Simulate payment processing
    booking['status'] = 'confirmed'
    booking['payment'] = {
        'method': 'card',
        'status': 'completed',
        'transaction_id': f"TXN-{uuid.uuid4().hex[:8].upper()}"
    }

    return jsonify({
        'success': True,
        'data': {
            'status': 'completed',
            'transaction_id': booking['payment']['transaction_id'],
            'booking_reference': booking_id
        }
    })
