import pytest


def test_search_requires_origin_destination_date(client):
    """Flight search should return 400 if required params are missing."""
    # Missing all params
    response = client.get('/api/flights/search')
    assert response.status_code == 400

    # Missing destination and date
    response = client.get('/api/flights/search?origin=JFK')
    assert response.status_code == 400

    # Missing date
    response = client.get('/api/flights/search?origin=JFK&destination=LAX')
    assert response.status_code == 400


def test_valid_search_returns_flights_array(client):
    """Valid search parameters should return outbound flights."""
    response = client.get('/api/flights/search?origin=JFK&destination=LAX&departure_date=2024-12-15')

    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'outbound' in data['data']
    assert isinstance(data['data']['outbound'], list)
    assert len(data['data']['outbound']) > 0

    # Check flight structure
    flight = data['data']['outbound'][0]
    assert 'id' in flight
    assert 'flight_number' in flight
    assert 'departure' in flight
    assert 'arrival' in flight
    assert 'fares' in flight


def test_seat_map_returns_availability_data(client):
    """Seat map endpoint should return seats with availability."""
    response = client.get('/api/flights/FL-123/seats')

    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'seats' in data['data']
    assert 'seat_map' in data['data']

    # Check seat map statistics
    seat_map = data['data']['seat_map']
    assert 'total_seats' in seat_map
    assert 'available_seats' in seat_map
    assert seat_map['available_seats'] <= seat_map['total_seats']
