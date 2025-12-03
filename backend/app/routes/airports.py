from flask import Blueprint, request, jsonify
import json
import os

bp = Blueprint('airports', __name__, url_prefix='/api')

def load_airports():
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'airports.json')
    with open(data_path, 'r') as f:
        return json.load(f)

@bp.route('/airports/search')
def search_airports():
    query = request.args.get('q', '').lower().strip()
    if len(query) < 2:
        return jsonify({'success': True, 'data': []})

    airports = load_airports()
    results = []

    for airport in airports:
        if (query in airport['code'].lower() or
            query in airport['city'].lower() or
            query in airport['name'].lower() or
            query in airport['country'].lower()):
            results.append(airport)
            if len(results) >= 10:
                break

    return jsonify({'success': True, 'data': results})

@bp.route('/airports')
def get_all_airports():
    airports = load_airports()
    return jsonify({'success': True, 'data': airports})
