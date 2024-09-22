### Steps to run the server

1. cd to the right folder (question-service).

2. Install all the packages
<br> `npm i`

3. rename .env.example into .env
<br> `mv .env.example .env`

4. Fire up the backend service
<br> `npm run dev`




## API Gateways

| Endpoint          | Request Type | Required Fields                                           | Description                                                                                                     |
| ----------------- | ------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| /question         | `GET`        | \*                                                        | Get all question                                                                                         |
| /question         | `POST`       | title: `str`<br>description: `str`<br>category: `Array`<br>complexity: `str`                                      | Create a new question                                                                                             |
| /question         | `PUT`        | _id: `str`<br>title: `str`<br>description: `str`<br>category: `Array`<br>complexity: `str` | Update question based on ID                                                                                                      |
| /question         | `DELETE`     | _id: `str` | Delete question based on ID                                                             |
| /question         | `GET`       | _id: `str`       | Get one question based on ID                                                                                                          |
