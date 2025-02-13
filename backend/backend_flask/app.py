from __future__ import division, print_function
from flask import Flask, jsonify, redirect, url_for, request, render_template
from flask_session import Session
from config import ApplicationConfig
from user import db, User
from flask_cors import CORS, cross_origin
import sys
import os
import glob
import re
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img
from tensorflow.keras.preprocessing.image import img_to_array
# Keras
from keras.applications.imagenet_utils import preprocess_input, decode_predictions
from keras.models import load_model
from keras.preprocessing import image
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer



global app, server_session
app = Flask(__name__)
app.config.from_object(ApplicationConfig)

global server_session
server_session = Session(app)

db.init_app(app)

with app.app_context(): # create app context
    db.create_all()

import user_controller
CORS(app, supports_credentials=True)





MODEL_PATH = 'pneumonia_model.h5'
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
model = tf.keras.models.load_model(MODEL_PATH)



def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def preprocess_image(img_path):
    height = 224
    width = 224

    img = image.load_img(img_path, target_size=(height, width))
    
    img_array = image.img_to_array(img) # converting to numpy array
    img_array = img_array / 255.0 # the image is rescaled
   
    img_array = np.expand_dims(img_array, axis=0) # match the model's input shape by expanding dimensions to (1, 224, 224, 3)
    
    return img_array


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files: # check for files in the request
        return jsonify({'Error': 'No file in the upload'}), 400 # bad request
    file = request.files['file']
    if file.filename == '':
        return jsonify({'Error': 'The filename is empty'}), 400 # bad request

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        preprocessed_image = preprocess_image(filepath)
        prediction = model.predict(preprocessed_image)
        predicted_class = (prediction > 0.5).astype("int32")[0][0] # use a threshold value
        class_names = ['NORMAL', 'PNEUMONIA']
        result = class_names[predicted_class]

        return jsonify({'result': result}), 200 # ok status

    return jsonify({'Error': 'The upload of the file failed!'}), 500 # internal server error




if __name__ == '__main__':
    app.run(debug=True)