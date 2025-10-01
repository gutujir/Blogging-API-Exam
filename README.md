# Blogging API & Frontend

> **Deployment Notice:**
>
> The app is deployed on [Render](https://render.com/). To check the deployed app visit [https://blogging-api-exam-frontend.onrender.com](https://blogging-api-exam-frontend.onrender.com) > **Resend email sending is limited on the deployed app:** Due to domain verification issues, you can only send emails to your own (verified) email address. For full email features, run locally or verify your domain with Resend.

A full-stack blogging platform built with Node.js, Express, MongoDB (Mongoose), and React (Vite). The backend provides a secure RESTful API for user authentication, blog management, and email verification using Resend. The frontend is a modern, responsive SPA for blog reading, writing, and user management.

---

## Features

### Backend (Node.js/Express)

- User authentication (signup, login, logout, JWT cookies)
- Email verification and password reset (Resend integration)
- Blog CRUD (create, edit, publish, delete, list, read count)
- Pagination, filtering, and search for blogs
- Secure route protection (JWT middleware)
- Professional test suite (Jest, Supertest, mongodb-memory-server)

### Frontend (React/Vite)

- User signup, login, and dashboard
- Blog creation, editing, publishing, and deletion
- Public blog listing and detail pages
- Responsive, modern UI (Tailwind CSS)

---

## Project Structure

```
Blogging-API-Exam/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── resend/
│   │   ├── routes/
│   │   └── utils/
│   ├── tests/
│   ├── package.json
│   ├── jest.config.js
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB (local or Atlas, or use in-memory for tests)

---

## Backend Setup

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd Blogging-API-Exam/backend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `backend/` directory:

   ```env
   PORT=3000
   MONGODB_URI=your mongodb connection string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   RESEND_API_KEY=your_resend_api_key
   ```

   - `RESEND_API_KEY`: Get from https://resend.com/
   - `RESEND_FROM_EMAIL`: Must be a verified sender in your Resend dashboard.

4. **Run the backend server:**

   ```sh
   npm run dev
   ```

   The server will start on `http://localhost:3000` by default.

5. **Run backend tests:**
   ```sh
   npm test
   ```

---

## Frontend Setup

1. **Navigate to the frontend directory:**

   ```sh
   cd ../frontend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `frontend/` directory:

   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Run the frontend app:**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## Resend Email Configuration

- **Sign up at [Resend](https://resend.com/)** and obtain your API key.
- **Add your sender email** in the Resend dashboard and verify it.
- \*\*Set `RESEND_API_KEY`in your backend `.env`.
- **Note:** On the deployed app (Render), Resend email sending is restricted due to domain verification issues. You can only send emails to your own (verified) email address. For full email functionality, use the app locally or ensure your domain is verified with Resend.

---

## API Endpoints

### Auth

- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Login
- `POST /api/auth/verify-email` — Verify email with code
- `POST /api/auth/resend-verification` — Resend verification email
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password-by-code` — Reset password
- `POST /api/auth/logout` — Logout
- `GET /api/auth/check-auth` — Check authentication

### Blogs

- `GET /api/blogs` — List published blogs
- `GET /api/blogs/:id` — Get single published blog
- `POST /api/blogs` — Create blog (auth required)
- `GET /api/blogs/me/blogs` — List my blogs (auth required)
- `GET /api/blogs/me/blogs/:id` — Get my blog by id (auth required)
- `PATCH /api/blogs/:id/publish` — Publish blog (auth required)
- `PATCH /api/blogs/:id` — Edit blog (auth required)
- `DELETE /api/blogs/:id` — Delete blog (auth required)

---

## Testing

- Backend: `npm test` (Jest, Supertest, in-memory MongoDB)
- Utilities, models, controllers, routes, and middleware are all covered.

---

## License

This project is licensed under the ISC License.

---

## Author

- Gutu Jirata Imana
- [Portfolio](https://gutu-portfolio-2.vercel.app/)

---

## Acknowledgements

- [Resend](https://resend.com/) for transactional email
- [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/)
- [Express](https://expressjs.com/), [React](https://react.dev/), [Vite](https://vitejs.dev/)
- [Jest](https://jestjs.io/), [Supertest](https://github.com/ladjs/supertest)
- [Tailwind CSS](https://tailwindcss.com/)
