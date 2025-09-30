import React from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { useBlogStore } from "../store/blogs";
import { useNavigate } from "react-router-dom";
import Spinner from "./ui/Spinner";
import { toast } from "react-hot-toast";

const DashboardBlogList = ({ blogs }) => {
  const { loading, deleteBlog, publishBlog } = useBlogStore();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const ok = await deleteBlog(id);
      if (ok) toast.success("Blog deleted");
    }
  };

  const handlePublish = async (id) => {
    const ok = await publishBlog(id);
    if (ok) toast.success("Blog published");
  };

  if (!blogs.length)
    return (
      <div className="text-center text-gray-500 py-10">No blogs found.</div>
    );

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <Card
          key={blog._id}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold text-blue-700">
                {blog.title}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded ml-2 ${
                  blog.state === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {blog.state}
              </span>
            </div>
            <div className="text-gray-500 text-xs mb-1">
              {blog.reading_time} • {blog.read_count} reads
            </div>
            <div className="text-gray-700 mb-1 line-clamp-2">
              {blog.description || blog.body?.slice(0, 120) + "..."}
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {blog.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-center md:flex-col md:items-end">
            <Button
              size="sm"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold"
              onClick={() => navigate(`/dashboard/edit/${blog._id}`)}
            >
              Edit
            </Button>
            {blog.state === "draft" && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handlePublish(blog._id)}
                disabled={loading}
              >
                {loading ? <Spinner className="inline-block mr-1" /> : null}
                Publish
              </Button>
            )}
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleDelete(blog._id)}
              disabled={loading}
            >
              {loading ? <Spinner className="inline-block mr-1" /> : null}Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardBlogList;
