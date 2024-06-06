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

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    rol = data.get('rol')

    if not name or not email or not password or not rol:
        return jsonify({"error": "Faltan datos"}), 400

    hashed_password = generate_password_hash(password)
    new_user = Users(name=name, email=email, password=hashed_password, rol=rol)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Usuario agregado exitosamente", "user": new_user.serialize()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "El correo electrónico ya está en uso"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/add_service', methods=['POST'])
def add_service():
    data = request.get_json()
    
    name = data.get('name')
    description = data.get('description')
    type_id = data.get('type')
    price = data.get('price')
    duration = data.get('duration')
    companies_id = data.get('companies_id')
    available = data.get('available')

    if not all([name, description, type_id, price, duration, companies_id, available is not None]):
        return jsonify({"error": "Faltan datos"}), 400

    new_service = Services(
        name=name, 
        description=description, 
        type=type_id, 
        price=price, 
        duration=duration, 
        companies_id=companies_id, 
        available=available
    )

    try:
        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message": "Servicio agregado exitosamente", "service": new_service.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/add_request', methods=['POST'])
def add_request():
    data = request.get_json()
    
    bookings_id = data.get('bookings_id')
    status = data.get('status')
    comment = data.get('comment')

    if not bookings_id or not status:
        return jsonify({"error": "Faltan datos"}), 400

    new_request = Requests(
        bookings_id=bookings_id, 
        status=status, 
        comment=comment
    )

    try:
        db.session.add(new_request)
        db.session.commit()
        return jsonify({"message": "Request agregada exitosamente", "request": new_request.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
            # do not serialize the password, its a security breach
        }

class Services(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.String(80), unique=False, nullable=False)
    type = db.Column(db.String(80), unique=False, nullable=False)
    price = db.Column(db.Integer, unique=False, nullable=False)
    duration = db.Column(db.Integer, unique=False, nullable=False)
    company_id = db.Column(db.String(80), unique=False, nullable=False)


    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
