from flask import Flask, request, send_file
from flask_cors import CORS
from redis import Redis, RedisError
import os
import socket
import pickle
import numpy as np
import tensorflow as tf
import PIL.Image
import io
import json

app = Flask(__name__)
CORS(app)

graph = tf.get_default_graph()

with graph.as_default():
    # Initialize TensorFlow session.
    sess = tf.Session().__enter__()

    # Import trained network
    with open('network-final.pkl', 'rb') as file:
        G, D, Gs = pickle.load(file)


@app.route('/seed2image', methods=['POST'])
def generateArt():
    global graph
    global G, D, Gs
    global sess

    # Get seed
    latents = np.expand_dims(np.array(json.loads(request.form.get('seed'))), -1)
    latents = np.reshape(latents, (1, 512))
    assert latents.shape == (1,512)
    
    # Generate dummy labels (not used by the official networks).
    labels = np.zeros([latents.shape[0]] + Gs.input_shapes[1][1:])

    # Run the generator to produce a set of images.
    with sess.as_default():
        with graph.as_default():
            images = Gs.run(latents, labels)

    # Convert images to PIL-compatible format.
    images = np.clip(np.rint((images + 1.0) / 2.0 * 255.0), 0.0, 255.0).astype(np.uint8) # [-1,1] => [0,255]
    images = images.transpose(0, 2, 3, 1) # NCHW => NHWC

    imgByteArr = io.BytesIO()
    PIL.Image.fromarray(images[0], 'RGB').save(imgByteArr, format='JPEG')
    imgByteArr.seek(0)
    return send_file(imgByteArr, attachment_filename='image.jpeg', mimetype='image/jpeg')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)