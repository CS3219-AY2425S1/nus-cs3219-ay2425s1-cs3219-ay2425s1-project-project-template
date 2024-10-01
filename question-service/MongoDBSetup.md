## Remote DB Setup for question-service (MongoDB Atlas)

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

5. Return to the cluster menu and click “connect”, followed by “compass”. Obtain the connection string to the database. Copy this connection string and add it to the .env file in the question-service directory of the project under MONGODB_URI.

      ![unnamed](https://github.com/user-attachments/assets/51f90e13-614f-4bc9-8e06-1ceae9d63b4d)
      ![unnamed](https://github.com/user-attachments/assets/1e2cea05-7c6f-4d5f-b30a-5365969c1427)
      ![unnamed](https://github.com/user-attachments/assets/6530e2aa-87ec-44c4-807a-ef587b9935f1)

