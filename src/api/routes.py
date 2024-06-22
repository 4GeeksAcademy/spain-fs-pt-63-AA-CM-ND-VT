"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, Companies, Bookings, MasterServices, Ratings, Requests, Services
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity,unset_jwt_cookies
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
bcrypt=Bcrypt()

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
    
@api.route('/signup_company', methods=['POST'])
def signup_company():
    data = request.get_json()
    new_user = Users(name=data['name'], email=data['email'], 
                     password=data['password'], rol=data['rol'])
    try:
        db.session.add(new_user)
        db.session.commit()
        new_company = Companies(name=data['company_name'], location=data['location'], owner=new_user.id)
        db.session.add(new_company)
        db.session.commit()
        return jsonify(new_user.serialize()), 201
    except Exception as ex:
        db.session.rollback()
        return jsonify({'error': 'User with this email already exists', 'error': str(ex)}), 400


@api.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response, 200

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Users.query.filter_by(email=data['email']).first()

    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({"msg": "Bad email or password"}), 401

    company = Companies.query.filter_by(user=user).first()

    access_token = create_access_token(identity=user.id)
    
    response = {
        'access_token': access_token,
        'user_id': user.id,
        'username': user.name,
        'rol': user.rol
    }

    if company:
        response['companyname'] = company.name
        response['company_id'] = company.id

    return jsonify(response)

@api.route('/clientportal/<int:user_id>', methods=['GET'])
@jwt_required()
def client_portal(user_id):
    user = Users.query.get_or_404(user_id)
    if user.rol != 'client':
        return jsonify({'error': 'User is not a client'}), 400
    return jsonify(user.serialize())

@api.route('/clientportal/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = Users.query.get_or_404(user_id)
    
    if user.rol != 'client':
        return jsonify({'error': 'User is not a client'}), 400

    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/clientportal/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    data = request.get_json()
    user = Users.query.get_or_404(user_id)
    
    if user.rol != 'client':
        return jsonify({'error': 'User is not a client'}), 400

    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.rol = data.get('rol', user.rol)
    user.image_url = data.get('image_url', user.image_url)

    try:
        db.session.commit()
        return jsonify(user.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    

@api.route('/companyservices/<int:user_id>/service/<int:service_id>', methods=['DELETE'])
def delete_service(user_id, service_id):
    user = Users.query.get_or_404(user_id)
    print(f"user id:{user_id},user role:{user.rol}")
    if user.rol not in["company","admin"]:
        return jsonify({'error': 'Unauthorized access, only companies allowed'}), 403
    service = Services.query.get_or_404(service_id)
    if service.companies_id != user_id:
        return jsonify({'error': 'Unauthorized access to delete this service'}), 403
    db.session.delete(service)
    db.session.commit()
    return jsonify({'message': 'Service deleted successfully'}), 200

@api.route('/companyservices/<int:user_id>/service/<int:service_id>', methods=['PUT'])
def update_service(user_id, service_id):
    
    user = Users.query.get_or_404(user_id)
    
    if user.rol not in ['company', 'admin']:
        return jsonify({'error': 'Unauthorized access, only companies or admins allowed'}), 403
    
    service = Services.query.get_or_404(service_id)
    if user.rol == 'company' and service.companies_id != user_id:
        return jsonify({'error': 'Unauthorized access to update this service'}), 403

    data = request.get_json()
    
    if 'name' in data:
        service.name = data['name']
    if 'description' in data:
        service.description = data['description']
    if 'type' in data:
        service.type = data['type']
    if 'price' in data:
        service.price = data['price']
    if 'duration' in data:
        service.duration = data['duration']
    if 'available' in data:
        service.available = data['available']
    if 'image' in data:
        service.image = data['image']
    
    db.session.commit()
    return jsonify({'message': 'Service updated successfully'}), 200



@api.route('/adminportal/<int:company_id>', methods=['GET'])
@jwt_required()
def company_portal(company_id):
    company = Companies.query.get_or_404(company_id)
    return jsonify([company.serialize()])

# @api.route('/adminportal/<int:company_id>', methods=['DELETE'])
# @jwt_required()
# def delete_company(company_id):
#     current_user_id = get_jwt_identity()
#     company = Companies.query.get_or_404(company_id)
    
#     if company.owner != current_user_id:
#         return jsonify({'error': 'Unauthorized'}), 401
    
#     try:
#         db.session.delete(company)
#         db.session.commit()
#         return jsonify({'message': 'Company deleted successfully'}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500


@api.route('/adminportal/<int:company_id>', methods=['PUT'])
@jwt_required()
def update_company_admin(company_id):
    current_user_id = get_jwt_identity()
    current_user = Users.query.get(current_user_id)

    if current_user.rol != 'company':
        return jsonify({'error': 'User is not authorized'}), 403
    
    company = Companies.query.get_or_404(company_id)
    data = request.get_json()
    
    company.name = data.get('name', company.name)
    company.location = data.get('location', company.location)
    company.owner = data.get('owner', company.owner)
    company.image = data.get('image', company.image)

    try:
        db.session.commit()
        return jsonify(company.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/master_services', methods=['GET'])
def get_master_services():
    master_services = MasterServices.query.all()
    return jsonify([service.serialize() for service in master_services]), 200

@api.route('/services', methods=['GET'])
def get_services():
    companies_id = request.args.get('companies_id')
    if companies_id:
        services = Services.query.filter_by(companies_id=companies_id).all()
    else:
        services = Services.query.all()
    return jsonify([service.serialize() for service in services]), 200

@api.route('/all_services', methods=['GET'])
def get_all_services():
    services = Services.query.all()
    return jsonify([service.serialize() for service in services]), 200

@api.route('/services', methods=['POST'])
def add_service():
    data = request.get_json()
    companyid = data.get('companyid')
    new_service = Services(
        name=data['name'],
        description=data['description'],
        type=data['type'],
        price=data['price'],
        duration=data['duration'],
        companies_id=companyid,  # Use the provided user's ID to link the service to their company
        available=data['available'],
        image=data['image']
    )
    db.session.add(new_service)
    db.session.commit()

    return jsonify(new_service.serialize()), 201

@api.route('/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    data = request.get_json()
    userid = data.get('user_id')
    serviceid = data.get('services_id')
    new_booking = Bookings(
        services_id=serviceid,
        users_id=userid,
        start_day_date=data['start_day_date'],
        start_time_date=data['start_time_date']
    )
    db.session.add(new_booking)
    db.session.commit()    
    booking_id = new_booking.id
    
    response_data = new_booking.serialize()
    response_data['id'] = booking_id
    
    return jsonify(response_data), 201

@api.route('/requests', methods=['POST'])
@jwt_required()
def create_request():
    data = request.get_json()
    new_request = Requests(
        bookings_id=data.get('booking_id'),
        status=data.get('status'),
        comment=data.get('comment')
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify(new_request.serialize()), 201

@api.route('/user_bookings', methods=['GET'])
def get_user_bookings():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"msg": "User ID is required"}), 400
    bookings = Bookings.query.filter_by(users_id=user_id).all()
    return jsonify([booking.serialize() for booking in bookings]), 200

@api.route('/user_requests', methods=['GET'])
def get_user_requests():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"msg": "User ID is required"}), 400
    requests = Requests.query.join(Bookings).filter(Bookings.users_id == user_id).all()
    return jsonify([request.serialize() for request in requests]), 200


@api.route('/companies/<int:company_id>/requests', methods=['DELETE'])
@jwt_required()
def delete_requests(company_id):
    company = Companies.query.get_or_404(company_id)
    services = Services.query.filter_by(companies_id=company_id).all()
    for service in services:
        bookings = Bookings.query.filter_by(services_id=service.id).all()
        for booking in bookings:
            Requests.query.filter_by(bookings_id=booking.id).delete()
    try:
        db.session.commit()
        return jsonify({"message": "Requests deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/companies/<int:company_id>/bookings', methods=['DELETE'])
@jwt_required()
def delete_bookings(company_id):
    company = Companies.query.get_or_404(company_id)
    services = Services.query.filter_by(companies_id=company_id).all()
    for service in services:
        Bookings.query.filter_by(services_id=service.id).delete()
    try:
        db.session.commit()
        return jsonify({"message": "Bookings deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/companies/<int:company_id>/services', methods=['DELETE'])
@jwt_required()
def delete_services(company_id):
    company = Companies.query.get_or_404(company_id)
    Services.query.filter_by(companies_id=company_id).delete()
    try:
        db.session.commit()
        return jsonify({"message": "Services deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/companies/<int:company_id>', methods=['DELETE'])
@jwt_required()
def delete_company(company_id):
    company = Companies.query.get_or_404(company_id)
    db.session.delete(company)
    try:
        db.session.commit()
        return jsonify({"message": "Company deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@api.route('/company/<int:company_id>', methods=['GET'])
def get_company_public(company_id):
    try:
        # Obtener la compañía por ID
        company = Companies.query.get(company_id)
        if not company:
            return jsonify({"msg": "Company not found"}), 404

        # Obtener los servicios de la compañía
        services = Services.query.filter_by(companies_id=company_id).all()

        # Serializar la información de la compañía y sus servicios
        company_data = company.serialize()
        company_data["services"] = [service.serialize() for service in services]

        return jsonify(company_data), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

