# Blogging-API

Fully functional blogging API for AltSchool Africa blogs

---
Check the Project Live Url

- [On Render](https://blogging-api.onrender.com/)


### Use Swagger Docs to view API

Visit the `/api-docs/` route to use swagger to explore the API

### You can use the OAuth2 Authentication in browsers on the following routes:
- Login: `/auth/login` using a  `GET` request
- Logout: `/auth/logout` using a  `GET` request

## Setup to Run

- Install NodeJS
- Pull this repo
- Update your .env file with example.env

---

## Install

    npm install

## Run the app

    npm run start

## Run the tests

    npm test

## NOTE

- Check the  `./docs` folder to get an export of my API collection from Postman or Thunder Client Collection to get the endpoints fast.
- Check `localhost:<PORT>` to see the running app where PORT is specified in .env as `API_PORT`

## Models

---

### User

| field  |  data_type | constraints  |
|---|---|---|
|  id |  ObjectId |  required, auto_generated |
|  email |  string |  required, unique |
|  firstName | string  |  required |
|  lastName  |  string |  required  |
|  password |   string |  required  |

### Blog

| field  |  data_type | constraints  |
|---|---|---|
|  id |  ObjectId |  required, auto_generated |
|  title | string  |  required, unique |
|  description  |  string |    |
|  body     | string  |  required |
|  author |   ObjectId |  required  |
|  state |  string |  required, enum: ["draft", "published"], lowercase |
|  read_count |  number |  default:0 |
|  reading_time |  object | shape: {inNumber: number}, {inString: string} |
|  tags |  string[] |  lowercase:true |
|  createdAt |  date |  auto_generated |
|  updatedAt |  date |  auto_updated |

# REST API

This is a guide on the available routes and how to use them

## User Sign up

### Request

`POST /auth/signup`

```json
{
    "firstName": "Foo",
    "lastName": "Bar",
    "email": "foobar@gmail.com",
    "password": "foobar"
}
```

### Response

    Status: 201 Created

```json
{
"message": "Signup successful",
"user": {
    "email": "foobar@gmail.com",
    "firstName": "Foo",
    "lastName": "Bar",
    "password": "$2b$10$GVDu6g6bKu4u6ehjY9MhxeYc8VzlaAAkO97rVOkgpYRFhFgL.nYbq",
    "_id": "6367e99d0a7d3c0d68e11c3e",
    "__v": 0
    }
}
```

## User Login

### Request

`POST /auth/login`

```json
{
    "email": "foobar@gmail.com",
    "password": "foobar"
}
```

### Response

    Status: 200 OK

```json
{
"message": "Logged In Successfully",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM2N2U5OWQwYTdkM2MwZDY4ZTExYzNlIiwiZW1haWwiOiJmb29iYXJAZ21haWwuY29tIn0sImlhdCI6MTY2Nzc1NDY1OCwiZXhwIjoxNjY3NzU4MjU4fQ.ExwC2WajQhK0S0f2vIL1BO9o9z4SD4Uz6m2uR2F9yO0"
}
```

## Create blog

### Request

`POST /blogs`

- Header
  - Authorization: Bearer {token}
- Query Parameters
  - title
  - description
  - body
  - tags

```json
    {
        "title": "My Blog 1",
        "description": "Creating API Documentation",
        "body": "You should be able to import API configurations for both postman and thunder client",
        "tags": "api,productivity,programming"
    }
```

### Response

    Status: 201 Created

```json
{
    "status": true,
    "blog": {
        "title": "My Blog 1",
        "description": "Creating API Documentation",
        "body": "You should be able to import API configurations for both postman and thunder client",
        "author": "6367ef0b0a7d3c0d68e11c44",
        "state": "draft",
        "read_count": 0,
        "reading_time": {
            "inString": "~ 4 second(s)",
            "inNumber": 0.07
        },
        "tags": [
        "api",
        "productivity",
        "programming"
        ],
        "_id": "6367f13b0a7d3c0d68e11c48",
        "createdAt": "2022-11-06T17:39:07.571Z",
        "updatedAt": "2022-11-06T17:39:07.655Z",
        "__v": 1
    }
}
```

## Publish Blog (Update blog state to publish)

### Request

`PATCH /blogs/publish/:id`

- Header
  - Authorization: Bearer {token}

### Response

    Status: 200 OK

```json
{
  "status": true,
  "message": "Your blog has been published!",
  "blog": {
    "reading_time": {
      "inString": "~ 4 second(s)",
      "inNumber": 0.07
    },
    "_id": "6367f13b0a7d3c0d68e11c48",
    "title": "My Blog 1",
    "description": "Creating API Documentation",
    "body": "You should be able to import API configurations for both postman and thunder client",
    "author": "6367ef0b0a7d3c0d68e11c44",
    "state": "published",
    "read_count": 0,
    "tags": [
      "api",
      "productivity",
      "programming"
    ],
    "createdAt": "2022-11-06T17:39:07.571Z",
    "updatedAt": "2022-11-06T17:49:04.544Z",
    "__v": 1
  }
}
```

## Get published blog by id

### Request

`GET /blogs/:id`

### Response

    Status: 200 OK

```json
{
  "status": true,
  "blog": {
    "reading_time": {
      "inString": "~ 4 second(s)",
      "inNumber": 0.07
    },
    "_id": "6367f13b0a7d3c0d68e11c48",
    "title": "My Blog 1",
    "description": "Creating API Documentation",
    "body": "You should be able to import API configurations for both postman and thunder client",
    "author": {
      "email": "foobar@gmail.com",
      "firstName": "Foo",
      "lastName": "Bar"
    },
    "state": "published",
    "read_count": 1,
    "tags": [
      "api",
      "productivity",
      "programming"
    ],
    "createdAt": "2022-11-06T17:39:07.571Z",
    "updatedAt": "2022-11-06T17:49:04.544Z",
    "__v": 1
  }
}
```

## Get a list of the Published blogs

### Request

`GET /blogs`

- Query Parameters
  - page (default: 1)
  - orderBy (default: createdAt) other value options: reading_time and read_count. Prefix it with a `-` sign to query in descending order e.g -createdAt will arrange the blogs from the latest to the oldest
  - title
  - author
  - tags

### Response

    Status: 200 OK

```json
{
  "status": true,
  "count": 1,
  "blogs": [
    {
      "reading_time": {
        "inString": "~ 4 second(s)",
        "inNumber": 0.07
      },
      "_id": "6367f13b0a7d3c0d68e11c48",
      "title": "My Blog 1",
      "description": "Creating API Documentation",
      "body": "You should be able to import API configurations for both postman and thunder client",
      "author": {
        "firstName": "Foo",
        "lastName": "Bar"
      },
      "state": "published",
      "read_count": 1,
      "tags": [
        "api",
        "productivity",
        "programming"
      ],
      "createdAt": "2022-11-06T17:39:07.571Z",
      "updatedAt": "2022-11-06T17:54:01.978Z",
      "__v": 1
    }
  ]
}
```

## Get logged in user blogs

### Request

`GET /blogs/mine`

- Header
  - Authorization: Bearer {token}

- Query Parameters
  - page (default: 1)
  - state (enum: [draft, published])

### Response

    Status: 200 OK

```json
{
  "status": true,
  "count": 1,
  "blogs": [
    {
      "reading_time": {
        "inString": "~ 4 second(s)",
        "inNumber": 0.07
      },
      "_id": "6367f13b0a7d3c0d68e11c48",
      "title": "My Book",
      "description": "It's for programmers",
      "body": "You should be able to import API configurations for both postman and thunder client",
      "author": "6367ef0b0a7d3c0d68e11c44",
      "state": "published",
      "read_count": 1,
      "tags": [
        "programming",
        "motivation"
      ],
      "createdAt": "2022-11-06T17:39:07.571Z",
      "updatedAt": "2022-11-06T18:10:36.384Z",
      "__v": 2
    }
  ]
}
```

## Edit/Update blog by id

### Request

`PUT /blogs/:id`

- Header
  - Authorization: Bearer {token}

- Query Parameters
  - title
  - description
  - body
  - tags

  ```json
  {
    "title": "My Book",
    "description": "It's for programmers",
    "tags": "programming,motivation"
  }
  ```

### Response

    Status: 200 OK

```json
{
  "status": true,
  "message": "Blog edited successfully",
  "blog": {
    "reading_time": {
      "inString": "~ 4 second(s)",
      "inNumber": 0.07
    },
    "_id": "6367f13b0a7d3c0d68e11c48",
    "title": "My Book",
    "description": "It's for programmers",
    "body": "You should be able to import API configurations for both postman and thunder client",
    "author": "6367ef0b0a7d3c0d68e11c44",
    "state": "published",
    "read_count": 1,
    "tags": [
      "programming",
      "motivation"
    ],
    "createdAt": "2022-11-06T17:39:07.571Z",
    "updatedAt": "2022-11-06T18:10:36.384Z",
    "__v": 2
  }
}
```

## Delete blog by id

### Request

`DELETE /blogs/:id`

- Header
  - Authorization: Bearer {token}

### Response

    Status: 200 OK

```json
{
  "status": true,
  "message": "Blog deleted successfully"
}
```
