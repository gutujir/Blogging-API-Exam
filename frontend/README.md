# Blogging Platform Frontend

A modern, responsive frontend for the Blogging API, built with React, Vite, and Tailwind CSS. This SPA allows users to read, write, and manage blogs, as well as handle authentication and account management.

---

## Features

- User signup, login, logout, and dashboard
- Blog creation, editing, publishing, and deletion
- Public blog listing and detail pages
- Responsive, mobile-friendly UI (Tailwind CSS)
- API integration with secure JWT cookies

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment variables:**
   - Create a `.env` file in the `frontend/` directory:
     ```env
     VITE_API_URL=http://localhost:3000/api
     ```
   - Set this to your backend API URL if deploying.
3. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ui/
│   ├── pages/
│   │   ├── auth/
│   │   ├── blogs/
│   │   └── dashboard/
│   ├── store/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
├── index.html
├── tailwind.config.js
├── vite.config.js
└── .env
```

---

## Environment Variables

| Variable     | Description                                               |
| ------------ | --------------------------------------------------------- |
| VITE_API_URL | Backend API base URL (default: http://localhost:3000/api) |

---

## Usage

1. **Sign up or log in** to create and manage your blogs.
2. **Create, edit, publish, or delete** blogs from your dashboard.
3. **Browse published blogs** on the home page or blog list.
4. **View blog details** and author info on the blog detail page.

---

## Deployment

1. **Build for production:**
   ```sh
   npm run build
   ```
2. **Preview production build:**
   ```sh
   npm run preview
   ```
3. **Deploy** the `dist/` folder to your preferred static hosting (e.g., Vercel, Netlify, Render static site, etc.).

---

## API Reference

This frontend expects the Blogging API backend to be running and accessible at the URL specified in `VITE_API_URL`.
See the [backend README](../backend/README.md) for full API documentation and endpoint details.

---

## License

This project is licensed under the ISC License.
