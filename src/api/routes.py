"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, Companies, Bookings, MasterServices, Ratings, Requests, Services
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/landing', methods=['GET'])
def landing():
    return jsonify({'message': 'Welcome to the landing page!'})


@api.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    new_user = Users(name=data['name'], email=data['email'], 
                     password=data['password'], rol=data['rol'])
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.serialize()), 201
    except Exception as ex:
        db.session.rollback()
        return jsonify({'error': 'User with this email already exists', 'error': str(ex)}), 400


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Users.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token)
    return jsonify({'error': 'Invalid credentials'}), 401


@api.route('/clientportal/<int:user_id>', methods=['GET'])
@jwt_required()
def client_portal(user_id):
    user = Users.query.get_or_404(user_id)
    if user.rol != 'client':
        return jsonify({'error': 'User is not a client'}), 400
    return jsonify(user.serialize())


@api.route('/companyportal/<int:user_id>', methods=['GET'])
@jwt_required()
def company_portal(user_id):
    user = Users.query.get_or_404(user_id)
    if user.rol != 'company':
        return jsonify({'error': 'User is not a company owner'}), 400
    companies = Companies.query.filter_by(owner=user_id).all()
    return jsonify([company.serialize() for company in companies])


@api.route('/requests', methods=['POST'])
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


@api.route('/services', methods=['GET'])
def get_services():
    services = Services.query.all()
    return jsonify([service.serialize() for service in services])


@api.route('/services', methods=['POST'])
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


@api.route('/bookings', methods=['POST'])
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
