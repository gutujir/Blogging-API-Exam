import React from "react";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

const Home = ({ user }) => (
  <div className="flex min-h-screen items-center justify-center">
    <Container className="py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
        Welcome back, {user?.first_name || user?.email || "User"}!
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
        Manage your blogs, read new posts, and connect with the Blogify
        community.
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <Link to="/dashboard">
          <Button className="w-40">My Dashboard</Button>
        </Link>
        <Link to="/blogs">
          <Button className="w-40 border-2 border-blue-700 text-blue-800 hover:bg-white hover:text-blue-500 font-bold transition-colors">
            Browse Blogs
          </Button>
        </Link>
      </div>
      <div className="mt-12 text-gray-400 text-xs">
        <p>Navigation: Home | Blogs | Dashboard | Logout</p>
        <p className="mt-2">
          Built with React, Zustand, Tailwind CSS, and Express.js
        </p>
      </div>
    </Container>
  </div>
);

export default Home;
