FROM python:3.9

WORKDIR /app/backend

COPY requirements.txt .
RUN pip install -r requirements.txt
RUN python manage.py migrate

COPY . .

EXPOSE 8000
