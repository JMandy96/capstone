import requests
from flask import Blueprint, jsonify
from app.models import Product, db

product_bp = Blueprint('product', __name__)

@product_bp.route('/api/products', methods=['GET'])
def list_products():

    products = Product.query.all()


    product_list = [
        {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "category": product.category,
            "image_url": product.image_url
        }
        for product in products
    ]


    return jsonify(product_list), 200

@product_bp.route('/api/<int:product_id>', methods=['GET'])
def get_product(product_id):

    product = Product.query.get(product_id)

    if product is None:
        return jsonify({"message": "Product not found"}), 404

    product_data = {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category": product.category,
        "image_url": product.image_url
    }

    return jsonify(product_data), 200


def fetch_and_populate():
    response = requests.get('https://fakestoreapi.com/products')
    if response.status_code == 200:
        products = response.json()
        for product in products:
            new_product = Product(
                name=product['title'],
                description=product['description'],
                price=product['price'],
                category=product['category'],
                image_url=product['image']
            )
            db.session.add(new_product)
        db.session.commit()


@product_bp.route('/fetchdata', methods=['POST'])
def fetchdata_endpoint():
    fetch_and_populate()
    return jsonify({"message": "Data fetched and populated successfully!"}), 200