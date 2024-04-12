"""
Django settings for django_backend project.

Generated by 'django-admin startproject' using Django 5.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
import environ
import os
import io
from urllib.parse import urlparse
import google.auth
from google.cloud import secretmanager


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

##### See https://cloud.google.com/python/django/run#understanding-secrets
# SECURITY WARNING: don't run with debug turned on in production!
env = environ.Env(DEBUG=(bool, True))
env_file = os.path.join(BASE_DIR, ".env")
DEBUG = True

# Attempt to load the Project ID into the environment, safely failing on error.
try:
    _, os.environ["GOOGLE_CLOUD_PROJECT"] = google.auth.default()
except google.auth.exceptions.DefaultCredentialsError:
    pass

if os.path.isfile(env_file):
    # Use a local secret file, if provided

    print("Loading .env file")
    env.read_env(env_file)
    # Get all loaded environment variables
# ...
elif os.environ.get("GOOGLE_CLOUD_PROJECT", None):
    # Pull secrets from Secret Manager
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")

    print("Loading secrets from google cloud")
    client = secretmanager.SecretManagerServiceClient()
    settings_name = os.environ.get("SETTINGS_NAME", "django_settings-f21e")
    name = f"projects/{project_id}/secrets/{settings_name}/versions/latest"
    payload = client.access_secret_version(name=name).payload.data.decode("UTF-8")

    env.read_env(io.StringIO(payload))
else:
    raise Exception("No local .env or GOOGLE_CLOUD_PROJECT detected. No secrets found. If running on local computer (using docker compose), ensure you have the .env file in backend/django_backend/ folder. This can be found in secret manager in google cloud with name 'django_settings-f21e'." )

SECRET_KEY = os.environ.get("SECRET_KEY")

##### See https://cloud.google.com/python/django/run#csrf_configurations
# SECURITY WARNING: It's recommended that you use this when
# running in production. The URL will be known once you first deploy
# to Cloud Run. This code takes the URL and converts it to both these settings formats.
CLOUDRUN_SERVICE_URL = env("CLOUDRUN_SERVICE_URL", default=None)
CLOUDRUN_API_URL = env("CLOUDRUN_API_URL", default=None)
if CLOUDRUN_SERVICE_URL and CLOUDRUN_API_URL:
    print("Using CLOUDRUN allowed hosts")
    CSRF_TRUSTED_ORIGINS = [CLOUDRUN_SERVICE_URL]
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    CORS_ALLOWED_ORIGINS = [CLOUDRUN_SERVICE_URL]
    ALLOWED_HOSTS = [urlparse(CLOUDRUN_API_URL).netloc]
else:
    print("Using default allowed hosts (all hosts allowed)")
    CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
    CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]
    ALLOWED_HOSTS = ["*"]
# [END cloudrun_django_csrf]


# Application definition

INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'authentication',
    'feed'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'django_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'django_backend.wsgi.application'

## See https://cloud.google.com/python/django/run#database_connection
# Database
# [START cloudrun_django_database_config]
# Use django-environ to parse the connection string
if (os.getenv("USE_LOCAL_DATABASE", None)):
    print("Using local database")
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'dogplus_db',          # PostgreSQL database name
            'USER': 'dog',                 # PostgreSQL username
            'PASSWORD': 'plus',            # PostgreSQL password
            'HOST': 'db',                  # This should match the service name defined in Docker Compose
            'PORT': '5432',                # PostgreSQL port (default is 5432)
        }
    }
else:
    print("Using remote database")
    DATABASES = {"default": env.db()}

    # If the flag as been set, configure to use proxy
    if os.getenv("USE_CLOUD_SQL_AUTH_PROXY", None):
        DATABASES["default"]["HOST"] = "127.0.0.1"
        DATABASES["default"]["PORT"] = 5432

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}




# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Point AUTH_USER_MODEL to your custom model
AUTH_USER_MODEL = 'authentication.CustomUser'

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/
#### See https://cloud.google.com/python/django/run#cloud-stored_static
# Define static storage via django-storages[google]
GS_BUCKET_NAME = env("GS_BUCKET_NAME")
STATIC_URL = "/static/"
DEFAULT_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
STATICFILES_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
GS_DEFAULT_ACL = "publicRead"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
