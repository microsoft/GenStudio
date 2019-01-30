import json
from itertools import islice
from urllib.request import urlopen
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import PIL.Image as Image
import requests
from moviepy.editor import *
from scipy.stats import truncnorm
from io import BytesIO

# Initialize the module
os.environ["TFHUB_CACHE_DIR"] = "C:\\Users\\v-ngdian\\Documents\\Video Maker\\tf_hub_dir"
module_path = 'https://tfhub.dev/deepmind/biggan-256/2'

tf.reset_default_graph()
module = hub.Module(module_path)

inputs = {k: tf.placeholder(v.dtype, v.get_shape().as_list(), k)
          for k, v in module.get_input_info_dict().items()}
output = module(inputs)

input_z = inputs['z']
input_y = inputs['y']
input_trunc = inputs['truncation']

dim_z = input_z.shape.as_list()[1]
vocab_size = input_y.shape.as_list()[1]

# Set up helper functions
def one_hot(index, vocab_size=vocab_size):
  index = np.asarray(index)
  if len(index.shape) == 0:
    index = np.asarray([index])
  assert len(index.shape) == 1
  num = index.shape[0]
  output = np.zeros((num, vocab_size), dtype=np.float32)
  output[np.arange(num), index] = 1
  return output

def one_hot_if_needed(label, vocab_size=vocab_size):
  label = np.asarray(label)
  if len(label.shape) <= 1:
    label = one_hot(label, vocab_size)
  assert len(label.shape) == 2
  return label

def sample(sess, noise, label, truncation=1., batch_size=8,
           vocab_size=vocab_size):
  noise = np.asarray(noise)
  label = np.asarray(label)
  num = noise.shape[0]
  if len(label.shape) == 0:
    label = np.asarray([label] * num)
  if label.shape[0] != num:
    raise ValueError('Got # noise samples ({}) != # label samples ({})'
                     .format(noise.shape[0], label.shape[0]))
  # label = one_hot_if_needed(label, vocab_size)
  ims = []
  for batch_start in range(0, num, batch_size):
    s = slice(batch_start, min(num, batch_start + batch_size))
    feed_dict = {input_z: noise[s], input_y: label[s], input_trunc: truncation}
    ims.append(sess.run(output, feed_dict=feed_dict))
  ims = np.concatenate(ims, axis=0)
  assert ims.shape[0] == num
  ims = np.clip(((ims + 1) / 2.0) * 256, 0, 255)
  ims = np.uint8(ims)
  return ims

def interpolate(A, B, num_interps):
  alphas = np.linspace(0, 1, num_interps)
  if A.shape != B.shape:
    raise ValueError('A and B must have the same shape to interpolate.')
  interps = np.array([(1-a)*A + a*B for a in alphas])
  return (interps.transpose(1, 0, *range(2, len(interps.shape)))
                 .reshape(num_interps, *interps.shape[2:]))

# Initialize TensorFlow session
initializer = tf.global_variables_initializer()

graph = tf.get_default_graph()
with graph.as_default():
  sess = tf.Session()
  sess.run(initializer)

def generate(label_A, label_B, seed_A, seed_B, num_interps=5):
  print("GENERATING")
  num_samples = 1
  truncation = 0.2

  z_A, z_B = seed_A * truncation, seed_B * truncation
  y_A, y_B = label_A, label_B

  z_interp = interpolate(z_A, z_B, num_interps)
  y_interp = interpolate(y_A, y_B, num_interps)

  return sample(sess, z_interp, y_interp, truncation=truncation, batch_size=10)

def getData(objectID):
  print("getting data")
  URL = "https://deepartstorage.blob.core.windows.net/public/inverted/biggan1/seeds/{}.json".format(objectID)
  response = urlopen(URL)
  data = json.load(response)
  return data

def getInversion(objectID):
  URL = "https://deepartstorage.blob.core.windows.net/public/inverted/biggan1/images/{}.png".format(objectID)
  with urlopen(URL) as url:
    f = BytesIO(url.read())
  img = Image.open(f)
  return np.array(img)

def makeSquare(img):
  "return a white-background-color image having the img in exact center"
  size = (max(img.size),)*2
  layer = Image.new('RGB', size, (255,255,255,0))
  layer.paste(img, tuple(map(lambda x:(x[0]-x[1])//2, zip(size, img.size))))
  return layer

def getOriginal(objectID):
  URL = "https://deepartstorage.blob.core.windows.net/public/thumbnails4/{}.jpg".format(objectID)
  with urlopen(URL) as url:
    f = BytesIO(url.read())
  img = Image.open(f)

  img = makeSquare(img)  
  size = 256, 256
  img.thumbnail(size, Image.ANTIALIAS)
  return np.array(img)

def window(seq, n=2):
    "Returns a sliding window (of width n) over data from the iterable"
    "   s -> (s0,s1,...s[n-1]), (s1,s2,...,sn), ...                   "
    it = iter(seq)
    result = tuple(islice(it, n))
    if len(result) == n:
        yield result
    for elem in it:
        result = result[1:] + (elem,)
        yield result

def run(name, objects, num_interps, fps):
  print("starting") # generate images
  original = np.array([getOriginal(objects[0])])
  inversion = np.array([getInversion(objects[0])])

  seeds = []
  labels = []
  images = []
  images.extend(np.repeat(original, 20, axis=0))
  images.extend(np.repeat(inversion, 20, axis=0))

  for object in objects:
    data = getData(object)
    seeds.append(np.array([data["latents"]]))
    labels.append(np.array([data["labels"]]))

  for ((s1, l1), (s2, l2)) in window(zip(seeds, labels), 2):
    print("running") # generate images
    images.extend(list(generate(l1, l2, s1, s2, num_interps)))
    print("generated")

  # generate video from transitions
  video = ImageSequenceClip(images, fps)
  video.write_videofile("examples/{}.mp4".format(name), fps)

  # save images
  # for idx in range(images.shape[0]):
  #   Image.fromarray(images[idx], 'RGB').save('img%d.png' % idx)

objects = [205, 2138]
run("stillImageTest", objects, num_interps=60, fps=20)
