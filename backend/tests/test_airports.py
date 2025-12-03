import pytest


def test_search_returns_matching_airports(client):
    """Search for 'new' should return New York airports."""
    response = client.get('/api/airports/search?q=new')

    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert len(data['data']) > 0

    # Should find New York (JFK or EWR)
    cities = [airport['city'] for airport in data['data']]
    assert any('New York' in city or 'Newark' in city for city in cities)


def test_search_with_short_query_returns_empty(client):
    """Query with less than 2 characters should return empty results."""
    response = client.get('/api/airports/search?q=a')

    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert data['data'] == []
