### Steps to run the server

1. Navigate to the right folder (../backend/question-service).

2. Install all required packages using
<br> `npm i`

3. Clone .env.example into .env with
<br> `cp .env.example .env`
<br> If there is no `.env.example` file, first create a file named `.env.example` with the following contents:
    ```
    MONGODB_USERNAME=admin
    MONGODB_PASSWORD=g26password
    MONGODB_ENDPOINT=peerprep.xvavl.mongodb.net
    ```

4. Fire up the backend service
<br> `npm run dev`




## API Gateways

| Endpoint          | Request Type | Required Fields                                           | Description                                                                                                     |
| ----------------- | ------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| /questions         | `GET`        | \*                                                        | Get all questions                                                                                         |
| /questions         | `POST`       | title: `str`<br>description: `str`<br>category: `Array`<br>complexity: `str`                                      | Create a new question                                                                                             |
| /questions         | `PUT`        | _id: `str`<br>title: `str`<br>description: `str`<br>category: `Array`<br>complexity: `str` | Update question based on ID                                                                                                      |
| /questions         | `DELETE`     | _id: `str` | Delete question based on ID                                                             |
| /questions         | `GET`       | _id: `str`       | Get one question based on ID                                                                                                          |
