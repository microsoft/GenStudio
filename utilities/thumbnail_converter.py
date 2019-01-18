import pandas as pd
from PIL import Image
import requests
from io import BytesIO
import os

df = pd.read_csv('Met_Classification.csv')
objectIDs = df['Object ID']
urls = df['PrimaryImageUrl']

size = 192, 192

def make_thumbnail(objectID, url):
    try:
        response = requests.get(url)
        image = Image.open(BytesIO(response.content))
        image.thumbnail(size, Image.ANTIALIAS)

        filepath = os.path.dirname(os.path.abspath(__file__))
        filepath = os.path.join(filepath, 'thumbnails', str(objectID))
        image.save(filepath, "JPEG")
    except Exception as e:
        print("Failed URL: {}".format(url))
        print(e)
        return

counter = 0

for index, row in df.iterrows():
    counter += 1
    
    objectID = row['Object ID']
    url = row['PrimaryImageUrl']

    if not isinstance(objectID, int):
        print("Failed object id: {}".format(objectID))
        next

    if counter%100==0:
        print("Progress: " + str(counter) + " on object id " + str(objectID))

    make_thumbnail(objectID, url)

print("Finished!")