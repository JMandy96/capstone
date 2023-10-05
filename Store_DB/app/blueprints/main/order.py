from flask import Blueprint, request, jsonify
from app.models import Order, OrderItem, CartItem, User, Product, db
from flask_login import current_user


order_bp = Blueprint('order', __name__, url_prefix='/orders')

@order_bp.route('/api/', methods=['GET'])
def view_orders():

    user_id = get_current_user_id()
    
    if user_id is None:
        return jsonify({"message": "User not authenticated"}), 401


    orders = Order.query.filter_by(user_id=user_id).order_by(Order.order_date.desc()).all()


    order_history = [
        {
            "order_id": order.id,
            "order_date": order.order_date.strftime('%Y-%m-%d %H:%M:%S'),
            "status": order.status,
            "items": [
                {
                    "product_id": item.product.id,
                    "product_name": item.product.name,
                    "quantity": item.quantity,
                    "total_price": item.product.price * item.quantity
                }
                for item in order.order_items
            ]
        }
        for order in orders
    ]

    return jsonify(order_history), 200

@order_bp.route('/api/create', methods=['POST'])
def create_order():
    data = request.get_json()
    cart_items = data.get('cart_items') 

    total_price = calculate_total_price(cart_items)


    user_id = get_current_user_id()

    if user_id is None:
        return jsonify({"message": "User not authenticated"}), 401

    new_order = Order(user_id=user_id, total_price=total_price)


    for cart_item_id in cart_items:
        cart_item = CartItem.query.get(cart_item_id)
        if cart_item:
            order_item = OrderItem(
                order=new_order,
                product=cart_item.product,
                quantity=cart_item.quantity
            )
            db.session.add(order_item)
            db.session.delete(cart_item)  

    db.session.add(new_order)
    db.session.commit()

    return jsonify({"message": "Order created successfully"}), 201

@order_bp.route('/api/<int:order_id>', methods=['GET'])
def view_order(order_id):

    user_id = get_current_user_id()
    
    if user_id is None:
        return jsonify({"message": "User not authenticated"}), 401

    order = Order.query.filter_by(id=order_id, user_id=user_id).first()

    if order is None:
        return jsonify({"message": "Order not found"}), 404


    order_data = {
        "order_id": order.id,
        "order_date": order.order_date.strftime('%Y-%m-%d %H:%M:%S'),
        "status": order.status,
        "total_price": order.total_price,
        "items": [
            {
                "product_id": item.product.id,
                "product_name": item.product.name,
                "quantity": item.quantity,
                "total_price": item.product.price * item.quantity
            }
            for item in order.order_items
        ]
    }

    return jsonify(order_data), 200


def get_current_user_id():
    if current_user.is_authenticated:
        return current_user.id
    else:
        return None 

def calculate_total_price(cart_items):
    total_price = 0
    for cart_item_id in cart_items:
        cart_item = CartItem.query.get(cart_item_id)
        if cart_item:
            total_price += cart_item.product.price * cart_item.quantity
    return total_price