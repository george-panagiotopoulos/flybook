import os

class Config:
    DEBUG = True
    HOST = '0.0.0.0'
    PORT = 2345
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
