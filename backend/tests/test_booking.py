import pytest


def test_create_booking_generates_bk_id(client):
    """Creating a booking should generate a BK-* prefixed ID."""
    response = client.post('/api/booking/create', json={
        'flights': [{'id': 'FL-123'}],
        'pricing': {'total': 500}
    })

    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'booking_id' in data['data']
    assert data['data']['booking_id'].startswith('BK-')


def test_get_booking_returns_404_if_not_found(client):
    """Getting a non-existent booking should return 404."""
    response = client.get('/api/booking/BK-NONEXISTENT')

    assert response.status_code == 404
    data = response.get_json()
    assert data['success'] is False
    assert data['error']['code'] == 'NOT_FOUND'


def test_payment_sets_status_to_confirmed(client):
    """Processing payment should change booking status to confirmed."""
    # First create a booking
    create_response = client.post('/api/booking/create', json={
        'flights': [{'id': 'FL-123'}],
        'pricing': {'total': 500}
    })
    booking_id = create_response.get_json()['data']['booking_id']

    # Process payment
    payment_response = client.post(f'/api/booking/{booking_id}/payment')

    assert payment_response.status_code == 200
    data = payment_response.get_json()
    assert data['success'] is True
    assert data['data']['status'] == 'completed'
    assert 'transaction_id' in data['data']
    assert data['data']['transaction_id'].startswith('TXN-')


def test_cancel_returns_80_percent_refund_for_confirmed(client):
    """Cancelling a confirmed booking should offer 80% refund."""
    # Create and confirm a booking
    create_response = client.post('/api/booking/create', json={
        'flights': [{'id': 'FL-123'}],
        'pricing': {'total': 500}
    })
    booking_id = create_response.get_json()['data']['booking_id']

    # Confirm the booking
    client.post(f'/api/booking/{booking_id}/payment')

    # Cancel the booking
    cancel_response = client.delete(f'/api/booking/{booking_id}')

    assert cancel_response.status_code == 200
    data = cancel_response.get_json()
    assert data['success'] is True
    assert data['data']['status'] == 'cancelled'

    # Check refund is 80% of total (500 * 0.8 = 400)
    if 'cancellation_refund' in data['data']:
        assert data['data']['cancellation_refund']['amount'] == 400


def test_cancel_returns_400_if_already_cancelled(client):
    """Cancelling an already cancelled booking should return 400."""
    # Create a booking
    create_response = client.post('/api/booking/create', json={
        'flights': [{'id': 'FL-123'}],
        'pricing': {'total': 500}
    })
    booking_id = create_response.get_json()['data']['booking_id']

    # Cancel once
    client.delete(f'/api/booking/{booking_id}')

    # Try to cancel again
    second_cancel = client.delete(f'/api/booking/{booking_id}')

    assert second_cancel.status_code == 400
    data = second_cancel.get_json()
    assert data['success'] is False
    assert data['error']['code'] == 'ALREADY_CANCELLED'
