FROM python:2.7-slim

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

ENV PYTHONPATH "${PYTHONPATH}:/app"

EXPOSE 8081
CMD [ "python", "app.py" ]