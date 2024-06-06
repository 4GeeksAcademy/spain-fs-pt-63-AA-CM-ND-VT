"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Company, Service
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

# Dummy implementations of functions called in the routes above
def add_user(body):
    # Logic to add a user
    pass

def get_user(user_id):
    # Logic to get a user
    pass

def add_service(company_id, body):
    # Logic to add a service
    pass

def get_services(company_id):
    # Logic to get services of a company
    pass

def add_member(user_id, company_id, body):
    # Logic to add a member to a company
    pass

def add_request(request_id, body):
    # Logic to add a request
    pass

def get_user_requests(user_id, company_id):
    # Logic to get user requests for a company
    pass


