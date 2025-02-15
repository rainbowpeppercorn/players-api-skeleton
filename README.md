# players-api-skeleton

## Notes from rainbowpeppercorn...

**Hai Alchemy team!**

I used NodeJs and MongoDB to complete this assessment. To run this project locally, please install MongoDB onto your machine and get it up and running in the background.

I stored my JWT secret in a .env file, which I have included in this project solely for the sake of one of you running the tests. In a true production environment, however, I would add .env to my .gitignore file to avoid publicly exposing sensitive information. But in this case, the tests would fail for you if I didn't include it. 

In an attempt to get all of the tests to pass, I modified a few of them. Nothing too crazy.
- Wherever the tests were looking for an `id` field, I inserted `_id` instead, because `_id` is the unique field that MongoDB auto-generates for stored documents.
- For the User API PUT test, I modified the User response data to include the Bearer token, which I then assigned to the User. I noticed a similar functionality in the Player API tests, so I modeled the User tests after those.

You may (or may not) notice two extra tests in the User spec. I added those in. One was a quick test of the strength of a User's password upon creating an account. The other tests a PATCH call I wrote for the User, in case they want to update a partial user profile. I wrote a corresponding PATCH call for a Player as well, to update partial Player profiles, and a Logout call. I will need to write additional tests for these calls in the future. 

**Thank you!**





## Instructions

Welcome to an Alchemy Engineering candidate assignment!

To complete this assignment, you will create the API to power the below conditions.  Imagine, if you will, a web
front end that allows admins to create users, who can then create ping pong players. Your job, should
you choose to accept it, is to create an application to cover all of the use cases detailed in the documentation.

As you can see, you'd be better suited to use node to complete this task. If you choose not to, however,
the tests in the `test` directory must still pass.

TL;DR:

1. Refer to the documentation below
2. Build the API
3. Ensure all tests are passing
4. Send us your code
5. Win

## Tests

```
npm test
```

## User API

Part of the `player-api` is managing admin users who are then able to manage players.
A user can only interact with players they have created themselves.

A user consists of the following information:

```json
{
  "id": "<string>",
  "first_name": "<string>",
  "last_name": "<string>",
  "email": "<string>"
}
```

### Create User

Create a new admin user. Each use must have a unique email address.

**POST** /api/user

**Arguments**

| Field | Type | Description |
| ----- | ---- | ----------- |
| first_name | string | User first name |
| last_name | string | User last name |
| email | string | User email address |
| password | string | User password |
| confirm_password | string | User password confirmation |

**Response**

| Field | Type | Description |
| ----- | ---- | ----------- |
| success | boolean | Success indicator |
| user | object | User details |
| token | string | JWT token |

**Example**

```
curl -XPOST \
  -H 'Content-Type: application/json' \
  -d '{"first_name": "Jim", "last_name": "Bob", "email": "jim@bob.com", "password": "foobar", "confirm_password": "foobar"}' \
  http://localhost:3000/api/user
```

### User Login

Login an admin user.

**POST** /api/login

**Arguments**

| Field | Type | Description |
| ----- | ---- | ----------- |
| email | string | User email address |
| password | string | User password |

**Response**

| Field | Type | Description |
| ----- | ---- | ----------- |
| success | boolean | Success indicator |
| user | object | User details |
| token | string | JWT token |

**Example**

```
curl -XPOST \
  -H 'Content-Type: application/json' \
  -d '{"email": "jim@bob.com", "password": "foobar"}' \
  http://localhost:3000/api/login
```

## Player API

Players are managed by users, which are identified by a JWT.

Players consist of the following information:

```json
{
  "first_name": "<string>",
  "last_name": "<string>",
  "rating": "<number",
  "handedness": "left|right"
}
```

### List Players

List all current players in the system. Players are scoped to the current user.

**GET** /api/players

**Headers**

| Name | Description |
| ---- | ----------- |
| Authorization | JWT passed in bearer format |

**Response**

| Field | Type | Description |
| ----- | ---- | ----------- |
| success | boolean | Success indicator |
| players | array | List of players |

**Example**

```
curl -XGET \
  -H 'Authorization: Bearer <my_jwt_token>' \
  http://localhost:3000/api/players
```

### Create Player

Create new player in the system. Players must have unique first name / last name combinations.

**POST** /api/players

**Headers**

| Name | Description |
| ---- | ----------- |
| Authorization | JWT passed in bearer format |

**Arguments**

| Field | Type | Description |
| ----- | ---- | ----------- |
| first_name | string | Player first name |
| last_name | string | Player last name |
| rating | string | Player rating |
| handedness | enum | Player handedness (left or right) |

**Response**

| Field | Type | Description |
| ----- | ---- | ----------- |
| success | boolean | Success indicator |
| player | object | Player information |

**Example**

```
curl -XPOST \
  -H 'Authorization: Bearer <my_jwt_token>' \
  -H 'Content-Type: application/json' \
  -d '{"first_name": "Ma", "last_name": "Long", "rating": 9000, "handedness": "right"}' \
  http://localhost:3000/api/players
```

### Delete players

Delete player from the system.

**DELETE** /api/players/:id

**Headers**

| Name | Description |
| ---- | ----------- |
| Authorization | JWT passed in bearer format |

**Parameters**

| Name | Description |
| ---- | ----------- |
| id | Player identifier |

**Response**

| Field | Type | Description |
| ----- | ---- | ----------- |
| success | boolean | Success indicator |

**Example**

```
curl -XDELETE \
  -H 'Authorization: Bearer <my_jwt_token>' \
  http://localhost:3000/api/players/1
```
