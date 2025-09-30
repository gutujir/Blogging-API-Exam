import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

const LandingPage = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Container className="py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
        Welcome to Blogify
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
        Blogify is a modern, minimal, and professional blogging platform.
        Discover, read, and share insightful articles. Create your own blogs,
        manage your content, and connect with a community of readers and
        writers.
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <Link to="/auth/signup">
          <Button className="w-40">Get Started</Button>
        </Link>
        <Link to="/auth/login">
          <Button className="w-40 border-2 border-blue-700 text-blue-600 hover:bg-white hover:text-blue-500 font-bold transition-colors shadow-sm">
            Login
          </Button>
        </Link>
      </div>
      <div className="mt-8 text-gray-600 text-sm">
        <p>Or explore public blogs without an account:</p>
        <Link to="/blogs" className="text-blue-600 hover:underline">
          Browse Blogs
        </Link>
      </div>
      <div className="mt-12 text-gray-400 text-xs">
        <p>Navigation: Home | Blogs | Dashboard | Login | Sign Up</p>
        <p className="mt-2">
          Built with React, Zustand, Tailwind CSS, and Express.js
        </p>
      </div>
    </Container>
  </div>
);

export default LandingPage;
