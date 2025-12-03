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

@bp.route('/bookings', methods=['GET'])
def list_bookings():
    """List all bookings with optional filtering by status"""
    status_filter = request.args.get('status', '').lower()
    
    # Filter bookings by status if provided
    if status_filter:
        filtered_bookings = {
            bid: booking for bid, booking in bookings.items()
            if booking.get('status', '').lower() == status_filter
        }
        booking_list = list(filtered_bookings.values())
    else:
        booking_list = list(bookings.values())
    
    # Sort by creation date (newest first)
    booking_list.sort(key=lambda x: x.get('created_at', ''), reverse=True)
    
    return jsonify({
        'success': True,
        'data': {
            'bookings': booking_list,
            'total': len(booking_list)
        }
    })

@bp.route('/booking/<booking_id>', methods=['DELETE'])
def cancel_booking(booking_id):
    """Cancel a booking"""
    booking = bookings.get(booking_id)
    if not booking:
        return jsonify({
            'success': False,
            'error': {'code': 'NOT_FOUND', 'message': 'Booking not found'}
        }), 404
    
    # Check if booking can be cancelled
    if booking.get('status') == 'cancelled':
        return jsonify({
            'success': False,
            'error': {'code': 'ALREADY_CANCELLED', 'message': 'Booking is already cancelled'}
        }), 400
    
    if booking.get('status') == 'confirmed':
        # In production, would check cancellation policy and refund eligibility
        booking['status'] = 'cancelled'
        booking['cancelled_at'] = datetime.utcnow().isoformat()
        booking['cancellation_refund'] = {
            'eligible': True,
            'refund_amount': booking.get('pricing', {}).get('total', 0) * 0.8,  # 80% refund
            'currency': 'USD'
        }
    else:
        booking['status'] = 'cancelled'
        booking['cancelled_at'] = datetime.utcnow().isoformat()
    
    return jsonify({
        'success': True,
        'data': {
            'booking_id': booking_id,
            'status': 'cancelled',
            'cancelled_at': booking['cancelled_at']
        }
    })
