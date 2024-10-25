![GitHub Release](https://img.shields.io/github/v/release/weemeal/weemeal-frontend-react)

# Weemeal

This is a React application that serves as a digital cookbook and connects with a [Spring Boot backend](https://github.com/weemeal/weemeal-backend-spring). This guide will help you set up and run the application locally.
![Bildschirmfoto 2024-10-25 um 22 32 21](https://github.com/user-attachments/assets/2d6eb12a-c5f8-4816-bbbc-616827c04eb5)
![Bildschirmfoto 2024-10-25 um 22 32 40](https://github.com/user-attachments/assets/030580b8-d05f-49bc-b745-5f810a1d92d6)
![Bildschirmfoto 2024-10-25 um 22 32 50](https://github.com/user-attachments/assets/c13eee11-45bc-4c02-bf11-567b43841a37)

## Requirements

- Node.js (version 14.x or higher)
- Docker and Docker Compose

## Installation

1. **Create a .env file**

In the root directory of the project, create a `.env` file with the following content:

```bash
REACT_APP_VERSION=v0.0.0                        //The version of your application.
REACT_APP_API_BASE_URL="http://localhost:8081"  //The URL where your backend is running (e.g., http://localhost:8081).
```
2. Install dependencies
Install the necessary Node.js dependencies:
```bash
npm install
```

## Docker Setup
The application uses Docker Compose to start the PostgreSQL database and the backend. The docker-compose.yml file is located in the root directory of the project.
Docker Images can be found on [Docker Hub](https://hub.docker.com/repository/docker/darthkali/weemeal-frontend-react/general). 
1. Start Docker Compose

  Use the following command to start the Docker containers in the background:  
  
  ```bash
  docker-compose up -d
  ```
  This starts the following services:
  - `PostgreSQL Database`: Runs on port 5432.
  - `Spring Boot Backend`: Runs on port 8081. (replace the image in the docker-compose with ypur own backend, if you want)
  For more details about the services, check the docker-compose.yml file.

2. Start the Frontend
  In a separate terminal, you can start the frontend:
  
  ```bash
  npm start
  ```
  This will start the React frontend on http://localhost:3000.


## Forking and Docker Hub Integration
If you want to fork this project, you need to modify the publish.yml and release.yml workflows:

1. Update the GitHub Actions workflows:
  In the .github/workflows/publish.yml and .github/workflows/release.yml files, make sure to update the following:
  - `IMAGE_NAME`: The name of your Docker image.
  - docker hub path: The path to your Docker Hub repository.
  
2. Set up GitHub Secrets:
  In your forked repository, you will need to add the following GitHub Secrets:
  - `DOCKER_HUB_USER`: Your Docker Hub username.
  - `DOCKER_HUB_PASS`: Your Docker Hub password.
  - `RELEASE_TOKEN`: A GitHub token that can be created in your GitHub profile under "Settings" > "Developer Settings" > "Personal Access Tokens".
  These secrets are required for automatically pushing Docker images to your Docker Hub repository and for creating new releases.
