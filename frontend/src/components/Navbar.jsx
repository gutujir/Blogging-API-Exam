import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "./ui/Button";

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Navigation links for reuse
  const navLinks = (
    <>
      <Link
        to="/blogs"
        className={
          location.pathname.startsWith("/blogs")
            ? "text-blue-600 font-semibold"
            : "text-gray-700 hover:text-blue-600"
        }
        onClick={() => setMenuOpen(false)}
      >
        Blogs
      </Link>
      {user ? (
        <>
          <Link
            to="/dashboard"
            className={
              location.pathname === "/dashboard"
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600"
            }
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/dashboard/myblogs"
            className={
              location.pathname === "/dashboard/myblogs"
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600"
            }
            onClick={() => setMenuOpen(false)}
          >
            My Blogs
          </Link>
          <Button
            onClick={() => {
              setMenuOpen(false);
              onLogout();
            }}
            className="ml-2"
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link
            to="/auth/login"
            className="text-gray-700 hover:text-blue-600 px-3 py-1 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: "2.25rem",
            }}
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="ml-0 md:ml-2 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors duration-150 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: "2.25rem",
              marginLeft: "0.5rem",
            }}
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav
      className="bg-white border-b shadow-sm sticky top-0 z-20"
      ref={menuRef}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link
          to={user ? "/" : "/"}
          onClick={(e) => {
            if (user && location.pathname === "/") {
              e.preventDefault();
            }
            setMenuOpen(false);
          }}
          className="text-xl font-bold text-blue-700 tracking-tight"
        >
          Blogify
        </Link>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">{navLinks}</div>
        {/* Mobile menu icon */}
        <button
          className="md:hidden flex items-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          <svg
            className="w-7 h-7 text-blue-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="md:hidden bg-white border-b px-4 py-3 flex flex-col gap-3 animate-fade-in absolute right-4 top-[64px] rounded-lg shadow-lg z-30 min-w-[150px]"
          style={{ width: "max-content", left: "auto" }}
        >
          {navLinks}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
