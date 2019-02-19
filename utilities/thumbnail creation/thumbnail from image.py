from PIL import Image
from io import BytesIO
import os
import math

size = 512, 512

def make_thumbnail(objectID):
    filepath = os.path.dirname(os.path.abspath(__file__))
    image = Image.open(os.path.join(filepath, '{}.jpg'.format(objectID)))
    image.thumbnail(size, Image.ANTIALIAS)

    filepath = os.path.join(filepath, str(objectID))
    image.save(filepath + ".jpg", "JPEG")

IDs = [23143, 324830, 324917, 544501]

for id in IDs:
    make_thumbnail(id)
    print("finished with {}".format(id))