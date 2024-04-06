#!/bin/bash

PROJECT_PATH=$(pwd)

echo "Running Login"
gcloud auth login > deploy.log && 

echo "Setting project" &&
gcloud config set project dog-plus-polimi > deploy.log &&
cd $PROJECT_PATH/backend/django_backend > deploy.log &&
echo "Deploying backend to Google Cloud Build.." &&
gcloud builds submit --config cloudmigrate.yaml > deploy.log &&


echo "Deploying the backend service to Google Cloud Run.." &&
gcloud run deploy api-service \
    --platform managed \
    --region europe-west12 \
    --image gcr.io/dog-plus-polimi/api-service > deploy.log &&

echo "Backend deployed successfully." &&


echo "Deploying frontend to Google Cloud Run.." &&

echo "Going into the frontend directory" &&
cd $PROJECT_PATH/frontend/dogplus-frontend > deploy.log &&
echo "Building the frontend image" &&
docker build -t dogplus-frontend . > deploy.log &&
echo "Submitting the image to Google Cloud" &&
gcloud builds submit -t europe-west8-docker.pkg.dev/dog-plus-polimi/dogplus-frontend-repository/dogplus-react-app ./ > deploy.log &&

echo "Frontend deployed successfully. Please go to https://console.cloud.google.com/run?project=dog-plus-polimi and go into 'dogplus-frotnend-react-app'. Click 'Edit and deploy new revision'. In here edit the 'Container Image URL' with the container you just created. Then click create. In a couple of seconds you should get an URL which you can follow to see the webpage."
