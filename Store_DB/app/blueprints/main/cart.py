from flask import Blueprint, request, jsonify, session
from app.models import CartItem, User, Product, db
from flask_login import current_user

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/api/', methods=['GET'])
def view_cart():
    user_id = get_current_user_id()  
    cart_items = CartItem.query.filter_by(user_id=user_id).all()


    cart_data = [
        {
            "item_id": item.id,
            "product_id": item.product_id,
            "product_name": item.product.name,
            "quantity": item.quantity,
            "total_price": item.product.price * item.quantity
        }
        for item in cart_items
    ]

    return jsonify(cart_data), 200

@cart_bp.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    product_id = data.get('productId')
    user_id = data.get('userId')
    quantity = data.get('quantity')

    print(f"Product ID: {product_id}, User ID: {user_id}, Quantity: {quantity}")

    if not product_id or not quantity:
        return jsonify({"message": "Product ID and quantity are required"}), 400


    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404


    existing_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()

    if existing_item:

        existing_item.quantity += quantity
    else:
        new_cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(new_cart_item)

    db.session.commit()

    return jsonify({"message": "Item added to the cart successfully"}), 201


@cart_bp.route('/api/remove/<int:item_id>', methods=['DELETE'])
def remove_from_cart(item_id):

    user_id = get_current_user_id()


    cart_item = CartItem.query.filter_by(user_id=user_id, id=item_id).first()

    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"message": "Item removed from the cart"}), 200
    else:
        return jsonify({"message": "Item not found in the cart"}), 404


def get_current_user_id():
    if current_user.is_authenticated:
        return current_user.id
    else:
        return None 