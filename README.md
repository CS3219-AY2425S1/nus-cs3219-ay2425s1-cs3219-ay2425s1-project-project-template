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
2. Ensure you have Docker installed.
3. (Optional) Sign up for a MongoDB Atlas account
   - The docker compose file is configured to use a local MongoDB instance by default. If you would like to use a remote MongoDB instance, you can follow the instructions in the ["Remote DB Setup"](#remote-db-setup-mongodb-atlas-optional) section below.


## Spinning Up Docker Containers

### Question Service

1. cd into the question-service directory
2. Duplicate the .env.sample file and rename it to .env
   - If you wish to, you can modify the values in the .env file

      | **Variable** | **Description** | **Default Value** |
      |--------------|-----------------|-------------------|
      | MONGODB_URI  | MongoDB URI     | None, commented out. If you are using a remote MongoDB instance, you can key in your connection string here |
      | QUESTION_PORT         | Port to run the service | 8003 |
      | MONGO_INITDB_ROOT_USERNAME | MongoDB root username | root |
      | MONGO_INITDB_ROOT_PASSWORD | MongoDB root password | password |

3. Run `docker-compose up` to start the question service.
   - If you keyed in a remote MongoDB URI in the .env file, the MongoDB container will not be started. The question service will connect to the remote MongoDB instance instead.

#### Common Issue and Troubleshooting
Issue: MongoParseError: URI malformed
- Solution: Ensure that the MONGODB_URI in your .env file is correctly formatted with the right username, password, and database name.

#### Testing of the backend server

You can now test the API endpoints using Postman or any API testing tool. By default, the server should be running on <http://localhost:8003/>

| **Operation**            | **Method** | **Endpoint**                               | **Params/Request Body**                                                                                                                                             |
|--------------------------|------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Create a question**     | POST       | `http://localhost:8003/api/questions`      | `{ "title": <string>, "description": <string>, "category": <an array of strings>, "complexity": <string>, "templateCode": <string>, "testCases": <an array of strings> }` |
| **Update a question**     | PUT        | `http://localhost:8003/api/questions/<id>` | `{ "title": <string>, "description": <string>, "category": <an array of strings>, "complexity": <string>, "templateCode": <string>, "testCases": <an array of strings> }` |
| **Delete a question**     | DELETE     | `http://localhost:8003/api/questions/<id>` | `id`: refers to the question id (1-indexed)                                                                                                                           |
| **Retrieve questions (with filter)** | GET        | `http://localhost:8003/api/questions?<params>` | `?title=`, `?category=`, `?page=`, `?complexity=`, `?sort=`. Filters can be stacked. Multiple categories: `?category=Algorithms&category=Arr&category=Database`. Sorting: `?sort=title` (ascending), `?sort=-title` (descending) |
| **Retrieve a question**   | GET        | `http://localhost:8003/api/questions/<id>` | `id`: refers to the question id (1-indexed)                                                                                                                           |

### User Service

1. cd into the user-service directory
2. Duplicate the .env.sample file and rename it to .env
   - If you wish to, modify the values in the .env file to change the port that the service is hosted on.

      | **Variable** | **Description** | **Default Value** |
      |--------------|-----------------|-------------------|
      | MONGODB_URI  | MongoDB URI     | None, commented out. If you are using a remote MongoDB instance, you can key in your connection string here|
      | MONGO_INITDB_ROOT_USERNAME | MongoDB root username | root |
      | MONGO_INITDB_ROOT_PASSWORD | MongoDB root password | password |
      | USER_PORT         | Port to run the service | 8004 |
      | JWT_SECRET | Secret for creating JWT signature | you-can-replace-this-with-your-own-secret |

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


## Remote DB Setup (MongoDB Atlas) (Optional)

1. Visit the MongoDB Atlas Site [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and click on "Try Free"

2. Sign Up/Sign In with your preferred method.

3. You will be greeted with welcome screens. Feel free to skip them till you reach the Dashboard page.

4. Create a Database Deployment by clicking on the green `+ Create` Button:

![alt text](./GuideAssets/Creation.png)

5. Make selections as followings:

- Select Shared Cluster
- Select `aws` as Provider

![alt text](./GuideAssets/Selection1.png)

- Select `Singapore` for Region

![alt text](./GuideAssets/Selection2.png)

- Select `M0 Sandbox` Cluster (Free Forever - No Card Required)

> Ensure to select M0 Sandbox, else you may be prompted to enter card details and may be charged!

![alt text](./GuideAssets/Selection3.png)

- Leave `Additional Settings` as it is

- Provide a suitable name to the Cluster

![alt text](./GuideAssets/Selection4.png)

6. You will be prompted to set up Security for the database by providing `Username and Password`. Select that option and enter `Username` and `Password`. Please keep this safe as it will be used in User Service later on.

![alt text](./GuideAssets/Security.png)

7. Next, click on `Add my Current IP Address`. This will whiteliste your IP address and allow you to connect to the MongoDB Database.

![alt text](./GuideAssets/Network.png)

8. Click `Finish and Close` and the MongoDB Instance should be up and running.

9. The connection string can be found by clicking on the `Connect` button on the Cluster Overview Page. followed by `Drivers`.

![alt text](./GuideAssets/connection1.png)

![alt text](./GuideAssets/connection2.png)

![alt text](./GuideAssets/connection3.png)

## Whitelisting All IP's

1. Select `Network Access` from the left side pane on Dashboard.

![alt text](./GuideAssets/SidePane.png)

2. Click on the `Add IP Address` Button

![alt text](./GuideAssets/AddIPAddress.png)

3. Select the `ALLOW ACCESS FROM ANYWHERE` Button and Click `Confirm`

![alt text](./GuideAssets/IPWhitelisting.png)

Now, any IP Address can access this Database.


