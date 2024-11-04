# PeerPrep Backend

## Project Overview
The history service aims to keep a record of the questions attempted by every user e.g., maintain a list of questions attempted along with the date-time of attempt, and the attempt itself.

## Prerequisites
- Docker: Ensure Docker is installed on your machine. [Download Docker](https://www.docker.com/products/docker-desktop)

## Getting the history service backend server up and running

1. **Copy & paste the firebaseCredentials.json file into the `/config` folder**

2. **Build the Docker Image** 

   Navigate to the backend directory and build the Docker image:

   ```sh
   cd backend/history_service
   docker build -t peerprep-history-service-backend .
   ```

3. **Create and Run the Docker Container**
   
   ```sh
   docker run -d -p 5005:5005 --name peerprep-history-service-backend-app peerprep-history-service-backend
   ```

4. **You can find the server started at localhost:5005**
