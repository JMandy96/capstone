from app.blueprints.server import server_bp
from flask import request, jsonify
from app.models import db
import stripe

stripe.api_key = 'sk_test_51NwWhQHmtOnVZs17ktgsVIxvkvFMiSPPLcy9HNF6FKL2JOCF3fEiZ0BsuuDv9oTHtm4dyAMjdpHpZrO5PDmBh1gS00jY5WKcXR'


def calculate_order_amount(items):
     return sum(item['productPrice'] * item['quantity'] for item in items)

@server_bp.route('/api/createPayment', methods=['POST'])
def create_payment():
        try:
            data = request.get_json()

            if 'items' not in data:
                return jsonify(error="Missing items in request data"), 400
            
            total_amount_dollars = calculate_order_amount(data['items'])
            total_amount_cents = int(total_amount_dollars * 100)

            intent = stripe.PaymentIntent.create(
                amount=total_amount_cents,
                currency='usd',
                
                automatic_payment_methods={
                    'enabled': True,
                },
            )
            return jsonify({
                'clientSecret': intent['client_secret']
            })
        except Exception as e:
            print(f"error: {e}")
            return jsonify(error=str(e)), 403