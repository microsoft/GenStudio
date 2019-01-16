FROM tensorflow/tensorflow:1.10.1-gpu-py3

# Install git
RUN apt-get update \
    && apt-get install -y git \
    && apt-get install -y wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Download the repo and other files
RUN git clone https://github.com/tkarras/progressive_growing_of_gans.git

WORKDIR /app/progressive_growing_of_gans
RUN wget --no-check-certificate 'https://airotationstore.blob.core.windows.net/models/network-final-paintings.pkl?st=2019-01-10T17%3A52%3A14Z&se=2022-01-11T17%3A52%3A00Z&sp=rl&sv=2018-03-28&sr=b&sig=2lC4E3RMi2E0K5cWxAJdh98lfMg2bTbFImtbbszuurE%3D' -O network-final.pkl

RUN pip install -r requirements-pip.txt
RUN pip install flask redis flask-cors
ADD . .

ENV PYTHONPATH "${PYTHONPATH}:/app/progressive_growing_of_gans"
EXPOSE 8080
CMD [ "python", "app.py" ]