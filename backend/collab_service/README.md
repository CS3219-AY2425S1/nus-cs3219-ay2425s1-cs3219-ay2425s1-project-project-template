# PeerPrep Backend

## Project Overview
The PeerPrep backend provides services for managing and querying questions used for technical interview practice. It supports creating, retrieving, and deleting questions. The matching and collaboration services are provided to match users to attempt the questions together.

## Prerequisites
- Docker: Ensure Docker is installed on your machine. [Download Docker](https://www.docker.com/products/docker-desktop)

## Getting the collaboration service backend server up and running

1. **Copy & paste the firebaseCredentials.json file into the `/config` folder**

2. **Build the Docker Image** 

   Navigate to the backend directory and build the Docker image:

   ```sh
   cd backend/collab_service
   docker build -t peerprep-collab-service-backend .
   ```

3. **Create and Run the Docker Container**
   
   ```sh
   docker run -d -p 5004:5004 --name peerprep-collab-service-backend-app peerprep-collab-service-backend
   ```

4. **You can find the server started at localhost:5004**

## Trying out the collaboration service
*to be filled in after linking with matching service
