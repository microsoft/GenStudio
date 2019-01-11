
from flask import Flask
from flask import request
import pandas as pd
import json
import os
import socket


app = Flask(__name__)

@app.route("/GetIDsByCategory")
def handleRequest():
    #log(request_data)
    category = request.args.get('category') 
    numIDs = request.args.get('numids')
    result_type = request.args.get('resulttype') #first, curated, random
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
    response = {"ObjectIds": npArr}
    response = json.dumps({'results': response})

 
    html = "<h3>Hello World!</h3>" \
           "<b>category:</b> {category}<br/>" \
           "<b>num IDs:</b> {num_ids}<br/>" \
           "<b>result type:</b> {result_type}<br/>" \
           "<b>results:</b> {npArr}"
    return html.format(category=category, num_ids=num_ids, result_type=result_type, npArr=str(npArr))

    return response
    #maybe better: return json.dumps({"ObjectIds": npArr})
    #http://localhost:6000/GetIDsByCategory?category=Boats?numids=9?resulttype=first

def hello():
    try:
        visits = redis.incr("counter")
    except RedisError:
        visits = "<i>cannot connect to Redis, counter disabled</i>"

    html = "<h3>Hello {name}!</h3>" \
           "<b>Hostname:</b> {hostname}<br/>" \
           "<b>Visits:</b> {visits}"
    return html.format(name=os.getenv("NAME", "world"), hostname=socket.gethostname(), visits=visits)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
