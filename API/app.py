from flask import Flask
from flask import request
import pandas as pd
import json
import os
import socket
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

curated_images = {'vessels' : [249414, 324431, 544501, 324830, 324917, 329070, 325676, 42447, 44072, 8288, 662161, 451766, 446996, 443137, 201671, 751402, 232038, 202194],
'armors' : [22270, 24937, 25114, 22848, 35652, 22408, 23143],
'jewelry' : [483898, 552392, 5405, 784629, 464073, 326937]
}

@app.route("/GetIDsByCategory")
def handleRequest():
    category = str(request.args.get('category'))
    numIDs = int(request.args.get('numids'))
    result_type = str(request.args.get('resulttype')) #first, curated, random
    objectIds = getIDsbyCategory(category, numIDs, result_type)
    response = convertToJSON(objectIds, category, numIDs, result_type)
    return response


def getIDsbyCategory(category, numIDs, result_type):
    if result_type == "first":
        tags = pd.read_csv('MetTaggingData12_7_2018.csv')
        ids = tags[tags.Tags == category].ObjectID.values
        return ids[:numIDs].tolist()
    elif result_type == "curated":
        if len(curated_images[category]) < numIDs:
            return curated_images[category]
        return curated_images[category][:numIDs]
    else: #random
        raise ValueError('Random selection has not been implemented.')
        

def convertToJSON(npArr, category, num_ids, result_type):
    response = {"ObjectIds": npArr}
    response = json.dumps({'results': response})
    return response

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
