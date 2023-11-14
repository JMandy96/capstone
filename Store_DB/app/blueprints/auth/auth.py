from flask import Blueprint, request, jsonify, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from datetime import datetime
from functools import wraps
from flask_mail import Message, Mail
from app.models import User, db
from flask_jwt_extended import create_access_token, get_jwt_identity

register_bp = Blueprint('register_bp', __name__)
login_bp = Blueprint('login_bp', __name__)
logout_bp = Blueprint('logout_bp', __name__)
forgot_bp = Blueprint('forgot_bp', __name__)
reset_bp = Blueprint('reset_bp', __name__)

login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@register_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "Email already in use"}), 400



    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@login_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    print(f"User found: {user}")
    

    if user:
        password_check = check_password_hash(user.password, password)
        print(f"Password check result: {password_check}")

        if password_check:
            access_token = create_access_token(identity=user.id)
            response_data = {"access_token": access_token, "user_id": user.id, "is_admin": user.is_admin} 
            print(f'is admin = {user.is_admin}')
            return jsonify(response_data), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    else:
        return jsonify({"message": "User not found"}), 401

    
@logout_bp.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

from itsdangerous import URLSafeTimedSerializer

s = None

def init_serializer(app):
    global s
    s = URLSafeTimedSerializer(app.config['SECRET_KEY'])

mail = Mail()
@forgot_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()  
    email = data['email']
    user = User.query.filter_by(email=email).first()

    if user:
        token = s.dumps(email, salt='recover-key')
        link = url_for('reset_password', token=token, _external=True)
        

        msg = Message('Password Reset', recipients=[email])
        msg.body = f'Click the link to reset your password: {link}'
        mail.send(msg)
        
        return jsonify(message='Email sent! Check your mailbox.'), 200

    return jsonify(error='User not found'), 404

@reset_bp.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        email = s.loads(token, salt='recover-key', max_age=3600)
    except:
        return jsonify(error='The link is invalid or has expired'), 400

    data = request.get_json()
    password = data['password']
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify(error='User not found'), 404

    user.password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)
    db.session.add(user)
    db.session.commit()

    return jsonify(message='Password reset successfully'), 200