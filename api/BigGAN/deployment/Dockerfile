FROM tensorflow/tensorflow:1.12.0-gpu-py3

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

ENV PYTHONPATH "${PYTHONPATH}:/app"

EXPOSE 8081
CMD [ "python", "app.py" ]