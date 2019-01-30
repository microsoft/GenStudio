import json
import random
import cv2
import matplotlib.animation as animation
import matplotlib.image as mpimg
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import cm
from PIL import Image
from scipy.spatial import Voronoi

dpi = 120
w, h = 1920, 1080
fig = plt.figure(figsize=(w/dpi, h/dpi), dpi=dpi)
fig.subplots_adjust(left=0, bottom=0, right=1, top=1, wspace=None, hspace=None)

# Function to extract frames 
def get_frame(path, i):
    cap = cv2.VideoCapture(path)
    cap.set(1, i)
    success, frame = cap.read()
    return frame

def display_frame(frame, x, y):
    img = Image.fromarray(frame)
    height = img.size[1]
    img = np.array(img).astype(np.float) / 255
    fig.figimage(img, x, y - height)

def updatefig(i, paths, locations):
    for path, location in zip(paths, locations):
        x, y = location
        frame = get_frame(path, i)
        display_frame(frame, x, y)

    plt.draw()

def run(names, locations):
    max_length = 0
    paths = []

    for video_name in names:
        path = "examples/{}.mp4".format(video_name)
        paths.append(path)

        cap = cv2.VideoCapture(path)
        length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if length > max_length:
            max_length = length

    background = Image.open('met projection.jpg')
    background = background.resize((w, h), Image.ANTIALIAS)
    fig.figimage(background, 0, 0)

    print("making animation")
    anim = animation.FuncAnimation(fig, updatefig, max_length, fargs=(paths, locations), interval=30)
    anim.save('bar.mp4')
    print("saved video")

    # plt.show()
        
x = random.randint(0, fig.bbox.xmax - 256)
y = random.randint(256, fig.bbox.ymax)

names = ["foo"] # video names
locations = [(x, y)] # (x, y) pair per video
run(names, locations)