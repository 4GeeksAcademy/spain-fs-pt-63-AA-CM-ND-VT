  
import os
from flask_admin import Admin
from .models import db, Users,Companies,Bookings,MasterServices,Ratings,Requests,Services
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Users, db.session))
    admin.add_view(ModelView(Companies, db.session))
    admin.add_view(ModelView(Bookings, db.session))
    admin.add_view(ModelView(MasterServices, db.session))
    admin.add_view(ModelView(Ratings, db.session))
    admin.add_view(ModelView(Requests, db.session))
    admin.add_view(ModelView(Services, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))