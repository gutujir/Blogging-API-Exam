import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "./ui/Button";

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link
          to={user ? "/" : "/"}
          onClick={(e) => {
            if (user && location.pathname === "/") {
              e.preventDefault();
            }
          }}
          className="text-xl font-bold text-blue-700 tracking-tight"
        >
          Blogify
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/blogs"
            className={
              location.pathname.startsWith("/blogs")
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Blogs
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={
                  location.pathname.startsWith("/dashboard")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }
              >
                Dashboard
              </Link>
              <Button onClick={onLogout} className="ml-2">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="ml-2 text-gray-700 hover:text-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
