# PeerPrep User Service Backend

## Project Overview
The PeerPrep user service backend provides a service for authenticating user to access backend services.

## Prerequisites
- Docker: Ensure Docker is installed on your machine. [Download Docker](https://www.docker.com/products/docker-desktop)

## Getting the user service backend server up and running

1. **Copy & paste the firebaseCredentials.json file into the `/config` folder**

2. **Build the Docker Image** 

   Navigate to the backend directory and build the Docker image:

   ```sh
   cd backend/user_service/
   docker build -t peerprep-user-service-backend .
   ```

3. **Create and Run the Docker Container**
   
   ```sh
   docker run -d -p 5001:5001 --name peerprep-user-service-backend-app peerprep-user-service-backend
   ```

4. **You can find the server started at localhost:5001**
