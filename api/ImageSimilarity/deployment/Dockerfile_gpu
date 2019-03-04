# Use an official Python runtime as a parent image
#FROM python:3.6.4
FROM tensorflow/tensorflow:1.10.1-gpu-py3


# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# update
RUN pip install --upgrade pip

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements_gpu.txt

# Make port 80 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV NAME ImageSimilarity

# Run app.py when the container launches
CMD ["python", "app.py", "-t","./targets.pkl","-a","./annoyIndex2.ann"]
