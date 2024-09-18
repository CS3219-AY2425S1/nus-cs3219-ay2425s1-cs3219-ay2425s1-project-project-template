### Steps to run the server

1. cd to the right folder (question-service).

2. Install all the packages
<br> `npm i`

3. rename .env.example into .env

4. Fire up the backend service
<br> `npm run dev`




## API Gateways

| Endpoint          | Request Type | Required Fields                                           | Description                                                                                                     |
| ----------------- | ------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| /question         | `GET`        | \*                                                        | Get all question                                                                                         |
| /question         | `POST`       | title: `str`<br>description: `str`<br>category: `Array`<br>complexity: `str`                                      | Create a new question                                                                                             |
| /question         | `PUT`        | id: `str`<br>title: `str`<br>description: `str`<br>category: `Array`<br>complexity: `str` | Update question based on ID                                                                                                      |
| /question         | `DELETE`     | id: `str`<br>title: `str`<br>description: `str`<br>category: `Array`<br>complexity: `str`           | Delete question based on ID                                                             |
| /question         | `GET`       | id: `str`       | Get one question based on ID                                                                                                          |
