[website]:https://ms-genstudio-dev.azurewebsites.net/

# Gen Studio

<p align="center">
  <a href="https://ms-genstudio-dev.azurewebsites.net/">
    <img width="512" src="https://deepartstorage.blob.core.windows.net/public/assets/gen_studio.gif">
  </a>
</p>

[Gen Studio](#website) is a prototype created by collaborators from The Metropolitan Museum of Art (The Met), Microsoft, and Massachusetts Institute of Technology (MIT). This site allows users to visually explore Generative Adversarial Networks (GANs) for high resolution art creation. 

Try it for yourself and create your own unique neural artworks [here!](#website)

You can also learn more about [the collaboration](https://www.microsoft.com/inculture/arts/met-microsoft-mit-ai-open-access-hack/) and [The Met’s Open Access Program](https://www.metmuseum.org/blogs/now-at-the-met/2019/met-microsoft-mit-art-open-data-artificial-intelligence). 

# Goal of the Project

Our goal is to inspire others to explore the world of art and the world of AI. We hope that publishing this website will help anyone with an internet connection discover or create works of art they love. Art captures humanity's intricate structure, from great struggles, and triumphs to the beautifully commonplace. We hope that by using the GAN as a tool, you too can feel the rush of creation that has driven so many great artists and creators throughout the ages. This project was prototyped by a passionate group during a two day hackathon and brought to life by some amazing students and engineers. Thank you for trying our website and please feel free to [send us feedback](mailto:marhamil@microsoft.com).

# The Website

We created an online experience called Gen Studio where users can explore generated, dreamlike images created by AI. These images are created using a GAN, which can randomly sample from the space of possible artworks. We then take this trained GAN and invert it to create an algorithm capable of finding the closest match, in the GANs ‘mind’, to the real artwork in The Met. This allows us to not just create random works, but to interpolate between real artworks in the collection. 

We present two simple ways of exploring the GANs underlying 140-dimensional space of art. Our first visualization lets users explore a two-dimensional slice of the vast “latent” space of the GAN. Users can move throughout this space and see how the GANs generated images change based on proximity to real images in The Met’s collection. Our second visualization gives the user precise control of how to blend different works together. We hope that users use this site to learn more about the inferred visual structure underlying The Met’s collection and to create and recombine artwork that draws from a variety of styles, materials, and forms. 

Once you have found an inspiring piece you can explore related works through an immersive visual search experience. To create this experience, we used a microservice architecture of deep networks, Azure services, and blob storage. We used Visual Studio Code to develop a Flask API to serve the GAN from an Azure Kubernetes Service (AKS) cluster powered by Nvidia GPUs. 

# Deep Learning Techniques

### Generative Adversarial Networks (GANs)

GANs are a special kind of deep network capable of modeling the distribution of a variety of types of data. What this means is that GANs can learn to "sample" or "create" new data that looks like an existing dataset.

In our case we use a GAN to sample from the space of art in [The Metropolitan Museum of Art's Open Access Collection](https://www.metmuseum.org/about-the-met/policies-and-documents/open-access).

<p align="center">
  <img width="512" src="https://deepartstorage.blob.core.windows.net/public/assets/gan-architecture.jpg">
</p>

GANs consist of two components: A Generator and a Discriminator. The generator aims to create new art, and the discriminator aims to critique the art and discover ways to tell generated art from existing art. Both networks are trained in competition until the generator can create realistic works of art, and the discriminator can no longer tell the difference. 

<p align="center">
  <img width="512" src="https://deepartstorage.blob.core.windows.net/public/assets/training.gif">
</p>



### GAN Inversion with Semantic Loss


<p align="center">
  <img width="512" src="https://deepartstorage.blob.core.windows.net/public/assets/semantic-inversion.jpg">
</p>

GANs are great at generating new works of art, but we wanted to see if the GAN could recreate existing works in The MET's collection. To achieve this, we used a technique called neural network inversion. Instead of learning the weights of a generator network, we keep those weights constant and instead learn the noise pattern  to maximize the similarity between the GAN output and a target work. We discovered that one needs to match both the target image's pixels as well as its "high-level" semantic content to be successful.

<p align="center">
  <img width="512" src="https://deepartstorage.blob.core.windows.net/public/assets/inversion.gif">
</p>


### GAN Latent Space Traversal

<p align="center">
  <img width="512" src="https://deepartstorage.blob.core.windows.net/public/assets/code-space-interp.jpg">
</p>

To explore the spaces between objects in our GAN we first invert the objects to get their positions in "latent" space. This latent space is learned by the network, and each point in it corresponds to a unique artwork when mapped through the generator network. To interpolate between the points we use plain-old vector interpolation, though depending on the noise you train your GAN with, you might get better performance by transforming to spherical coordinates before the interpolation (because of [the magic of high dimensional gaussians](https://www.cs.cmu.edu/~avrim/598/chap2only.pdf)). 


<p align="center">
  <img width="80%" src="https://deepartstorage.blob.core.windows.net/public/assets/interpolation.gif">
</p>

### Reverse Image Search

<p align="center">
  <img width="80%" src="https://deepartstorage.blob.core.windows.net/public/assets/nn-lookup.jpg">
</p>

To create a reverse image search engine, we first map the MET's images into a space where distance is more meaningful, aka the output of a truncated pretrained ResNet50 model. In this space, images that seem similar to us are close together and their positions are roughly invariant to small transformations like scaling, brightness, rotations etc. This is starkly opposed to pixel space, where imperceptibly small translations like scaling or rotating can completely change the distance between images. Once we have all of the Met's images featurized, we create an efficient Nearest Neighbor lookup tree frequently referred to as a [k-d tree](https://en.wikipedia.org/wiki/K-d_tree). This lets us lookup approximate nearest neighbors in feature space without comparing our vector to all other image features. At each node of this tree, we store the pointer to the MET image so that we can quickly return it to the caller. We use [the annoy library](https://github.com/spotify/annoy) for fast NN indexes. 

<p align="center">
  <img width="80%" src="https://deepartstorage.blob.core.windows.net/public/assets/nearest_neighbors.jpg">
</p>

# Architecture

<p align="center">
  <img width="100%" src="https://deepartstorage.blob.core.windows.net/public/assets/architecture.svg">
</p>


### Frontend:
The frontend serves as the portal to the backend services. The website is built using React for the layout and styling, and plotly for the map exploration UX. The content is hosted as an azure web-app using [Azure App Services](https://azure.microsoft.com/en-us/services/app-service/).  



### Backend:
The backend for the site uses the following services:
* [GPU enabled Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/)
    - Reverse Image Search Service
    - GAN Evaluation Service
* [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
    - Thumbnail Service
    - GAN Inversion Service
* [Azure Search](https://azure.microsoft.com/en-us/services/search/)
    - Immersive search experience
* [Azure API Management](https://azure.microsoft.com/en-us/services/api-management/)
    - For SSL Certs

These services make it possible to generate new images in real-time and are responsible for the website’s interactive look and feel. AKS dramatically streamlines the path to production services on GPU hardware. The AKS cluster provides backend GPU compute for the GAN evaluation service, and the reverse image search service.

A core challenge we encountered was how to explore around the latent space of existing MET artworks. The network inversion technique, described in the techniques section above, is time intensive. To make this responsive, we pre-computed inversions to thousands of images from the met collection and stored the results in Azure Storage. Thus, we could treat them as fast static assets.

To create the image search experience, we loaded the entire open access collection into an Azure Databricks cluster. We used Microsoft Machine Learning for Apache Spark (MMLSpark) to enrich these images with annotations from the Azure Computer Vision API. We then pushed these enriched documents to the Azure Search Service.

### Development:
To invert the GAN and train the nearest neighbor models we recommend you use a GPU machine. We used a [GPU Azure Data Science Virtual Machine](https://azure.microsoft.com/en-us/services/virtual-machines/data-science-virtual-machines/). 

To enrich The Met images with computer vision annotations, we used an Apache Spark cluster backed by Azure Databricks with [MMLSpark](www.aka.ms/spark). We used the Azure Search writer for Spark to push the enriched images into Azure Search. 


# Get started
The following docs walk through how to deploy and set up your own APIs and website:

1. [Build the website](./website/README.md)
1. [Deploy the APIs](./api/README.md)
1. [Build the Search Index](https://github.com/Azure/mmlspark/blob/master/notebooks/samples/AzureSearchIndex%20-%20Met%20Artworks.ipynb)


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
