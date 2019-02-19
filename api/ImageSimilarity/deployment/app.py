from flask import Flask
from flask import request
import json
import os
import gc
import pickle
import numpy as np
import pandas as pd
from PIL import Image, ImageFile
from urllib.request import urlopen
from sklearn.externals import joblib
from annoy import AnnoyIndex
import keras
from keras import backend as K
from keras.applications.resnet50 import ResNet50
from keras.applications.resnet50 import preprocess_input
import tensorflow as tf
import io
from sklearn.neighbors import NearestNeighbors
from flask_cors import CORS
import argparse
import base64


def log(stringToPrint):
    '''
    This method will log to the console if debug variable is set to True. debug is an input parameter.
    '''
    global debug
    if debug:
        print(stringToPrint)

app = Flask(__name__)
CORS(app)

# #define command line arguments
parser = argparse.ArgumentParser(description='Provide model filenames & config settings')
parser.add_argument('-k','--knn', default =None, required=False, help='Filepath to the KNN model')
parser.add_argument('-t','--targets',default='./targets.pkl', required=True, help='filepath to the list of target objects')
parser.add_argument('-a','--annoy',default=None, required=False, help='filepath to the annoy model')
parser.add_argument('-d','--debug', default=True, required = False, help='boolean for debug statements or not')


# #parse arguments
args = parser.parse_args()

debug = args.debug
targets_filepath = args.targets


#get model filepaths
if(args.knn is None):
    if(args.annoy is not None):
        annoy_file = args.annoy
        log(annoy_file)
        isKnn = False
    else:
        raise Exception('Must provide a model filepath')
else:
    knn_file = args.knn
    log(knn_file)
    isKnn = True

ImageFile.LOAD_TRUNCATED_IMAGES = True

#set img width and height that the images will be resized to
img_width = 512
img_height = 512
keras_model = None
knn_model = None
annoy_model = None
targets = None
graph = tf.get_default_graph()

def load_model():
    '''
    this method will load the keras and KNN model (or Annoy) into memory
    '''
    global keras_model
    global knn_model
    global annoy_model
    global targets
    global img_width
    global img_height
    global graph
    global knn_file
    global targets_filepath
    global isKnn
    log('start of load_model function')
    K.clear_session()

    if isKnn:
        knn_model = joblib.load(knn_file)   
    else:
        length = 2048 
        annoy_model = AnnoyIndex(length)
        annoy_model.load(annoy_file)
        
    log('loaded knn')
    with graph.as_default():
        keras_model = ResNet50(input_shape=[img_width,img_height,3], 
                     weights='imagenet', 
                     include_top=False, 
                     pooling='avg')
    
    log('loaded keras model')
    
    targets = pickle.load(open(targets_filepath,'rb'))
    targets = np.array(targets)
    
    log('loaded models')

@app.route('/FindSimilarImages/Byte', methods=['POST'])
def FindSimilarImagesByte():
    '''
    This method will recieve an input image as a base 64 byte stream & find the closest neighbors. # defined by the neighbors input param. 
    '''

    log('Starting FindSimilarImages Byte method')
    data = request.form['image']
    
    #load the # of neighbors to return
    neighbors = request.args.get('neighbors')
    if neighbors is None:
        neighbors = 4 #default
        log('using default neighbors: %d' % neighbors)
    else:
        neighbors = int(neighbors)
    print('number of neighbors: %d' % neighbors)
    #grab the matches
    return generateMatch(img_input = data , k_neighbors = neighbors, input_type = 2)
    
   

@app.route('/FindSimilarImages', methods=['POST'])
def FindSimilarImages():
    '''
    this method will find the closest neighbors for an image provided as a file
    '''
    if request.method=='POST':
        try:
            #load image sent in the request
            log('Starting FindSimilarImages method')
            file = request.files['image'].read() 
            log('reading file in FindSimilarImages')
            #load the # of neighbors to return
            neighbors = request.args.get('neighbors')
            if neighbors is None:
                neighbors = 4 #default
                log('using default neighbors: %d' % neighbors)
            else:
                neighbors = int(neighbors)
            print('number of neighbors: %d' % neighbors)
            #grab the matches
            return generateMatch(img_input = file , k_neighbors = neighbors, input_type = 1)
        except Exception as e:
            return e

@app.route('/FindSimilarImages/url', methods = ['POST'])
def generateMatchUrl():
    '''
    This method will get the closest neighbors to an image provided as a URL
    '''
    if request.method == 'POST':
        try:
    
            request_data = json.loads(request.data.decode('utf-8'))
            log("type")
            log(request_data)
            urlInput = request_data['urlInput'] 

            #load the # of neighbors to return
            neighbors = request.args.get('neighbors')
            if neighbors is None:
                neighbors = 4 #default
            else:
                neighbors = int(neighbors)

            return generateMatch(img_input = urlInput, k_neighbors = neighbors, input_type = 0)

        except Exception as e:
            return e

@app.route('/FindSimilarImages/urlBatch', methods = ['POST'])
def generateMatchUrlBatch():
    '''
    This method will get the closest neighbors to an image provided as a URL
    '''
    if request.method == 'POST':
        try:
    
            request_data = json.loads(request.data.decode('utf-8'))
            log("type")
            log(request_data)
            urlInput = request_data['urlInput'] 

            if len(urlInput) > 32:
                urlInput = urlInput[:32]
    

            #load the # of neighbors to return
            neighbors = request.args.get('neighbors')
            if neighbors is None:
                neighbors = 4 #default
            else:
                neighbors = int(neighbors)

            return generateMatchBatch( imgs_input = urlInput, k_neighbors = neighbors, input_type = 0)

        except Exception as e:
            return e

def getNeighborsKnn(img_features, k_neighbors):
    '''
    this method will get the closest neighbors using the Knn model
    '''
    global knn_model
    global targets

    neighbors = knn_model.kneighbors(img_features,n_neighbors = k_neighbors, return_distance=True)
    # print the pictures
    idx_matches = neighbors[1][0]
    log(idx_matches)
    match_ids = targets[idx_matches]
    match_dist = neighbors[0][0]
    matches = np.vstack((match_ids[:,0], match_ids[:,1],match_dist))

    return matches

def getNeighborsAnnoy(img_features, k_neighbors):
    '''
    this method will get the closest neighbors using the Annoy Model
    '''
    global annoy_model
    global targets
    neighbors = annoy_model.get_nns_by_vector(img_features,k_neighbors,search_k = -1,include_distances=True)
    idx_matches = neighbors[0]
    match_ids = targets[idx_matches]
    match_dist = neighbors[1]
    matches = np.vstack((match_ids[:,0], match_ids[:,1],match_dist))
    return matches

def generateMatch(img_input, k_neighbors, input_type):
    '''
    This method will load the image to be processed and then will send to the appropriate model
    '''
    img = getImage(img_input, input_type)
    X = preprocessInput(img)
    matches = getNeighbors(X, k_neighbors)
    matches = formatMatches(matches)
    response = json.dumps({'results':matches})
    return response

def generateMatchBatch(imgs_input, k_neighbors, input_type):
    '''
    This method will process matches for a batch of URLs. It will first download all the images and then run through the
    preprocessing as a batch. 
    '''
    #get each image from web
    input_img = []
    for img in imgs_input:
        input_img.append(getImage(img, 0))

    #featurize the images as a batch
    X = preprocessInputBatch(input_img)

    #get neighbors for each image & format
    i = 0
    response = []
    for vec in X:
        matches = formatMatches(getNeighbors(X = vec, k_neighbors = 2))
        response.append({"url": imgs_input[i], "matches": matches})
    # print(matches)

    return json.dumps({'results': response})


def getImage(img_input, input_type):
    '''
    This method will load images into the correct format based on the input_type to the API. This will handle the following input_types

    input_type:
     0: url to the image
     1: file was sent 
     2: base 64 byte stream was sent
    '''
    global img_width
    global img_height
    
    if input_type == 0:
            with urlopen(img_input) as file:
                img = Image.open(file)
    elif input_type == 1:
            log('loading image from file uploaded')
            img = Image.open(io.BytesIO(img_input)).resize((img_width,img_height))
    elif input_type == 2:
            img = Image.open(io.BytesIO(base64.b64decode(img_input)))   

    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    return img

def preprocessInput(img):
    '''
    This method will pre-process the images by running it through the ResNet50 model. The output is the 2048 vector representation of the image
    '''
    global keras_model
    global img_width
    global img_height
    global graph
    with graph.as_default():
        np_img = np.array(img.resize((img_width, img_height)))
        X = preprocess_input(np.expand_dims(np_img, axis=0).astype(np.float))
        X = keras_model.predict(X)
    return X

def preprocessInputBatch(img_array):
    '''
    This method will pre-process the batch of images by running it through the ResNet50 model. The output is the 2048 vector representations for each image
    '''
    global keras_model
    global img_width
    global img_height
    global graph   
    
    #need to re-order the images to be the correct format (n, img_width, img_height, 3)
    np_imgs = []
    for img in img_array:
        np_img = np.array(img.resize((img_width,img_height)))
        np_imgs.append(np_img)
    np_imgs = np.array(np_imgs).astype(np.float)
    
    with graph.as_default():
        X = preprocess_input(np_imgs)
        X = keras_model.predict(X)
    return X
        
def getNeighbors(X, k_neighbors):
    '''
    This method will get the k_neighbors neighbors to the provided featurized image, X
    '''
    global isKnn
    #get neighbors
    if isKnn:
        matches = getNeighborsKnn(img_features = X, k_neighbors = k_neighbors)
    else:
        X = np.array(X).flatten().tolist()
        matches = getNeighborsAnnoy(img_features = np.array(X).flatten().tolist(), k_neighbors = k_neighbors)
    return matches

#build the json response
def formatMatches(matches):
    '''
    This method will re-format the match neighbors into the json structure used by the API
    '''
    response = []
    for i in range(matches[0].shape[0]):    
        response.append({'ObjectID': matches[0][i], 'url': matches[1][i], 'distance': matches[2][i]})
    
    return response


if __name__ == "__main__":
    log(("* Loading Keras model and Flask starting server..."
		"please wait until server has fully started"))
    #K.clear_session()
    load_model()
    log('model loaded')
    app.run(debug=False, host='0.0.0.0', port=5000)
