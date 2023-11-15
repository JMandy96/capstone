from flask import Flask
from flask_login import LoginManager
from flask_migrate import Migrate
from config import Config
from dotenv import load_dotenv
from .models import db, User
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from app.blueprints.main.admin import admin, init_admin
from flask_cors import CORS
from flask_mail import Mail, Message
from .blueprints.auth.auth import init_serializer
from flask_jwt_extended import JWTManager
from .routes import protected_route

load_dotenv()

login_manager = LoginManager()
migrate = Migrate()
mail = Mail()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def create_app():
    app = Flask(__name__)
    jwt = JWTManager(app)
    app.route('/api/protected', methods=['GET'])(protected_route)
    app.config.from_object('config.Config')
    mail.init_app(app)
    init_serializer(app)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "https://profound-palmier-bc28df.netlify.app/"}})
    login_manager.init_app(app)
    migrate.init_app(app, db)

    init_admin(app,db)
    admin.init_app(app)

    login_manager.login_view = 'login'
    login_manager.login_message_category = 'danger'
    login_manager.login_message = 'You must login to access that page.'

    from app.blueprints.auth import auth_bp
    from app.blueprints.main.product import product_bp, fetch_and_populate
    from app.blueprints.main.cart import cart_bp
    from app.blueprints.main.order import order_bp
    from app.blueprints.auth.auth import register_bp, login_bp, logout_bp, forgot_bp, reset_bp
    from app.blueprints.main.address import address_bp

    from app.blueprints.api.api import api_bp
    from app.blueprints.server.server import server_bp

    app.register_blueprint(server_bp)
    app.register_blueprint(register_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(logout_bp)
    app.register_blueprint(address_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(forgot_bp)
    app.register_blueprint(reset_bp)

    


    return app




if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)