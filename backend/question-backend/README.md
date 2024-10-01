## Running Question Service

1. Open Command Line/Terminal and navigate into the `question_backend` directory.

2. Run the command: `npm install`. This will install all the necessary dependencies.

3. Run the command `npm start` to start the Question Service in production mode, or use `npm run dev` for development mode, which includes features like automatic server restart when you make code changes.

4. Using applications like Postman, you can interact with the User Service on port 4000. If you wish to change this, please update the `.env` file (there is a sample file under `.envsample`).

## Question Service API Guide

### Create Question

- This endpoint allows adding a new question to the database.
- HTTP method: `POST`
- Endpoint: `http://localhost:4000/api/questions`
- Body

  - Required: `title` (string), `description` (string), `topic` (string array), `difficulty` (string), `input` (mixed), `expected_output` (mixed)
  - Optional: `images` (string array), `leetcode_link` (string)

    ```json
    {
      "title": "Random Question",
      "description": "Random Question Description",
      "topic": ["Algorithms", "Database"],
      "difficulty": "Medium",
      "input": ["1", "2", "3"],
      "expected_output": [1, 2, 3],
      "images": [
        "https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist.png"
      ],
      "leetcode_link": "https://leetcode.com/problems/linked-list-cycle/"
    }
    ```

- Responses:

  | Response Code               | Explanation                                                   |
  | --------------------------- | ------------------------------------------------------------- |
  | 201 (Created)               | Question created successfully, created question data returned |
  | 400 (Bad Request)           | Missing or wrong fields                                       |
  | 409 (Conflict)              | Duplicate title encountered                                   |
  | 500 (Internal Server Error) | Database or server error                                      |

### Get Question

- This endpoint allows retrieval of a single question from the database using the question's ID.
- HTTP method: `GET`
- Endpoint: `http://localhost:4000/api/questions/${questionId}`
- Parameters
  - Required: `questionId` path parameter
  - Example: `http://localhost:4000/api/questions/66f56debce5843e0172cb1bb`
- Responses:

  | Response Code               | Explanation                          |
  | --------------------------- | ------------------------------------ |
  | 200 (OK)                    | Success, question data returned      |
  | 400 (Bad Request)           | Missing or wrong field (question ID) |
  | 404 (Not Found)             | Question with specified ID not found |
  | 500 (Internal Server Error) | Database or server error             |

### Get All Questions (with Filter)

- This endpoint allows retrieval of all questions from the database or a subset of questions based on their topic/difficulty.
- HTTP method: `GET`
- Endpoint to get all questions: `http://localhost:4000/api/questions`
- Endpoint to filter questions: `http://localhost:4000/api/questions?${category}=${filter}`
- Parameters
  - Optional: `category` and `filter` path parameters
  - Examples:
    - `http://localhost:4000/api/questions/`
    - `http://localhost:4000/api/questions?topic=Algorithms&difficulty=Hard`
    - `http://localhost:4000/api/questions?topic=Algorithms&topic=Strings`
- Responses:

  | Response Code               | Explanation                     |
  | --------------------------- | ------------------------------- |
  | 200 (OK)                    | Success, question data returned |
  | 400 (Bad Request)           | Missing or wrong field          |
  | 500 (Internal Server Error) | Database or server error        |

### Update Question

- This endpoint allows updating a question and their related data in the database using the question's ID.
- HTTP Method: `PUT`
- Endpoint: `http://localhost:4000/api/questions/${questionId}`
- Parameters

  - Required: `questionId` path parameter

- Body

  - At least one of the following fields is required: `title` (string), `description` (string), `topic` (string array), `difficulty` (string), `input` (mixed), `expected_output` (mixed), `images` (string array), `leetcode_link` (string)

    ```json
    {
      "title": "Edited Question",
      "description": "Newly edited description",
      "topic": ["Data Structures"],
      "difficulty": "Hard",
      "input": "xyz",
      "expected_output": "zyx",
      "images": "https://i.pinimg.com/736x/4e/fe/44/4efe44e6acdf1c4cb638f9b424e28eed.jpg",
      "leetcode_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
    ```

- Responses:

  | Response Code               | Explanation                                                   |
  | --------------------------- | ------------------------------------------------------------- |
  | 200 (OK)                    | Question updated successfully, updated question data returned |
  | 400 (Bad Request)           | Missing or wrong fields                                       |
  | 404 (Not Found)             | Question with specified ID not found                          |
  | 409 (Conflict)              | Duplicate title encountered                                   |
  | 500 (Internal Server Error) | Database or server error                                      |

### Delete Question

- This endpoint allows deletion of a question and their related data from the database using the question's ID.
- HTTP Method: `DELETE`
- Endpoint: `http://localhost:4000/api/questions/${questionId}`
- Parameters

  - Required: `questionId` path parameter

- Responses:

  | Response Code               | Explanation                                                   |
  | --------------------------- | ------------------------------------------------------------- |
  | 200 (OK)                    | Question deleted successfully, deleted question data returned |
  | 400 (Bad Request)           | Missing or wrong fields                                       |
  | 404 (Not Found)             | Question with specified ID not found                          |
  | 500 (Internal Server Error) | Database or server error                                      |
