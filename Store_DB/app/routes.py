from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity



def protected_route():
    current_user_id = get_jwt_identity()

    return jsonify({"message": "Access granted to protected route", "user_id": current_user_id}), 200