import React, { useEffect, useMemo } from "react";
import { useAuthStore } from "../../store/auth";
import { useBlogStore } from "../../store/blogs";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";

const Dashboard = () => {
  const { user } = useAuthStore();
  const { blogs, fetchBlogs, loading } = useBlogStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      fetchBlogs({ author: user._id, page: 1 });
    }
    // eslint-disable-next-line
  }, [user]);

  // Compute stats
  const stats = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter((b) => b.state === "published").length;
    const drafts = blogs.filter((b) => b.state === "draft").length;
    const latest = [...blogs]
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 3);
    return { total, published, drafts, latest };
  }, [blogs]);

  return (
    <Container className="py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white rounded shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">
              Welcome, {user?.first_name} {user?.last_name}
            </div>
            <div className="text-gray-600 text-sm mt-1">
              Email: {user?.email}
            </div>
            {user?.lastLogin && (
              <div className="text-gray-500 text-xs mt-1">
                Last login: {new Date(user.lastLogin).toLocaleString()}
              </div>
            )}
          </div>
          <Button onClick={() => navigate("/dashboard/myblogs")}>
            My Blogs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded p-4 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-gray-600">Total Blogs</div>
        </div>
        <div className="bg-green-50 rounded p-4 text-center">
          <div className="text-2xl font-bold">{stats.published}</div>
          <div className="text-gray-600">Published</div>
        </div>
        <div className="bg-yellow-50 rounded p-4 text-center">
          <div className="text-2xl font-bold">{stats.drafts}</div>
          <div className="text-gray-600">Drafts</div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Latest Blogs</h2>
        {loading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : stats.latest.length === 0 ? (
          <div className="text-gray-500 text-center">No blogs yet.</div>
        ) : (
          <ul className="divide-y">
            {stats.latest.map((blog) => (
              <li key={blog._id} className="py-3">
                <div className="font-semibold text-lg">{blog.title}</div>
                <div className="text-gray-600 text-sm mb-1">
                  State:{" "}
                  <span
                    className={
                      blog.state === "published"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {blog.state}
                  </span>
                  {" | "}Updated: {new Date(blog.updated_at).toLocaleString()}
                </div>
                <div className="text-gray-500 text-xs line-clamp-2">
                  {blog.description || blog.body?.slice(0, 100) + "..."}
                </div>
                <Button
                  className="mt-2"
                  size="sm"
                  onClick={() => navigate(`/dashboard/edit/${blog._id}`)}
                >
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/myblogs")}
        >
          View All My Blogs
        </Button>
      </div>
    </Container>
  );
};

export default Dashboard;
