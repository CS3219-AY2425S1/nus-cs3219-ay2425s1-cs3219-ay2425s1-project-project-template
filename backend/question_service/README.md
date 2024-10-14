# PeerPrep Question Service Backend

## Project Overview
The PeerPrep question service backend provides a service for managing and querying questions used for technical interview practice. It supports creating, retrieving, and deleting questions.

## Prerequisites
- Docker: Ensure Docker is installed on your machine. [Download Docker](https://www.docker.com/products/docker-desktop)

## Getting the question service backend server up and running

1. **Copy & paste the firebaseCredentials.json file into the `/config` folder**

2. **Build the Docker Image** 

   Navigate to the backend directory and build the Docker image:

   ```sh
   cd backend/question_service/
   docker build -t peerprep-question-service-backend .
   ```

3. **Create and Run the Docker Container**
   
   ```sh
   docker run -d -p 5002:5002 --name peerprep-question-service-backend-app peerprep-question-service-backend
   ```

4. **You can find the server started at localhost:5002**

## Trying out the question service

1. **Ensure you are authenticated**
   You can do so by providing a valid token.
   For example, on postman, go to Auth, select Bearer Token as the Auth Type, and provide a valid token to pair it with your request.
    
2. **View the questions**
   
   Visit localhost:5002

3. **Create a question**
   
   You can test out the question service by using a tool such as postman to send HTTP requests alongside custom json data to the server. To create a question, go to localhost:5002/create-question on postman, select post type, and add the following json to the http post request body, feel free to edit freely:

   ```sh
   {
    "title": "Fibonacci Number",
    "description": "The Fibonacci numbers, commonly   denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is, F(0) = 0, F(1) = 1 and F(n) = F(n - 1) + F(n - 2), for n > 1. Given n, calculate F(n).",
    "difficulty": "Easy",
    "topics": [
        "Recursion"
    ]
   }
   ```


4. **Delete a question**
   

   To delete a question, go to localhost:5002 on postman, select delete type, and add the following json to the http request body:

   ```sh
   {
    "id": "THE_QUESTION_ID_THAT_YOU_SEE_ON_YOUR_BROWSER"
   }
   ```
