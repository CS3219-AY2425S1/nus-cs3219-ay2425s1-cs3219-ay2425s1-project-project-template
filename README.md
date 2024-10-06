[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)
# CS3219 Project (PeerPrep) - AY2425S1
## Group: G13

### Milestone N3 Overview
Containerised the frontend and split the backend into a question service and user service with Docker and Docker Compose. Below is a quick guide on getting it to run with Docker yourself.

### Quickstart:
The following guide assumes you already have Docker installed.

1. Step 1: Clone the repository.

2. Step 2: Set up configuration file
Set up correct .env configuration file for both question and user service. 

3. Step 3: Run the docker-compose file
Run the following from the root directory:
`docker-compose up --build -d`
This will build and run the containers in detached mode. There should be 3 containers running: frontend, question-service, user-service.

4. Step 3: View app at localhost:3000
Find the test app up at: http://localhost:3000/home




