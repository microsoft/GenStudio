
![Main Image](https://deepartstorage.blob.core.windows.net/public/assets/gen_studio.gif)

[website]:https://ms-genstudio-dev.azurewebsites.net/

# Gen Studio

[Gen Studio](#website) is a prototype created by collaborators from The Metropolitan Museum of Art (The Met), Microsoft, and Massachusetts Institute of Technology (MIT). This site allows users to visually explore Generative Adversarial Networks (GANs) for high resolution art creation. 

Try it for yourself and create your own unique nerual artworks [here!](#website)

You can also learn more about [the collaboration](https://www.microsoft.com/inculture/arts/met-microsoft-mit-ai-open-access-hack/) and [The Met’s Open Access Program](https://www.metmuseum.org/blogs/now-at-the-met/2019/met-microsoft-mit-art-open-data-artificial-intelligence). 

# Goal of the Project

We created an online experience called Gen Studio where users can explore generated, dreamlike images created by AI. These images are created using a Generated Adversarial Network (GAN), which can randomly sample from the space of possible artworks. We then take this trained GAN and invert it to create an algorithm capable of finding the closest match, in the GANs ‘mind’, to the real artwork in The Met. This allows us to not just create random works, but to interpolate between real artworks in the collection. 

# The Website

We present two simple ways of exploring the GANs underlying 140-dimensional space of art. Our first visualization lets users explore a two-dimensional slice of the vast “latent” space of the GAN. Users can move throughout this space and see how the GANs generated images change based on proximity to real images The Met’s collection. Our second visualization gives the user precise control of how to blend different works together into a larger work. We hope that users can use this to learn more about the inferred visual structure underlying The Met’s collection, and to create and recombine artwork that draw from a variety of styles, materials, and forms. 

Once you have found an inspiring piece you can explore related works and topics through an immersive visual search experience. To create this experience, we used a microservice architecture of deep networks, Azure services, and blob storage. We used Visual Studio Code to develop a Flask API to serve the GAN from an Azure Kubernetes Service (AKS) cluster powered by Nvidia GPUs. 

# Deep Learning Techniques

### Generative Adversarial Networks

Generative Adversarial Networks (GANs) are a special kind of deep network capable of modeling the distribution of a variety of types of data. What this means is that GANs can learn to "sample" or "create" new data that looks like an existing dataset.

In our case we use a GAN to sample from the space of art in The Metropolitan Museum of Art's Open Access Collection.

![GAN](https://deepartstorage.blob.core.windows.net/public/assets/gan-architecture.jpg)

GANs consist of two components: A Generator and a Descriminator. The generator aims to create new art, and the descriminator aims to critique the art and discover ways to tell generated art from existing art. Both networks are trained in competition until the generator can create realistic works of art, and the descriminator can no longer tell the difference. 

![Training](https://deepartstorage.blob.core.windows.net/public/assets/training.gif)


### GAN Inversion with Semantic Loss

![semantic-inversion](https://deepartstorage.blob.core.windows.net/public/assets/semantic-inversion.jpg)

GANs are great at generating new works of art, but we wanted to see if the GAN could recreate existing works in The MET's collection. To achieve this, we used a technique called neural network inversion. Instead of learning the weights of a generator network, we keep those weights constant and instead learn the noise pattern in order to mazimize the similarity between the GAN output and a target work. We discovered that in order for this approach to be successful, one would need to match both the target image's pixels as well as its "high-level" semantic content.

![inversion](https://deepartstorage.blob.core.windows.net/public/assets/inversion.gif)



### GAN Latent Space Traversal

### Reverse Image Search




# Architecture

![architecture](https://deepartstorage.blob.core.windows.net/public/assets/architecture.svg)


### Frontend:
* React App hosted on Azure App Services

The frontend serves as the portal to the backend services. The website is built using react for the layout and styling, and plotly for the map exploration UX. The content is hosted as an azure web-app. 

### Backend:
* GPU enabled Azure Kubernetes Service
    - Reverse Image Search Service
    - GAN Evaluation Service
* Cloud Storage
    - Thumbnail Service
    - GAN Inversion Service
* Azure Search
* Azure API Management (for SSL Certs)

These services make it possible to generate new images in real-time, and are responsible for the website’s interactive look and feel. Azure Kubernetes Service (AKS) dramatically streamlines the path to production services on GPU hardware. The AKS cluster provides backend GPU compute for the GAN evaluation service, and the reverse image search service.

A core challenge we encountered was how to explore around the latent space of existing MET artworks. The network inversion technique mentioned in THEORY SECTION REFERENCE is time intensive. To make this responsive, we precomputed inversions to thousands of images from the met collection and stored the results in Azure Storage. Thus, we could treat them as fast static assets.

To create the image search experience, we loaded the entire open access collection into an Azure Databricks cluster. We used Microsoft Machine Learning for Apache Spark (MMLSpark) to enrich these images with annotations from the Azure Computer Vision API. We then pushed these enriched docuemtns to the Azure Search Service.

### Development:
* GPU machine recommended (such as a Data Science Virtual Machine)
* Azure Databricks Cluster with [MMLSpark](www.aka.ms/spark) for pushing data into Azure Search

To invert the GAN and train the nearest neighbor models we used a GPU Azure Data Science Virtual Machine. To enrich The Met images with computer vision annotations, we used an Apache Spark cluster backed by Azure Databricks with MMLSpark installed. We used the Azure Search writer for Spark to push the enriched images into Azure Search. 


# Get started




## Build the website
Follow these steps to build the website. Note that many of the APIs are referenced within the site code and will need to be changed if you are deploying a full version of the site.

1. In a command prompt or terminal, navigate to `website/deep-art`
2. Install the necessary npm packages

    ```javascript
        npm install
    ```
3. Build the site

    ```javascript
        npm run build
    ```
## Build the Image Similarity Model
Follow these steps to build your own image similarity model. Note these steps assume you have the images you plan to use in the model stored in an Azure Blob Storage. We also assume familiarity with Jupyter Notebooks
1. Navigate to `api/ImageSimilarity/Model`
2. The first step, featurizes all of your training images. This step transforms each image into a single numerical vector. For this project we used the images available on The [MET's Open Access API](https://metmuseum.github.io/). 
    - Start Jupyter Notebooks and open the `Featurize Images` notebook. (You may need to pip install some of the pyhton packages)
    - Under the **Define Constants** cell, define the url and file paths to the images you will use for the model & where you want the table containing the featurized version of the images saved.
    - Run the remaining cells
    - Shutdown and close the `Featurize Images` notebook
7. The second step builds a nearest neighbors model using the vector form of each image. For any new image, we will look to find the image whose vector is closest. 
    - Open the `Build Nearest Neighbors`  notebook
    - Under the **Define Constants** cell, define the file path where the annoy model will be saved & path to the featurized images.
    - Run the remaining cells. 

You have now built your nearest neighbors model!

## Build the Image Similarity API container
Follow these steps to create a gpu enabled docker container for an image similarity search API. The API calls are defined in `api/ImageSimilarity/deployment/app.py`
1. Navigate to `api/ImageSimilarity/deployment`
2. Copy your `targets.pkl` file and Annoy Index (`annoyIndex2.ann`) which were created in the prior step into the folder
3. If you changed the name for either of these files, you will need to update line 25 of `Dockerfile_gpu`
4. Run the following command to build the docker container

    ```bash
    docker build -t <tagname> -f Dockerfile_gpu

    ```
5. To test your API start the docker on port 5000. You can now call this API at `localhost:5000`

    ```bash
    nvidia-docker run -p 5000:5000 imagesimilaritymodel 
    ```

6. Tag and publish your container
    ```bash
    docker tag <container name> <dockerhub username>/<container name>
    docker push  <dockerhub username>/<container name>
    ```
    
## Build the BigGAN API container
Follow these steps to build your own API which generates images from proGAN.
1. Navigate to `api/BigGAN/deployment`
2. Repeat steps 4-6 from **Build the Image Similarity API container** but update the container name

## Build the ProGAN API container
Follow these steps to build your own API which generates images from proGAN.
1. Navigate to `api/ProGAN/deployment`
2. Repeat steps 4-6 from **Build the Image Similarity API container** but update the container name

## Deploy your APIs to an Azure Kubernetes Cluster


# Contributors
Special thanks to the entire Gen Studio team including: 

- [Mark Hamilton](https://mhamilton.net) – Software Engineer, Microsoft Applied AI – lead 
- Chris Hoder – AI Project Manager, Microsoft Applied AI – lead 
- Matthew Ritchie – Dasha Zhukova Distinguished Visiting Artist at the MIT Center for Art, Science & Technology, MIT – lead 
- Sarah Schwettmann, Brain + Cognitive Sciences, Knowledge Futures Group, MIT- lead 
- Kim Benzel, Curator in Charge, Department of Ancient Near Eastern Art, The Met Julie Arslanoglu, Research Scientist, Department of Scientific Research, The Met 
- Casey Hong, Software Engineer, Microsoft AI Rotation Program 
- Dalitso Banda, Software Engineer, Microsoft AI Rotation Program 
- Manon Knoertzer, Program Manager, Microsoft AI Rotation Program 
- Karthik Rajendran, Data Scientist, Microsoft AI Rotation Program 
- Botong Ma, Graduate Student, Electrical Engineering and Computer Science, MIT 
- Alonso Salas Infante, MIT Student Extern with Microsoft Garage 
- Gillian Belto, MIT Student Extern with Microsoft Garage 
- Darius Bopp, MIT Student Extern with Microsoft Garage 
- Diana Nguyen, MIT Student Extern with Microsoft Garage 
- Elaine Zhang, MIT Student Extern with Microsoft Garage 
- SJ Klein, Underlayer, Knowledge Futures Group, MIT 
- Luke Hewitt, Graduate Student, Brain and Cognitive Sciences, MIT 
- Maddie Cusimano, Graduate Student, Brain and Cognitive Sciences, MIT 
- Wilson Lee, Senior Software Engineer, Microsoft 

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Legal Notices

Microsoft and any contributors grant you a license to the Microsoft documentation and other content
in this repository under the [Creative Commons Attribution 4.0 International Public License](https://creativecommons.org/licenses/by/4.0/legalcode),
see the [LICENSE](LICENSE) file, and grant you a license to any code in the repository under the [MIT License](https://opensource.org/licenses/MIT), see the
[LICENSE-CODE](LICENSE-CODE) file.

Microsoft, Windows, Microsoft Azure and/or other Microsoft products and services referenced in the documentation
may be either trademarks or registered trademarks of Microsoft in the United States and/or other countries.
The licenses for this project do not grant you rights to use any Microsoft names, logos, or trademarks.
Microsoft's general trademark guidelines can be found at http://go.microsoft.com/fwlink/?LinkID=254653.

Privacy information can be found at https://privacy.microsoft.com/en-us/

Microsoft and any contributors reserve all others rights, whether under their respective copyrights, patents,
or trademarks, whether by implication, estoppel or otherwise.
