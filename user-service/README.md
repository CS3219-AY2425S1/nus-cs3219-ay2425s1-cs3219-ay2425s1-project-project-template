# User Service API Guide

This directory contains a [Postman collection](./User-Service%20API.postman_collection.json) for the User Service API.

## Create User Account Request

- This endpoint initiates a new user account creation request that requires email verification.
- HTTP Method: `POST`
- Endpoint: http://localhost:3001/users
- Body
    ```json
    {
        "username": "string",
        "email": "string",
        "password": "string"
    }
    ```
- Validation Rules:
    - Username: 2-32 characters, can contain a-z, A-Z, 0-9, _ or -
    - Email: Must be valid email format
    - Password: Minimum 8 characters

- Responses:

    | Response Code               | Explanation                                                |
    |----------------------------|------------------------------------------------------------|
    | 201 (Created)              | Account request created, verification email sent           |
    | 400 (Bad Request)          | Invalid input data                                        |
    | 409 (Conflict)             | Username or email already exists                          |
    | 500 (Internal Server Error) | Server error                                             |

- Success Response Body:
    ```json
    {
        "message": "Created new user {username} request successfully",
        "data": {
            "token": "email_verification_token",
            "expiry": "2024-03-21T10:30:00.000Z"
        }
    }
    ```

## Confirm User Account

- This endpoint confirms a user account after email verification.
- HTTP Method: `PATCH`
- Endpoint: http://localhost:3001/auth/{userId}
- Headers
    - Required: `Authorization: Bearer <EMAIL_VERIFICATION_TOKEN>`

- Responses:

    | Response Code               | Explanation                                                |
    |----------------------------|------------------------------------------------------------|
    | 200 (OK)                   | Account confirmed successfully                             |
    | 401 (Unauthorized)         | Invalid or expired verification token                      |
    | 500 (Internal Server Error) | Server error                                             |

- Success Response Body:
    ```json
    {
        "message": "{userId} registered and logged in!",
        "data": {
            "accessToken": "jwt_access_token",
            "id": "user_id",
            "username": "string",
            "email": "string",
            "isAdmin": boolean,
            "isVerified": boolean,
            "createdAt": "timestamp"
        }
    }
    ```

## Delete Account Creation Request

- This endpoint deletes an unverified account creation request.
- HTTP Method: `DELETE`
- Endpoint: http://localhost:3001/users/{email}

- Responses:

    | Response Code               | Explanation                                                |
    |----------------------------|------------------------------------------------------------|
    | 200 (OK)                   | Account request deleted successfully                       |
    | 403 (Forbidden)            | Cannot delete verified accounts                            |
    | 404 (Not Found)            | User not found or invalid email                           |
    | 500 (Internal Server Error) | Server error                                             |

## Refresh Email Verification Token

- This endpoint refreshes the email verification token and sends a new verification email.
- HTTP Method: `PATCH`
- Endpoint: http://localhost:3001/users/{userId}/resend-request
- Headers
    - Required: `Authorization: Bearer <OLD_EMAIL_VERIFICATION_TOKEN>`

- Responses:

    | Response Code               | Explanation                                                |
    |----------------------------|------------------------------------------------------------|
    | 201 (Created)              | New verification token generated and email sent            |
    | 401 (Unauthorized)         | Invalid or expired verification token                      |
    | 500 (Internal Server Error) | Server error                                             |

- Success Response Body:
    ```json
    {
        "message": "Token refreshed successfully",
        "data": {
            "token": "new_email_verification_token",
            "expiry": "2024-03-21T10:30:00.000Z"
        }
    }
    ```

## Create User

- This endpoint allows adding a new user to the database (i.e., user registration).

- HTTP Method: `POST`

- Endpoint: http://localhost:3001/users

- Body
  - Required: `username` (string), `email` (string), `password` (string)

    ```json
    {
      "username": "SampleUserName",
      "email": "sample@gmail.com",
      "password": "SecurePassword"
    }
    ```

- Responses:

    | Response Code               | Explanation                                           |
    |-----------------------------|-------------------------------------------------------|
    | 201 (Created)               | User created successfully, created user data returned |
    | 400 (Bad Request)           | Missing fields                                        |
    | 409 (Conflict)              | Duplicate username or email encountered               |
    | 500 (Internal Server Error) | Database or server error                              |

## Get User

- This endpoint allows retrieval of a single user's data from the database using the user's ID.

  > :bulb: The user ID refers to the MongoDB Object ID, a unique identifier automatically generated by MongoDB for each document in a collection.

- HTTP Method: `GET`

- Endpoint: http://localhost:3001/users/{userId}

- Parameters
    - Required: `userId` path parameter
    - Example: `http://localhost:3001/users/60c72b2f9b1d4c3a2e5f8b4c`

- <a name="auth-header">Headers</a>

    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

    - Explanation: This endpoint requires the client to include a JWT (JSON Web Token) in the HTTP request header for authentication and authorization. This token is generated during the authentication process (i.e., login) and contains information about the user's identity. The server verifies this token to ensure that the client is authorized to access the data.

    - Auth Rules:

        - Admin users: Can retrieve any user's data. The server verifies the user associated with the JWT token is an admin user and allows access to the requested user's data.

        - Non-admin users: Can only retrieve their own data. The server checks if the user ID in the request URL matches the ID of the user associated with the JWT token. If it matches, the server returns the user's own data.

- Responses:

    | Response Code               | Explanation                                              |
    |-----------------------------|----------------------------------------------------------|
    | 200 (OK)                    | Success, user data returned                              |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT         |
    | 403 (Forbidden)             | Access denied for non-admin users accessing others' data |
    | 404 (Not Found)             | User with the specified ID not found                     |
    | 500 (Internal Server Error) | Database or server error                                 |

## Get All Users

- This endpoint allows retrieval of all users' data from the database.
- HTTP Method: `GET`
- Endpoint: http://localhost:3001/users
- Headers
    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
    - Auth Rules:

        - Admin users: Can retrieve all users' data. The server verifies the user associated with the JWT token is an admin user and allows access to all users' data.
        - Non-admin users: Not allowed access.

- Responses:

    | Response Code               | Explanation                                      |
    |-----------------------------|--------------------------------------------------|
    | 200 (OK)                    | Success, all user data returned                  |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT |
    | 403 (Forbidden)             | Access denied for non-admin users                |
    | 500 (Internal Server Error) | Database or server error                         |

## Update User

- This endpoint allows updating a user and their related data in the database using the user's ID.

- HTTP Method: `PATCH`

- Endpoint: http://localhost:3001/users/{userId}

- Parameters
  - Required: `userId` path parameter

- Body
  - At least one of the following fields is required: `username` (string), `email` (string), `password` (string)

    ```json
    {
      "username": "SampleUserName",
      "email": "sample@gmail.com",
      "password": "SecurePassword"
    }
    ```

- Headers
    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
    - Auth Rules:

        - Admin users: Can update any user's data. The server verifies the user associated with the JWT token is an admin user and allows the update of requested user's data.
        - Non-admin users: Can only update their own data. The server checks if the user ID in the request URL matches the ID of the user associated with the JWT token. If it matches, the server updates the user's own data.

- Responses:

    | Response Code               | Explanation                                             |
    |-----------------------------|---------------------------------------------------------|
    | 200 (OK)                    | User updated successfully, updated user data returned   |
    | 400 (Bad Request)           | Missing fields                                          |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT        |
    | 403 (Forbidden)             | Access denied for non-admin users updating others' data |
    | 404 (Not Found)             | User with the specified ID not found                    |
    | 409 (Conflict)              | Duplicate username or email encountered                 |
    | 500 (Internal Server Error) | Database or server error                                |

## Update User Privilege

- This endpoint allows updating a user’s privilege, i.e., promoting or demoting them from admin status.

- HTTP Method: `PATCH`

- Endpoint: http://localhost:3001/users/{userId}

- Parameters
  - Required: `userId` path parameter

- Body
  - Required: `isAdmin` (boolean)

    ```json
    {
      "isAdmin": true
    }
    ```

- Headers
    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
    - Auth Rules:

        - Admin users: Can update any user's privilege. The server verifies the user associated with the JWT token is an admin user and allows the privilege update.
        - Non-admin users: Not allowed access.

> :bulb: You may need to manually assign admin status to the first user by directly editing the database document before using this endpoint.

- Responses:

    | Response Code               | Explanation                                                     |
    |-----------------------------|-----------------------------------------------------------------|
    | 200 (OK)                    | User privilege updated successfully, updated user data returned |
    | 400 (Bad Request)           | Missing fields                                                  |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT                |
    | 403 (Forbidden)             | Access denied for non-admin users                               |
    | 404 (Not Found)             | User with the specified ID not found                            |
    | 500 (Internal Server Error) | Database or server error                                        |

## Delete User

- This endpoint allows deletion of a user and their related data from the database using the user's ID.
- HTTP Method: `DELETE`
- Endpoint: http://localhost:3001/users/{userId}
- Parameters

  - Required: `userId` path parameter
- Headers

  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

  - Auth Rules:

    - Admin users: Can delete any user's data. The server verifies the user associated with the JWT token is an admin user and allows the deletion of requested user's data.

    - Non-admin users: Can only delete their own data. The server checks if the user ID in the request URL matches the ID of the user associated with the JWT token. If it matches, the server deletes the user's own data.
- Responses:

    | Response Code               | Explanation                                             |
    |-----------------------------|---------------------------------------------------------|
    | 200 (OK)                    | User deleted successfully                               |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT        |
    | 403 (Forbidden)             | Access denied for non-admin users deleting others' data |
    | 404 (Not Found)             | User with the specified ID not found                    |
    | 500 (Internal Server Error) | Database or server error                                |

## Login

- This endpoint allows a user to authenticate with an email and password and returns a JWT access token. The token is valid for 1 day and can be used subsequently to access protected resources. For example usage, refer to the [Authorization header section in the Get User endpoint](#auth-header).
- HTTP Method: `POST`
- Endpoint: http://localhost:3001/auth/login
- Body
  - Required: `email` (string), `password` (string)

    ```json
    {
      "email": "sample@gmail.com",
      "password": "SecurePassword"
    }
    ```

- Responses:

    | Response Code               | Explanation                                        |
    |-----------------------------|----------------------------------------------------|
    | 200 (OK)                    | Login successful, JWT token and user data returned |
    | 400 (Bad Request)           | Missing fields                                     |
    | 401 (Unauthorized)          | Incorrect email or password                        |
    | 500 (Internal Server Error) | Database or server error                           |

## Verify Token

- This endpoint allows one to verify a JWT access token to authenticate and retrieve the user's data associated with the token.
- HTTP Method: `GET`
- Endpoint: http://localhost:3001/auth/verify-token
- Headers
  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

- Responses:

    | Response Code               | Explanation                                        |
    |-----------------------------|----------------------------------------------------|
    | 200 (OK)                    | Token verified, authenticated user's data returned |
    | 401 (Unauthorized)          | Missing/invalid/expired JWT                        |
    | 500 (Internal Server Error) | Database or server error                           |

## Get User's Friends

- This endpoint allows retrieval of a user's friends list.
- HTTP Method: `GET`
- Endpoint: http://localhost:3001/users/{userId}/friends
- Headers
    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
    - Auth Rules:
        - Admin users: Can retrieve any user's friends list
        - Non-admin users: Can only retrieve their own friends list

- Responses:

    | Response Code               | Explanation                                      |
    |-----------------------------|--------------------------------------------------|
    | 200 (OK)                    | Success, friends list returned                   |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT |
    | 403 (Forbidden)             | Access denied for non-admin users                |
    | 404 (Not Found)             | User with specified ID not found                 |
    | 500 (Internal Server Error) | Database or server error                         |

## Get User's Friend Requests

- This endpoint allows retrieval of pending friend requests for a user.
- HTTP Method: `GET`
- Endpoint: http://localhost:3001/users/{userId}/friendRequests
- Headers
    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
    - Auth Rules:
        - Admin users: Can retrieve any user's friend requests
        - Non-admin users: Can only retrieve their own friend requests

- Responses:

    | Response Code               | Explanation                                      |
    |-----------------------------|--------------------------------------------------|
    | 200 (OK)                    | Success, friend requests returned                |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT |
    | 403 (Forbidden)             | Access denied for non-admin users                |
    | 404 (Not Found)             | User with specified ID not found                 |
    | 500 (Internal Server Error) | Database or server error                         |

## Send Friend Request

- This endpoint allows sending a friend request to another user.
- HTTP Method: `POST`
- Endpoint: http://localhost:3001/users/{userId}/addFriend
- Headers
    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- Body
    - Required: `friendId` (string)
    ```json
    {
      "friendId": "60c72b2f9b1d4c3a2e5f8b4c"
    }
    ```
- Auth Rules:
    - Admin users: Can send friend requests on behalf of any user
    - Non-admin users: Can only send friend requests from their own account

- Responses:

    | Response Code               | Explanation                                      |
    |-----------------------------|--------------------------------------------------|
    | 200 (OK)                    | Friend request sent successfully                 |
    | 400 (Bad Request)           | Missing friendId                                 |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT |
    | 403 (Forbidden)             | Access denied for non-admin users                |
    | 404 (Not Found)             | User or friend not found                         |
    | 409 (Conflict)              | Already friends or request already sent          |
    | 500 (Internal Server Error) | Database or server error                         |

## Accept Friend Request

- This endpoint allows accepting a pending friend request.
- HTTP Method: `POST`
- Endpoint: http://localhost:3001/users/{userId}/acceptFriend
- Headers
    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- Body
    - Required: `friendId` (string)
    ```json
    {
      "friendId": "60c72b2f9b1d4c3a2e5f8b4c"
    }
    ```
- Auth Rules:
    - Admin users: Can accept friend requests on behalf of any user
    - Non-admin users: Can only accept their own friend requests

- Responses:

    | Response Code               | Explanation                                      |
    |-----------------------------|--------------------------------------------------|
    | 200 (OK)                    | Friend request accepted successfully             |
    | 400 (Bad Request)           | Missing friendId                                 |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT |
    | 403 (Forbidden)             | Access denied for non-admin users                |
    | 404 (Not Found)             | User or friend not found                         |
    | 409 (Conflict)              | No pending friend request found                  |
    | 500 (Internal Server Error) | Database or server error                         |

## Add Match History

- This endpoint allows adding a completed match to a user's match history.
- HTTP Method: `POST`
- Endpoint: http://localhost:3001/users/{userId}/addMatch
- Headers
    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- Body
    - Required: `sessionId` (string), `questionId` (string), `partnerId` (string)
    ```json
    {
      "sessionId": "session123",
      "questionId": "question456",
      "partnerId": "60c72b2f9b1d4c3a2e5f8b4c"
    }
    ```
- Auth Rules:
    - Admin users: Can add matches to any user's history
    - Non-admin users: Can only add matches to their own history

- Responses:

    | Response Code               | Explanation                                      |
    |-----------------------------|--------------------------------------------------|
    | 200 (OK)                    | Match added successfully                         |
    | 400 (Bad Request)           | Missing required fields                          |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT |
    | 403 (Forbidden)             | Access denied for non-admin users                |
    | 404 (Not Found)             | User or partner not found                        |
    | 500 (Internal Server Error) | Database or server error                         |
