# Blogging API Backend

A robust RESTful API for a blogging platform, built with Node.js, Express, and MongoDB. Features include user authentication, email verification (Resend), blog CRUD, and secure JWT-based route protection.

---

## Table of Contents

- [Features](#features)
- [Setup & Configuration](#setup--configuration)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing Endpoints with Postman](#testing-endpoints-with-postman)
- [Running Tests](#running-tests)
- [License](#license)

---

## Features

- User registration, login, logout, JWT authentication
- Email verification and password reset (Resend integration)
- Blog CRUD (create, edit, publish, delete, list, read count)
- Pagination, filtering, and search for blogs
- Secure route protection (JWT middleware)
- Professional test suite (Jest, Supertest, mongodb-memory-server)

---

## Setup & Configuration

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Create a `.env` file:**
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   RESEND_API_KEY=your_resend_api_key
   ```
   - Get `RESEND_API_KEY` and verify your sender at [Resend](https://resend.com/).
3. **Start the server:**
   ```sh
   npm run dev
   ```
   The API will be available at `http://localhost:3000`.

---

## Environment Variables

| Variable       | Description                            |
| -------------- | -------------------------------------- |
| PORT           | Port to run the server (default: 3000) |
| MONGODB_URI    | MongoDB connection string              |
| JWT_SECRET     | Secret for JWT signing                 |
| CLIENT_URL     | Allowed frontend URL for CORS/cookies  |
| RESEND_API_KEY | API key from Resend                    |

---

## API Endpoints

### Auth

#### Register (Signup)

- **POST** `/api/auth/signup`
  - Body:
    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
  - Response: `{ success, message, user }`

#### Login

- **POST** `/api/auth/login`
  - Body:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
  - Response: `{ success, message, user }` (sets JWT cookie)

#### Verify Email

- **POST** `/api/auth/verify-email`
  - Body:
    ```json
    { "verificationCode": "123456" }
    ```
  - Response: `{ success, message, user }`

#### Resend Verification

- **POST** `/api/auth/resend-verification`
  - Body:
    ```json
    { "email": "john@example.com" }
    ```

#### Forgot Password

- **POST** `/api/auth/forgot-password`
  - Body:
    ```json
    { "email": "john@example.com" }
    ```

#### Reset Password by Code

- **POST** `/api/auth/reset-password-by-code`
  - Body:
    ```json
    {
      "email": "john@example.com",
      "code": "123456",
      "newPassword": "newpassword123"
    }
    ```

#### Logout

- **POST** `/api/auth/logout`

#### Check Auth

- **GET** `/api/auth/check-auth` (requires JWT cookie)

---

### Blogs

#### List Published Blogs

- **GET** `/api/blogs`
  - Query params: `page`, `limit`, `author`, `title`, `tags`, `order_by`, `order`

#### Get Single Published Blog

- **GET** `/api/blogs/:id`

#### Create Blog

- **POST** `/api/blogs` (requires JWT cookie)
  - Body:
    ```json
    {
      "title": "My First Blog",
      "description": "A short description",
      "tags": ["tech", "life"],
      "body": "This is the content of the blog."
    }
    ```

#### Get My Blogs

- **GET** `/api/blogs/me/blogs` (requires JWT cookie)

#### Get My Blog by ID

- **GET** `/api/blogs/me/blogs/:id` (requires JWT cookie)

#### Publish Blog

- **PATCH** `/api/blogs/:id/publish` (requires JWT cookie)

#### Edit Blog

- **PATCH** `/api/blogs/:id` (requires JWT cookie)
  - Body: (any of the blog fields)

#### Delete Blog

- **DELETE** `/api/blogs/:id` (requires JWT cookie)

---

## Testing Endpoints with Postman

1. **Import Endpoints:**
   - Use the above endpoint documentation to create requests in Postman.
2. **Set Base URL:**
   - `http://localhost:3000`
3. **Authentication:**
   - After login/signup, JWT is set as an HTTP-only cookie. For protected routes, ensure cookies are enabled in Postman ("Send Cookies" option).
4. **Example: Register User**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/signup`
   - Body (JSON):
     ```json
     {
       "first_name": "Jane",
       "last_name": "Smith",
       "email": "jane@example.com",
       "password": "password123"
     }
     ```
   - Send the request. You should receive a success response and a verification email (if Resend is configured).
5. **Example: Create Blog**
   - Login first to set the JWT cookie.
   - Method: `POST`
   - URL: `http://localhost:3000/api/blogs`
   - Body (JSON):
     ```json
     {
       "title": "My Blog Post",
       "description": "A blog about testing.",
       "tags": ["test", "api"],
       "body": "This is the blog content."
     }
     ```
   - Send the request. You should receive a success response with the created blog.

---

## Running Tests

- Run all backend tests:
  ```sh
  npm test
  ```
- Tests cover controllers, routes, models, middleware, and utilities.

---

## License

This project is licensed under the ISC License.
