from flask import Blueprint, request, jsonify
from app.models import Address, User, db
from flask_login import current_user

address_bp = Blueprint('address', __name__, url_prefix='/addresses')

@address_bp.route('/api/', methods=['GET'])
def view_addresses():

    user_id = get_current_user_id()
    
    if user_id is None:
        return jsonify({"message": "User not authenticated"}), 401

    addresses = Address.query.filter_by(user_id=user_id).all()

    address_list = [
        {
            "id": address.id,
            "street": address.street,
            "city": address.city,
            "state": address.state,
            "postal_code": address.postal_code,
            "address_type": address.address_type
        }
        for address in addresses
    ]

    return jsonify(address_list), 200

@address_bp.route('/api/add', methods=['POST'])
def add_address():
    data = request.get_json()
    street = data.get('street')
    city = data.get('city')
    state = data.get('state')
    postal_code = data.get('postal_code')
    address_type = data.get('address_type')

    user_id = get_current_user_id()

    if user_id is None:
        return jsonify({"message": "User not authenticated"}), 401

    new_address = Address(
        user_id=user_id,
        street=street,
        city=city,
        state=state,
        postal_code=postal_code,
        address_type=address_type
    )

    db.session.add(new_address)
    db.session.commit()

    return jsonify({"message": "Address added successfully"}), 201


def get_current_user_id():
    if current_user.is_authenticated:
        return current_user.id
    else:
        return None 