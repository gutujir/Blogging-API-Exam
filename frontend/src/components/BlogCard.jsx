import React from "react";
import { Link } from "react-router-dom";
import Card from "./ui/Card";

const BlogCard = ({ blog, highlight }) => (
  <Card
    className={`mb-6 hover:shadow-lg transition-shadow ${
      highlight ? "ring-4 ring-yellow-400 bg-yellow-50 animate-pulse" : ""
    }`}
  >
    <Link to={`/blogs/${blog._id}`} className="block">
      <h2
        className={`text-xl font-semibold mb-1 ${
          highlight ? "text-yellow-700" : "text-blue-700"
        }`}
      >
        {blog.title}
      </h2>
      <div
        className={`text-xs mb-2 ${
          highlight ? "text-yellow-800" : "text-gray-500"
        }`}
      >
        By {blog.author?.first_name || "Unknown"} • {blog.reading_time} •{" "}
        {blog.read_count} reads
      </div>
      <p
        className={`mb-2 line-clamp-2 ${
          highlight ? "text-yellow-900" : "text-gray-700"
        }`}
      >
        {blog.description || blog.body?.slice(0, 120) + "..."}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {blog.tags?.map((tag, i) => (
          <span
            key={i}
            className={
              highlight
                ? "bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs"
                : "bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
            }
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  </Card>
);

export default BlogCard;
