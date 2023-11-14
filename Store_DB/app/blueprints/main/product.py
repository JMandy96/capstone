import requests
from flask import Blueprint, jsonify, request, current_app, Flask, request
from app.models import Product, db
from werkzeug.utils import secure_filename
import os


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

@product_bp.route('/api/products', methods=['POST'])
def add_product():
    current_app.logger.info("POST request recieved at /api/products")
    
    data = request.json
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    category = data.get('category')
    image_url = request.files.get('image_url')

    if image_url:
        filename = secure_filename(image_url.filename)
        image_path = os.path.join('uploads', filename)
        image_url.save(image_path)
    else: 
        image_path = None


    # Create new product instance
    new_product = Product(
        name=name,
        description=description,
        price=price,
        category=category,
        image_url=image_path
    )

    # Add to database
    db.session.add(new_product)
    db.session.commit()

    # Return success response
    return jsonify({"message": "Product added successfully", "product_id": new_product.id}), 201


@product_bp.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get(product_id)

    if product is None:
        return jsonify({"message": "Product not found"}), 404

    # Delete the product from the database
    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product deleted successfully"}), 200



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