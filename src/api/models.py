from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Model.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    rol = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Users {self.email}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "rol": self.rol,
        }

class Companies(db.Model):
    __tablename__ = 'companies'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(50), nullable=False)
    owner = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f'<Companies {self.name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "owner": self.owner,
        }

class MasterServices(db.Model):
    __tablename__ = 'master_services'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<MasterServices {self.type}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "type": self.type,
        }

class Services(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(50), nullable=False)
    type = db.Column(db.Integer, db.ForeignKey('master_services.id'), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    companies_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    available = db.Column(db.Boolean, nullable=False)
    def __repr__(self):
        return f'<Services {self.name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "type": self.type,
            "price": self.price,
            "duration": self.duration,
            "companies_id": self.companies_id,
            "available": self.available
        }

class Bookings(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    services_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    users_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    start_day_date = db.Column(db.DateTime, nullable=False)
    start_time_date = db.Column(db.DateTime, nullable=False)
    
    def __repr__(self):
        return f'<Bookings {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "services_id": self.services_id,
            "users_id": self.users_id,
            "start_day_date": self.start_day_date,
            "start_time_date": self.start_time_date,
        }

class Ratings(db.Model):
    __tablename__ = 'ratings'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    comment = db.Column(db.String(50), nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    users_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    services_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)

    def __repr__(self):
        return f'<Ratings {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "comment": self.comment,
            "stars": self.stars,
            "users_id": self.users_id,
            "services_id": self.services_id,
        }

class Requests(db.Model):
    __tablename__ = 'requests'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bookings_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    comment = db.Column(db.String(120), nullable=True)

    def __repr__(self):
        return f'<Requests {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "comment": self.comment,
            "bookings_id": self.bookings_id,
            "status": self.status
        }



