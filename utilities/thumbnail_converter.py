import pandas as pd
from PIL import Image
import requests
from io import BytesIO
import os
import math

df = pd.read_csv('MetArtworksAugmented.csv')

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
        print("Invalid URL: {}".format(url))
        return

for index, row in df.iterrows():    
    objectID = row['Object ID']
    url = row['PrimaryImageUrl']

    if index%100==0:
        print("Working on index: " + str(index) + " with object id: " + str(objectID))

    if isinstance(url, float) and math.isnan(url):
        next
    elif not isinstance(objectID, int):
        print("Object id: {} not an integer".format(objectID))
        next
    else:
        make_thumbnail(objectID, url)

print("Finished!")