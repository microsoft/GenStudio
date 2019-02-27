import pandas as pd
from PIL import Image
import requests
from io import BytesIO
import os
import math

df = pd.read_csv('C:\\Users\\v-ngdian\\Documents\\utilities\\thumbnail creator\\MetArtworksAugmented.csv')
size = 512, 512
ids = []

def make_thumbnail(objectID, url, foldername):
    try:
        response = requests.get(url)
        image = Image.open(BytesIO(response.content))
        ids.append(objectID)
        image.thumbnail(size, Image.ANTIALIAS)

        filepath = os.path.dirname(os.path.abspath(__file__))
        filepath = os.path.join(filepath, foldername, str(objectID) + '.jpg')
        image.save(filepath, "JPEG")
    except Exception as e:
        print("Invalid URL: {}".format(url))
        return

def run(category, foldername):
    df_filtered = df[df['Object Name'] == category]
    print("There are {} objects in ".format(df_filtered.shape[0]) + category)

    counter = -1

    for index, row in df_filtered.iterrows():
        counter += 1

        objectID = row['Object ID']
        url = row['PrimaryImageUrl']

        if counter%50==0:
            print("Working on object: " + str(counter) + " with id: " + str(objectID))
        
        if isinstance(url, float) and math.isnan(url):
            next
        elif not isinstance(objectID, int):
            print("Object id: {} not an integer".format(objectID))
            next
        else:
            make_thumbnail(objectID, url, foldername)

run("vase", "vases")
print(ids)