import os

import PIL.Image
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from keras.applications import resnet50
from keras.applications.resnet50 import ResNet50
from keras.backend import set_session
from scipy.stats import truncnorm

# Initialize the module
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


# Initialize TensorFlow session
initializer = tf.global_variables_initializer()

graph = tf.get_default_graph()
with graph.as_default():
    sess = tf.Session()
    sess.run(initializer)
    set_session(sess)

    # Categories found here: https://gist.github.com/yrevar/942d3a0ac09ec9e5eb3a
    seed = np.random.randn(1, 140)  # (1, 140)
    resolution = 256
    assert seed.shape == (1, 140)

    def featurize(image_node):
        image_node = (image_node + 1.0) / 2.0 * 255.0
        input_tensor = resnet50.preprocess_input(tf.image.resize_images(image_node, [224, 224]))
        model = ResNet50(include_top=True, weights='imagenet', input_shape=(224, 224, 3), input_tensor=input_tensor)
        return model.output.op.inputs[0]


    target = tf.placeholder(tf.float32, (None, resolution, resolution, 3), name="target")
    output_node = tf.identity(output, name="output")
    deep_output = featurize(output_node)
    deep_target = tf.identity(featurize(target), name="deep_target_logits")

    loss = tf.reduce_mean(tf.square((output_node - target)), name="loss")
    print("output_node")
    print(output_node)
    print("target")
    print(target)
    deep_loss = tf.reduce_mean(tf.square((deep_output - deep_target)), name="deep_loss")

    print(input_y.name, input_z.name, loss.name, target.name, output_node.name)

    saver = tf.train.Saver()
    saver.export_meta_graph("checkpoints/generator_test_biggan_1.meta")
    saver.save(sess, "checkpoints/generator_test_biggan_1.ckpt")


    # Quick sanity check: Network classifies tiger correctly

    def toNetworkSpace(img):
        img = np.array(img.resize((resolution, resolution), PIL.Image.ANTIALIAS))
        return (img - (255.0 / 2.0)) / 255.0
    target_img = np.array([toNetworkSpace(PIL.Image.open(os.path.join("test_images", "tiger.jpg")))])
    [out] = sess.run([deep_target], {target: target_img})
    assert np.argmax(out) == 292 #Check that the class is tigery
