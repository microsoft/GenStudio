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
    #url = request.files['url'].read()
    #request_data = json.loads(request.data.decode('utf-8'))
    #url = request_data['url']
    seed = np.random.rand(512).tolist()
    response = {"response": {"seed": seed}}
    response = json.dumps(response)
    return response

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=60)
