from flask import Flask
from flask import request
import numpy as np
import json
import os
import socket
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/url")
def handleRequest():
    url = request.form['url']
    seed = np.random.rand(512)
    seed = seed * 2
    seed = seed - 1
    seed = seed.tolist()
    response = {"seed": seed}
    response = json.dumps(response)
    return response

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
