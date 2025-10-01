import React, { useEffect, useState } from "react";
import { useBlogStore } from "../../store/blogs";
import { useAuthStore } from "../../store/auth";
import DashboardBlogList from "../../components/DashboardBlogList";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";

const MyBlog = () => {
  const { user } = useAuthStore();
  const { blogs, fetchBlogs, loading, error, meta } = useBlogStore();
  const [page, setPage] = useState(1);
  const [state, setState] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs({ author: user?._id, page, state });
    // eslint-disable-next-line
  }, [user, page, state]);

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Blogs</h1>
        <Button onClick={() => navigate("/dashboard/new")}>New Blog</Button>
      </div>
      <div className="flex gap-3 mb-4 items-center">
        <label className="text-sm">Filter by state:</label>
        <select
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <>
          <DashboardBlogList blogs={blogs} />
          <Pagination
            page={meta?.page || 1}
            pages={meta?.pages || 1}
            onPageChange={setPage}
          />
        </>
      )}
    </Container>
  );
};

export default MyBlog;
