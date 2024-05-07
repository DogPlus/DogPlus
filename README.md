# DogPlus
The Dog+ project

## Description

This project is a full-stack web application built with Django and React. It consists of a Django backend providing a REST API and a React frontend for the user interface.

## Features

- **Django Backend:**
  - Utilizes Django framework for building the backend.
  - Provides a REST API for interacting with the application data.
  
- **React Frontend:**
  - Built with React framework for dynamic user interface.
  - Communicates with the backend API to fetch and display data.
  
- **Docker Compose Setup:**
  - Includes a Docker Compose file for easy deployment and development.
  - Sets up containers for Django backend, React frontend, and PostgreSQL database.

## Local development 

1. Clone the repository:
   ```bash
   git clone git@github.com:VegSja/DogPlus.git
   ```

2. Navigate into the project:
    ```bash
    cd DogPlus
    ```
3. Start the docker containers:
    ```bash
    docker compose up -d
    ```
4. Access the application:
- Backend API: http://localhost:8000
- Frontend UI: http://localhost:3000

### Interacting with database - Using pgadmin
In the docker compose file we have a pgadmin container. After running:
```bash
docker compose up -d
```
Follow these steps to get acces to the database:

1. You can access this interface at the following link http://localhost:8888.
2. Click the "Servers" dropdown to the left
3. Here you should see an entry "DogPlus Local Server" - Click this
4. Enter the password "plus"

This should connect you to the local database




### Interacting with docker
Since docker is a containerized environment, to interact with docker you need to run commands inside the given docker container.

This can be done like this:
```sh
docker compose exec <Name of container> <command to run>
```

To find the name of the container look into `docker-compose.yml`. The names of the containers at the time of writing is:
- db
- backend
- frontend

Command to run can be whatever. For instance to drop into a shell in the container backend run:
```sh
docker compose exec backend sh
```
### Prerequisites
- Docker
- Docker Compose   

## Pushing changes to the cloud
Be sure to be in the root of the project. This is the directory which contains the `docker-compose.yml` file. 

### Before starting - Do this once
Before starting it is necesarry to make sure that you have the correct programs installed.
#### Install google cloud CLI tools
Follow [this link](https://cloud.google.com/sdk/docs/install) and follow the instructions to install the google cloud CLI on your system.

#### Install docker
Follow [this link](https://docs.docker.com/engine/install/) and follow the instructions to install docker for your system.

## How to push the changes to google cloud
To make this process simpler, a script named `push_to_cloud.sh` has been created. After cloning the project this script might not be runnable. To make it runnable run this command:
```sh
sudo chmod +x push_to_cloud.sh
```

After doing this you should be able to run the script:
```sh
./push_to_cloud.sh
```

This script will first ask you to login to google by opening a browser window. Login to the user you have which is connected to the `dogplus_polimi` project on google cloud. After doing this the script builds the docker images for the backend and pushes this to the cloud. It then does the same for the frontend

## IMPORTANT:
After running the script successfully, the frontend part of the application is not yet correctly published. To finish the process, follow these steps:
1. Go to [the cloud run dashboard](https://console.cloud.google.com/run?project=dog-plus-polimi)
2. Click 'Edit and deply new reviosion'.
3. Edit the 'Container Image URL' with the container you just created:
- Click "Select" under "Container Image URL"
![bilde](https://github.com/DogPlus/DogPlus/assets/40039543/0109866b-7f6f-424d-8f6e-bcf81869cfe1)
- Under 'Artifact Registry' -> 'europe-west8-docker.pkg.dev/dog-plus-polimi/dogplus-frontend-repository' -> 'dogplus-react-app', select the image with the tag 'latest'
![bilde](https://github.com/DogPlus/DogPlus/assets/40039543/f5fabd67-b531-4487-98a0-9423fad18637)
- Click "Select".

4. Click 'Deploy'
5. In a couple of seconds a URL will appear which you can follow to see the webpage.

## The cold start problem
Since we are in prototype stages, to save resources the cloud will not allocate any resources to us unless we use the application. Hence the first time you launch the app it will be really slow, but it will be better on subsequnet calls.

## Acknowledgements
Special thanks to OpenAI for providing the ChatGPT model used to generate this README.

