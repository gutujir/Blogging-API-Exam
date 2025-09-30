import React from "react";
import BlogCard from "./BlogCard";

const BlogList = ({ blogs, search = "" }) => {
  if (!blogs || blogs.length === 0)
    return (
      <div className="text-center text-gray-500 py-10">No blogs found.</div>
    );

  let matchIndex = -1;
  let matchBlog = null;
  if (search) {
    const lower = search.toLowerCase();
    matchIndex = blogs.findIndex(
      (b) =>
        b.title?.toLowerCase().includes(lower) ||
        b.author?.first_name?.toLowerCase().includes(lower) ||
        b.author?.last_name?.toLowerCase().includes(lower) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(lower)))
    );
    if (matchIndex !== -1) {
      matchBlog = blogs[matchIndex];
    }
  }

  return (
    <div className="space-y-4">
      {matchBlog && <BlogCard blog={matchBlog} highlight={true} />}
      {blogs
        .filter((b, i) => !matchBlog || i !== matchIndex)
        .map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
    </div>
  );
};

export default BlogList;
