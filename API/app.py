from flask import Flask
from flask import request
import pandas as pd
import json
import os
import socket
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/GetIDsByCategory")
def handleRequest():
    category = str(request.args.get('category'))
    numIDs = int(request.args.get('numids'))
    result_type = str(request.args.get('resulttype')) #first, curated, random
    objectIds = getIDsbyCategory(category, numIDs, result_type)
    response = convertToJSON(objectIds, category, numIDs, result_type)
    return response


def getIDsbyCategory(category, numIDs, result_type):
    tags = pd.read_csv('MetTaggingData12_7_2018.csv')
    ids = tags[tags.Tags == category].ObjectID.values
    if result_type == "first":
        return ids[:numIDs]
    elif result_type == "curated":
        pass
    else: #random
        pass

def convertToJSON(npArr, category, num_ids, result_type):
    response = {"ObjectIds": npArr.tolist()}
    response = json.dumps({'results': response})
    return response

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
