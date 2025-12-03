from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    CORS(app, origins=['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'])

    from app.routes import airports, flights, booking
    app.register_blueprint(airports.bp)
    app.register_blueprint(flights.bp)
    app.register_blueprint(booking.bp)

    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'SkyBook API is running'}

    return app
