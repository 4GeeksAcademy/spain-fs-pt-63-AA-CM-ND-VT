from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import generate_password_hash, check_password_hash
from sqlalchemy.orm import validates
from sqlalchemy import event
from flask import Flask

db = SQLAlchemy()

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)  
    rol = db.Column(db.String(50), nullable=False)
    image = db.Column(db.String(75), nullable=True)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f'<Users {self.email}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "rol": self.rol,
            "image": self.image,  # Incluyendo el campo image
        }

# Evento para encriptar la contraseña antes de insertar o actualizar el objeto
@event.listens_for(Users, 'before_insert')
@event.listens_for(Users, 'before_update')
def hash_user_password(mapper, connect, target):
    if target.password:  # solo si la contraseña no está vacía
        target.password = generate_password_hash(target.password).decode('utf-8')

class Companies(db.Model):
    __tablename__ = 'companies'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(50), nullable=False)
    owner = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('Users', backref=db.backref('companies', lazy=True))
    image = db.Column(db.String(75), nullable=True)

    def __repr__(self):
        return f'<Companies {self.name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "owner": self.owner,
            "image": self.image,  # Incluyendo el campo image
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
    image = db.Column(db.String(75), nullable=True)

    master_service = db.relationship('MasterServices', backref=db.backref('services', lazy=True))
    company = db.relationship('Companies', backref=db.backref('services', lazy=True))

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
            "available": self.available,
            "image": self.image,  # Incluyendo el campo image
        }

class Bookings(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    services_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    users_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    start_day_date = db.Column(db.String(50), nullable=False)
    start_time_date = db.Column(db.String(50), nullable=False)

    service = db.relationship('Services', backref=db.backref('bookings', lazy=True))
    user = db.relationship('Users', backref=db.backref('bookings', lazy=True))
    
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

    user = db.relationship('Users', backref=db.backref('ratings', lazy=True))
    service = db.relationship('Services', backref=db.backref('ratings', lazy=True))

    @validates('stars')
    def validate_stars(self, key, stars):
        if stars < 1 or stars > 5:
            raise ValueError('Stars must be between 1 and 5')
        return stars

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

    booking = db.relationship('Bookings', backref=db.backref('requests', lazy=True))

    def __repr__(self):
        return f'<Requests {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "comment": self.comment,
            "bookings_id": self.bookings_id,
            "status": self.status
        }
