from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from app.models import User, Product, Order, OrderItem, CartItem, Address, Payment

admin = Admin(name='Admin Panel', template_mode='bootstrap3')

def init_admin(app, db):
    admin.add_view(ModelView(User, db.session, endpoint='admin_user'))
    admin.add_view(ModelView(Product, db.session, endpoint='admin_product'))
    admin.add_view(ModelView(Order, db.session, endpoint='admin_order'))
    admin.add_view(ModelView(OrderItem, db.session, endpoint='admin_orderitem'))
    admin.add_view(ModelView(CartItem, db.session, endpoint='admin_cartitem'))
    admin.add_view(ModelView(Address, db.session, endpoint='admin_address'))
    admin.add_view(ModelView(Payment, db.session, endpoint='admin_payment'))