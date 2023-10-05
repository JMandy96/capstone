from flask import Blueprint, request, jsonify
from app.models import User, Product, db

api_bp = Blueprint('api', __name__, url_prefix='/api')


@api_bp.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    product_list = [{'id': product.id, 'name': product.name} for product in products]
    return jsonify(product_list)


@api_bp.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(**data)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201