"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, Companies, Services, Requests, MasterServices, Bookings, Ratings
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/', methods=['GET'])
def handle_landing():
    response_body = {
        "msg": "Welcome to the API"
    }
    return jsonify(response_body), 200


@api.route('/login', methods=['POST', 'GET'])
def handle_login():
    if request.method == 'POST':
        body = request.json
        # Implement your add_user function logic here
        return add_user(body)
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        # Implement your get_user function logic here
        return get_user(user_id)


@api.route('/<int:company_id>', methods=['POST', 'GET'])
def handle_company(company_id):
    company = Company.query.get(company_id)
    if company is None:
        return jsonify({'ERROR': 'Company not found or does not exist'}), 404

    if request.method == 'POST':
        body = request.json
        # Implement your add_service function logic here
        return add_service(company_id, body)
    if request.method == 'GET':
        # Implement your get_services function logic here
        return get_services(company_id)
    
@api.route('/clientportal/<int:user_id>', methods=['GET'])
def handle_user(user_id):
    client_portal = Users.query.get(user_id)
    if client_portal is None:
        return jsonify({'ERROR': 'Client not found or does not exist'}), 404
                


@api.route('/<int:user_id>/services/<int:company_id>', methods=['GET'])
def handle_get_service(user_id, company_id):
    body = request.json
    # Implement your add_member function logic here
    return add_member(user_id, company_id, body)


@api.route('/<int:user_id>/request/<int:request_id>', methods=['POST'])
def handle_post_request(user_id, request_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'ERROR': 'User not found or does not exist'}), 404

    body = request.json
    # Implement your add_request function logic here
    return add_request(request_id, body)


@api.route('/<int:user_id>/<int:company_id>', methods=['GET'])
def handle_get_requests(user_id, company_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'ERROR': 'User not found or does not exist'}), 404
    # Implement your logic to get user requests for a company here
    response = get_user_requests(user_id, company_id)
    return jsonify(response), 200


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

