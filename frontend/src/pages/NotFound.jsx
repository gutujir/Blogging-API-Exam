import React from "react";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <h1 className="text-5xl font-bold text-blue-700 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">Page not found</p>
      <a href="/" className="text-blue-600 hover:underline">
        Go Home
      </a>
    </div>
  </div>
);

export default NotFound;
