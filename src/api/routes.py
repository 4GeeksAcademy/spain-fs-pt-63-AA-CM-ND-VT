from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Model.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)


@app.route('/landing', methods=['GET'])
def landing():
    return jsonify({'message': 'Welcome to the landing page!'})

@app.route('/signin', methods=['POST'])
def sign_in():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = Users(name=data['name'], email=data['email'], password=hashed_password, rol=data['rol'])
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.serialize()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'User with this email already exists'}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Users.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token)
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/clientportal/<int:user_id>', methods=['GET'])
@jwt_required()
def client_portal(user_id):
    user = Users.query.get_or_404(user_id)
    if user.rol != 'client':
        return jsonify({'error': 'User is not a client'}), 400
    return jsonify(user.serialize())

@app.route('/companyportal/<int:user_id>', methods=['GET'])
@jwt_required()
def company_portal(user_id):
    user = Users.query.get_or_404(user_id)
    if user.rol != 'company':
        return jsonify({'error': 'User is not a company owner'}), 400
    companies = Companies.query.filter_by(owner=user_id).all()
    return jsonify([company.serialize() for company in companies])

@app.route('/requests', methods=['POST'])
@jwt_required()
def create_request():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    user = Users.query.get(current_user_id)
    if user.rol != 'client':
        return jsonify({'error': 'User is not a client'}), 400
    new_request = Requests(bookings_id=data['bookings_id'], status=data['status'], comment=data.get('comment'))
    db.session.add(new_request)
    db.session.commit()
    return jsonify(new_request.serialize()), 201

@app.route('/services', methods=['GET'])
def get_services():
    services = Services.query.all()
    return jsonify([service.serialize() for service in services])

@app.route('/services', methods=['POST'])
@jwt_required()
def add_service():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    user = Users.query.get(current_user_id)
    if user.rol != 'company':
        return jsonify({'error': 'User is not a company owner'}), 400
    new_service = Services(
        name=data['name'],
        description=data['description'],
        type=data['type'],
        price=data['price'],
        duration=data['duration'],
        companies_id=user.id,  # Use the current user's ID to link the service to their company
        available=data['available']
    )
    db.session.add(new_service)
    db.session.commit()
    return jsonify(new_service.serialize()), 201

@app.route('/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    user = Users.query.get(current_user_id)
    if user.rol != 'client':
        return jsonify({'error': 'User is not a client'}), 400
    new_booking = Bookings(
        services_id=data['services_id'],
        users_id=current_user_id,
        start_day_date=data['start_day_date'],
        start_time_date=data['start_time_date']
    )
    db.session.add(new_booking)
    db.session.commit()
    return jsonify(new_booking.serialize()), 201

if __name__ == '__main__':
    app.run()
