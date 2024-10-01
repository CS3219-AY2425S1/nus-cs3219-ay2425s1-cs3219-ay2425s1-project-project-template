[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)
# CS3219 Project (PeerPrep) - AY2425S1
## Group: G38

### Team Members:
- [Daniel](https://github.com/dloh2236)
- [James](https://github.com/jayllo-c)
- [Johan](https://github.com/delishad21)
- [Joshua](https://github.com/dloh2236)

## Milestone 3 Submission - Containerization


# Setting Up the Project

## Prerequisites

1. Clone this repository to your local machine.
2. Ensure you have the following installed:
   - Docker
3. (Optional) Sign up for a MongoDB Atlas account
   - The docker compose file is configured to use a local MongoDB instance by default. If you would like to use a remote MongoDB instance, you can follow the instructions in the "Remote DB Setup" section below.

## Remote DB Setup (MongoDB Atlas) (Optional)

### For Question Service

1. Create a Cluster: Set up a new cluster and choose the free tier

      ![unnamed](https://github.com/user-attachments/assets/8f539f32-a260-481c-a9a3-2e307ada9e2c)

2. Create a Database: Click on the "Collections" tab and create a new database with the name “peerprep” and a collection called “questions”.

      ![unnamed](https://github.com/user-attachments/assets/ccc3ec08-6b4e-4a1c-84f2-4517b70b86f4)
      ![unnamed](https://github.com/user-attachments/assets/371b3a83-c85c-4704-835e-5195f11ae77e)
      ![unnamed](https://github.com/user-attachments/assets/1c161b4a-1b39-4294-a9eb-629b36f571cc)

3. Network Access: Allow access from your IP address by adding it in the "Network Access" tab.

      ![unnamed](https://github.com/user-attachments/assets/ec658c5a-6098-4a13-a4bd-7262dd1d8f29)

4. Database User: Create a new database user with read and write access to your database.

      ![unnamed](https://github.com/user-attachments/assets/800d4194-bb83-4411-abc9-d0f3ca51d107)
      ![unnamed](https://github.com/user-attachments/assets/d7ab1387-af80-44b7-8571-b74530ee320b)

5. Return to the cluster menu and click “connect”, followed by “compass”. Obtain the connection string to the database. Save this for later use in the backend.

      ![unnamed](https://github.com/user-attachments/assets/51f90e13-614f-4bc9-8e06-1ceae9d63b4d)
      ![unnamed](https://github.com/user-attachments/assets/1e2cea05-7c6f-4d5f-b30a-5365969c1427)
      ![unnamed](https://github.com/user-attachments/assets/6530e2aa-87ec-44c4-807a-ef587b9935f1)

## Spinning Up Docker Containers

1. cd into the question-service directory
2. Install dependencies – Ensure you have Node.js and npm installed on your machine. You can install the project dependencies by running npm install
3. Set up environment variables – Create a .env file in the question-service directory of the project and include the following environment variable: `MONGODB_URI=<Your MongoDB connection string (obtained earlier)>`
4. Run the backend server – After setting up the environment variables and MongoDB, you can start the server using npm run dev. This command will start the backend server in development mode and listen for API requests.

**Common Issue and Troubleshooting:**
Issue: MongoParseError: URI malformed
- Solution: Ensure that the MONGODB_URI in your .env file is correctly formatted with the right username, password, and database name.

**Testing of the backend server:**
You can now test the API endpoints using Postman or any API testing tool. The server should be running on http://localhost:8003/api/questions
| **Operation**            | **Method** | **Endpoint**                               | **Params/Request Body**                                                                                                                                             |
|--------------------------|------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Create a question**     | POST       | `http://localhost:8003/api/questions`      | `{ "title": <string>, "description": <string>, "category": <an array of strings>, "complexity": <string>, "templateCode": <string>, "testCases": <an array of strings> }` |
| **Update a question**     | PUT        | `http://localhost:8003/api/questions/<id>` | `{ "title": <string>, "description": <string>, "category": <an array of strings>, "complexity": <string>, "templateCode": <string>, "testCases": <an array of strings> }` |
| **Delete a question**     | DELETE     | `http://localhost:8003/api/questions/<id>` | `id`: refers to the question id (1-indexed)                                                                                                                           |
| **Retrieve questions (with filter)** | GET        | `http://localhost:8003/api/questions?<params>` | `?title=`, `?category=`, `?page=`, `?complexity=`, `?sort=`. Filters can be stacked. Multiple categories: `?category=Algorithms&category=Arr&category=Database`. Sorting: `?sort=title` (ascending), `?sort=-title` (descending) |
| **Retrieve a question**   | GET        | `http://localhost:8003/api/questions/<id>` | `id`: refers to the question id (1-indexed)                                                                                                                           |

### Frontend Setup
1. Navigate to the frontend directory: cd frontend/peerprep
2. Install dependencies – Ensure you have Node.js and npm installed on your machine. You can install the project dependencies by running npm install
3. Run the Development Server. Ensure that the backend is running on localhost:8003. Start the development server by running the following command: npm run dev
4. Once the server is running, open your browser and visit: http://localhost:3000 This will display the application in development mode.
5. Navigate to the Questions Management Tab. You should be able to use the application as described above.
6. Using File Upload Feature: To use the Image upload feature in the markdown editor of question descriptions, you will need to get a free upload API key and generate an authToken at https://www.portive.com

      ![unnamed](https://github.com/user-attachments/assets/99b5343e-16c3-421f-97e3-7545f56b931b)
8. After generating the authToken. Navigate to next.config.js in the root directory and add this in at the end of your file:
   ```
   module.exports = {
       env: {
           imageUploadKey: ‘<YOUR AUTHTOKEN HERE>’,
       },
   }
   ```
   Now restart the application and you should be able to upload files in the markdown editor.



