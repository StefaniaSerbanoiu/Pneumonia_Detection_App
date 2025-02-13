from flask import Flask
from user import db, User
from flask import request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from app import app, server_session


bcrypt = Bcrypt(app)


@app.route("/register", methods=["POST"])
def register_user():
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]

    is_username_in_use = User.query.filter_by(username=username).first() is not None
    is_email_in_use = User.query.filter_by(email=email).first() is not None

    if is_username_in_use or is_email_in_use:
        return jsonify({"error": "The email and/or username are already used by another user."}), 409 # HTTP 409 Conflict response

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(username = username, email = email, password = hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "username": new_user.username, 
        "email": new_user.email
    })



@app.route("/login", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first() # find a user by the provided username

    if user is None:
        # if there is no user with that username, we'll consider it the email and search for a username with that email
        user = User.query.filter_by(email=username).first()
        if user is None:
            return jsonify({"error": "There isn't any user with that username or that email."}), 401 # return http status 401

    if not bcrypt.check_password_hash(user.password, password): # check if the password matches the account
        return jsonify({"error": "The password for that account is incorrect!"}), 401 # return http status 401, unauthorized
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "username" : user.username,
        "email": user.email
    }), 200 # return http status 200, OK



@app.route("/user")
def get_current_user():
    current_user_id = session.get("user_id") # get the id of the user who just logged in

    if not current_user_id:
        return jsonify({"Error": "The current user is not authorized"}), 401
    
    current_user = User.query.filter_by(id=current_user_id).first() # get current user by its id and stop the query immediately after is it found
    
    return jsonify({ # return credentials of the current user except password
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    })


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id") # delete the current user's id from the session data
    return "The current user has logged out" # return the message to see that the loggin out was successful


@app.route("/users", methods=["GET"])
def get_all_users():
    users = User.query.all()
    all_users = [{"id": user.id, "username": user.username, "email": user.email} for user in users]
    
    return jsonify(all_users)


@app.route("/user/<username>", methods=["GET"])
def get_user_by_username(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return jsonify({"Error": "The user was not found"}), 404
    user_data = {"id": user.id, "username": user.username, "email": user.email}
    
    return jsonify(user_data)


@app.route("/user/<username>", methods=["DELETE"])
def delete_user(username):
    user = User.query.filter_by(username=username).first() 
    if user is None:
        return jsonify({"Error": "The user was not found!"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Successful deletion!"}), 200



@app.route("/user/<username>", methods=["PUT"])
def update_user(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return jsonify({"error": "The user was not found"}), 404
    
    data = request.get_json()
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    
    db.session.commit()
    user_data = {"id": user.id, "username": user.username, "email": user.email}
    
    return jsonify(user_data), 200



@app.route("/user", methods=["POST"])
def add_user():
    data = request.get_json()

    if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first():
        return jsonify({"Error": "Username or email already exists"}), 409
    
    new_user = User(username=data['username'], email=data['email'], password=data['password']) 
    db.session.add(new_user)
    db.session.commit()
    user_data = {"id": new_user.id, "username": new_user.username, "email": new_user.email}
    
    return jsonify(user_data), 201