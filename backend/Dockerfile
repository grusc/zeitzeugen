FROM python:3.10


WORKDIR /code


COPY ./requirements.txt /code/requirements.txt


RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt


COPY ./app.py /code/app.py


CMD ["fastapi", "run", "app.py", "--port", "42069"]
