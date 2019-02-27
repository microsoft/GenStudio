import os
import PIL.Image
import numpy as np
import tensorflow as tf
import json

batch_size = 1
latent_size = 140
label_size = 1000
resolution = 256
run_prefix = "multi"
reg_loss_weight = 0.0
deep_loss_weight = 5.0
pixel_loss_weight = 1.0
random_search_steps = 30
gradient_descent_steps = 400
learning_rate = .1
inverted_img_dir = "inverted/images"
inverted_seed_dir = "inverted/seeds"
image_dir = "test_images"

os.makedirs(inverted_img_dir, exist_ok=True)
os.makedirs(inverted_seed_dir, exist_ok=True)

names = [run_prefix,
         "dl", deep_loss_weight,
         "pl", pixel_loss_weight,
         "rl", reg_loss_weight,
         "lr", learning_rate]
run_name = "_".join([str(name) for name in names])


def getNode(name):
    return tf.get_default_graph().get_tensor_by_name(name)


def toNetworkSpace(img):
    img = np.array(img.resize((resolution, resolution), PIL.Image.ANTIALIAS))  # .transpose(2, 0, 1)
    return (img - (255.0 / 2.0)) / 255.0


def fromNetworkSpace(img):
    img2 = np.clip(np.rint((img + 1.0) / 2.0 * 255.0), 0.0, 255.0).astype(np.uint8)
    return img2


# Initialize TensorFlow session.
with tf.Graph().as_default() as g_1:
    with tf.Session(graph=g_1) as sess:

        latent_node_variable = tf.Variable(
            initial_value=np.random.randn(batch_size, latent_size),
            expected_shape=(batch_size, latent_size),
            dtype=tf.float32)

        latent_node_variable_clipped = tf.clip_by_value(
            latent_node_variable,
            clip_value_min=-2.0,
            clip_value_max=2.0)

        label_node_logits = tf.Variable(
            initial_value=np.random.randn(batch_size, label_size),
            expected_shape=(batch_size, label_size),
            dtype=tf.float32)

        label_dist = tf.nn.softmax(label_node_logits)

        scope = "foo"
        saver1 = tf.train.import_meta_graph(
            'checkpoints/generator_test_biggan_1.meta',
            input_map={"z:0": latent_node_variable_clipped, "y:0": label_dist},
            import_scope=scope)
        saver1.restore(sess, 'checkpoints/generator_test_biggan_1.ckpt')


        pixel_loss_node = getNode(scope + "/loss:0")
        deep_loss_node = getNode(scope + "/deep_loss:0")
        deep_target_logits_node = getNode(scope + "/deep_target_logits:0")

        reg_loss_node = tf.norm(latent_node_variable)

        total_loss = pixel_loss_weight * pixel_loss_node + \
                     deep_loss_weight * deep_loss_node + \
                     reg_loss_weight * reg_loss_node

        target_node = getNode(scope + "/target:0")
        output_node = getNode(scope + "/output:0")
        truncation_node = getNode(scope + "/truncation:0")

        opt = tf.train.RMSPropOptimizer(learning_rate=learning_rate)
        train = opt.minimize(total_loss, var_list=[latent_node_variable, label_node_logits])
        tf.summary.image("output", output_node)

        merged = tf.summary.merge_all()
        writer = tf.summary.FileWriter(os.path.join("summaries", run_name))


        def inversion(image_list):

            assert (len(image_list) == batch_size)

            sess.run([latent_node_variable.initializer, label_node_logits.initializer,
                      tf.variables_initializer(opt.variables())])

            target_imgs = np.array(
                [toNetworkSpace(PIL.Image.open(image_file).convert("RGB")) for image_file in image_list])

            best_loss = np.inf
            best_latents = None
            [initial_logits] = sess.run([deep_target_logits_node], {target_node: target_imgs})

            sess.run([tf.assign(label_node_logits, initial_logits)])
            for i in range(random_search_steps):
                latents = np.random.randn(batch_size, latent_size)
                sess.run([tf.assign(latent_node_variable, latents)])
                [loss] = sess.run([total_loss], {target_node: target_imgs, truncation_node: 1.0})
                if loss < best_loss:
                    print(i, loss)
                    best_latents = latents
                    best_loss = loss
            sess.run([tf.assign(latent_node_variable, best_latents)])

            print("Starting gradient descent")
            for i in range(gradient_descent_steps):
                [_] = sess.run([train], {target_node: target_imgs, truncation_node: 1.0})
                if i % 10 == 0:
                    [_, total_loss_val, reg_loss_val, pixel_loss_val, deep_loss_val] = sess.run(
                        [train, total_loss, reg_loss_node, pixel_loss_node, deep_loss_node],
                        {target_node: target_imgs, truncation_node: 1.0})

                    print(i, total_loss_val, pixel_loss_val, deep_loss_val, reg_loss_val)

            # Write out the final images / seeds with appropriate names
            [output_images, latents, labels] = sess.run([output_node, latent_node_variable, label_dist],
                                                        {target_node: target_imgs, truncation_node: 1.0})
            for j in range(len(labels)):
                PIL.Image.fromarray(fromNetworkSpace(output_images[j]), 'RGB').save(os.path.join(
                    inverted_img_dir,
                    "{}.png".format(os.path.basename(image_list[j]).split(".")[0])
                ))

                latent_file = os.path.join(
                    inverted_seed_dir,
                    "{}.json".format(os.path.basename(image_list[j]).split(".")[0])
                )
                with open(latent_file, "w+") as f:
                    json.dump({"latents": latents[j].tolist(), "labels": labels[j].tolist()}, f)

            print("batch done")


        def chunks(l, n):
            """Yield successive n-sized chunks from l."""
            for i in range(0, len(l), n):
                yield l[i:i + n]


        image_files = [os.path.join(image_dir, name) for name in os.listdir(image_dir)]
        image_files = [f for f in image_files if
                       not os.path.exists(os.path.join(inverted_img_dir, os.path.basename(f)))]
        for batch in chunks(image_files, batch_size):
            try:
                inversion(batch)
            except Exception as e:
                print("Error:")
                print(e.message)
                print(e)
