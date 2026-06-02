# Project Context — Split Auth Service

## Overview

A production-grade Node.js REST API for user authentication. Handles user registration and login with JWT-based token authentication. Tokens are persisted to the database with a 24-hour expiry window.

---

## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Runtime      | Node.js                           |
| Framework    | Express.js v5                     |
| Database     | MongoDB (via Mongoose v9)         |
| Auth         | JWT (`jsonwebtoken`)              |
| Hashing      | bcryptjs (salt rounds: 10)        |
| Env Config   | dotenv                            |
| Dev Server   | nodemon                           |

---

## Project Structure

```
split/
├── server.js                          # Entry point — loads env, starts HTTP server
├── package.json
├── context.md                         # This file
│
└── src/
    ├── app.js                         # Express app setup — middleware, routes
    │
    ├── config/
    │   └── db.js                      # MongoDB connection (exits process on failure)
    │
    ├── models/
    │   └── User.js                    # Mongoose User schema
    │
    ├── routes/
    │   └── authRoutes.js              # Route declarations → controller methods
    │
    ├── controllers/
    │   └── authController.js          # Thin: validate → call service → send response
    │
    ├── services/
    │   └── authService.js             # Business logic: DB queries, hashing, token save
    │
    ├── validations/
    │   └── authValidation.js          # Pure field-level validation rules
    │
    ├── utils/
    │   ├── responseHelper.js          # sendSuccess / sendError — standard response shape
    │   └── tokenHelper.js             # generateToken / getTokenExpiry (24h)
    │
    └── middleware/
        └── authMiddleware.js          # JWT guard — reads x-auth-token header
```

---

## Architecture — Layer Responsibilities

```
Request
   │
   ▼
authRoutes.js          → maps HTTP verb + path to controller method
   │
   ▼
authController.js      → 1. run validation
                         2. call service
                         3. send standardized response
   │
   ▼
authValidation.js      → collects ALL field errors before returning (no fail-fast)
   │
   ▼
authService.js         → DB access, bcrypt, token generation, token persistence
   │
   ├── User.js         → Mongoose model
   ├── tokenHelper.js  → JWT sign + expiry date
   └── responseHelper.js → sendSuccess / sendError
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/split
JWT_SECRET=your_super_secret_key
```

| Variable    | Description                              |
|-------------|------------------------------------------|
| `PORT`      | HTTP server port (default: 5000)         |
| `MONGO_URI` | MongoDB connection string                |
| `JWT_SECRET`| Secret key used to sign JWT tokens       |

---

## Running the Project

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server starts at: `http://localhost:5000`

---

## API Endpoints

Base URL: `/api/auth`

---

### POST `/api/auth/register`

Creates a new user account, generates a 24h JWT token, saves it to the database.

**Request Body**

```json
{
  "userName": "JohnDoe",
  "emailId": "john@example.com",
  "password": "Secret@123",
  "address": "123 Main St"
}
```

| Field      | Type   | Required | Rules                                               |
|------------|--------|----------|-----------------------------------------------------|
| `userName` | string | Yes      | 2–30 chars, letters/numbers/spaces/underscores only |
| `emailId`  | string | Yes      | Valid email format, stored lowercase                |
| `password` | string | Yes      | Min 8 chars, uppercase, lowercase, number, special  |
| `address`  | string | No       | Free text, stored trimmed                           |

**Success Response — 201**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Account created successfully",
  "errors": [],
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "userName": "JohnDoe",
      "emailId": "john@example.com",
      "address": "123 Main St",
      "createdAt": "2026-05-28T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenExpiry": "2026-05-29T10:00:00.000Z"
  }
}
```

**Error — 422 Validation Failed**

```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    { "field": "userName", "message": "userName must be at least 2 characters" },
    { "field": "password", "message": "password must contain at least one uppercase letter" },
    { "field": "password", "message": "password must contain at least one special character (@$!%*?&)" }
  ],
  "data": null
}
```

**Error — 409 Email Already Exists**

```json
{
  "success": false,
  "statusCode": 409,
  "message": "An account with this email already exists",
  "errors": [{ "field": "emailId", "message": "An account with this email already exists" }],
  "data": null
}
```

---

### POST `/api/auth/login`

Authenticates an existing user, refreshes the 24h JWT token in the database.

**Request Body**

```json
{
  "emailId": "john@example.com",
  "password": "Secret@123"
}
```

| Field      | Type   | Required |
|------------|--------|----------|
| `emailId`  | string | Yes      |
| `password` | string | Yes      |

**Success Response — 200**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "errors": [],
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "userName": "JohnDoe",
      "emailId": "john@example.com",
      "address": "123 Main St"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenExpiry": "2026-05-29T10:00:00.000Z"
  }
}
```

**Error — 401 Invalid Credentials**

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid email or password",
  "errors": [],
  "data": null
}
```

---

## Standard Response Envelope

Every API response — success or error — follows this shape:

```json
{
  "success":    true | false,
  "statusCode": <HTTP status code>,
  "message":    "<human-readable summary>",
  "errors":     [ { "field": "<fieldName>", "message": "<reason>" } ],
  "data":       { } | null
}
```

| HTTP Code | Meaning                        |
|-----------|-------------------------------|
| 200       | OK — login success             |
| 201       | Created — register success     |
| 400       | Bad Request — missing fields   |
| 401       | Unauthorized — wrong credentials |
| 409       | Conflict — email already exists |
| 422       | Unprocessable — validation failed |
| 500       | Internal Server Error          |

---

## User Model

Collection: `users`

| Field        | Type   | Required | Notes                              |
|--------------|--------|----------|------------------------------------|
| `name`       | String | Yes      | Mapped from `userName` in request  |
| `email`      | String | Yes      | Unique, stored lowercase           |
| `password`   | String | Yes      | bcrypt hash (10 salt rounds)       |
| `address`    | String | No       | Free text                          |
| `date`       | Date   | —        | Auto-set to `Date.now` on create   |
| `awsToken`   | String | —        | Current active JWT, default `null` |
| `tokenExpiry`| Date   | —        | Token expiry timestamp, default `null` |

---

## Authentication Middleware

File: `src/middleware/authMiddleware.js`

Protects routes by verifying the JWT in the `x-auth-token` request header.

**Usage on a protected route:**

```js
const auth = require('../middleware/authMiddleware');

router.get('/profile', auth, profileController.getProfile);
```

**How it works:**
1. Reads token from `req.header('x-auth-token')`
2. Returns `401` if token is missing
3. Verifies token against `JWT_SECRET`
4. Attaches `req.user = { id, email }` on success
5. Returns `401` if token is invalid or expired

---

## Token Lifecycle

```
Register / Login
      │
      ▼
generateToken(payload)     → JWT signed with JWT_SECRET, expires in 24h
      │
      ▼
user.awsToken = token      → saved to MongoDB
user.tokenExpiry = Date    → 24h from now, saved to MongoDB
      │
      ▼
Token returned in response → client stores it, sends via x-auth-token header
      │
      ▼
Each new login             → token rotated (old token overwritten in DB)
```

---

## Validation Rules — Register

| Field      | Rule                        | Error Message                                                          |
|------------|-----------------------------|------------------------------------------------------------------------|
| `userName` | Required                    | userName is required                                                   |
| `userName` | Min 2 chars                 | userName must be at least 2 characters                                 |
| `userName` | Max 30 chars                | userName must not exceed 30 characters                                 |
| `userName` | Alphanumeric/space/_        | userName can only contain letters, numbers, spaces, and underscores    |
| `emailId`  | Required                    | emailId is required                                                    |
| `emailId`  | Valid email format          | Please provide a valid email address                                   |
| `password` | Required                    | password is required                                                   |
| `password` | Min 8 chars                 | password must be at least 8 characters                                 |
| `password` | Uppercase letter            | password must contain at least one uppercase letter                    |
| `password` | Lowercase letter            | password must contain at least one lowercase letter                    |
| `password` | Number                      | password must contain at least one number                              |
| `password` | Special char `@$!%*?&#`     | password must contain at least one special character (@$!%*?&)         |

All validation errors are collected and returned together (not fail-fast).

---

## Dependencies

```json
{
  "bcryptjs":     "^3.0.3",
  "cors":         "^2.8.6",
  "dotenv":       "^17.4.2",
  "express":      "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose":     "^9.5.0"
}
```

Dev:
```json
{
  "nodemon": "^3.1.14"
}
```
