# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# from models import db, User
# from utils import hash_password, check_password

# app = Flask(__name__)
# CORS(app)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db.init_app(app)

# with app.app_context():
#     db.create_all()

# @app.route('/register', methods=['POST'])
# def register():
#     data = request.json
#     full_name = data.get('fullName')
#     email = data.get('email')
#     password = data.get('password')

#     if User.query.filter_by(email=email).first():
#         return jsonify({'message': 'User already exists'}), 400

#     hashed_pw = hash_password(password)
#     new_user = User(full_name=full_name, email=email, password_hash=hashed_pw)
#     db.session.add(new_user)
#     db.session.commit()

#     return jsonify({'message': 'User registered successfully'}), 201

# @app.route('/login', methods=['POST'])
# def login():
#     data = request.json
#     email = data.get('email')
#     password = data.get('password')

#     user = User.query.filter_by(email=email).first()
#     if user and check_password(password, user.password_hash):
#         return jsonify({'message': 'Login successful'}), 200
#     else:
#         return jsonify({'message': 'Invalid credentials'}), 401






# if __name__ == '__main__':
#     app.run(debug=True)

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash

from models import db, User
from utils import hash_password, check_password

app = Flask(__name__)
CORS(app)

# Use absolute path to make sure DB is created where expected
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Create DB tables on startup
with app.app_context():
    db.create_all()

# Sign Up Endpoint (POST /register)
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    full_name = data.get('fullName')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    hashed_pw = hash_password(password)
    new_user = User(full_name=full_name, email=email, password_hash=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# Login Endpoint (POST /login)
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and check_password(password, user.password_hash):
        return jsonify({
            'message': 'Login successful',
            'user': {
                'fullName': user.full_name,
                'email': user.email
            }
        }), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = hash_password(password)  # Use bcrypt-based hash
    new_user = User(full_name=full_name, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)

