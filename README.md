# DogPlus
The Dog+ project

# Project Name

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

## Getting Started

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

## Prerequisites
- Docker
- Docker Compose   


## Acknowledgements
Special thanks to OpenAI for providing the ChatGPT model used to generate this README.

