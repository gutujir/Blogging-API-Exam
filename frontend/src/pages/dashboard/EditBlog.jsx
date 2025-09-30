import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlogStore } from "../../store/blogs";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import { toast } from "react-hot-toast";

const EditBlog = () => {
  const { id } = useParams();
  const { blog, fetchBlog, editBlog, loading, error } = useBlogStore();
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    body: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlog(id);
  }, [id, fetchBlog]);

  useEffect(() => {
    if (blog && blog._id === id) {
      setForm({
        title: blog.title || "",
        description: blog.description || "",
        tags: blog.tags?.join(", ") || "",
        body: blog.body || "",
      });
    }
  }, [blog, id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const ok = await editBlog(id, data);
    if (ok) {
      toast.success("Blog updated!");
      navigate("/dashboard");
    }
  };

  if (loading && !blog)
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-2xl p-6">
        <div className="flex items-center mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            aria-label="Go back"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">Edit Blog</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            label="Tags (comma separated)"
            name="tags"
            value={form.tags}
            onChange={handleChange}
          />
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Body
            </label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              required
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold"
          >
            {loading ? <Spinner className="inline-block mr-2" /> : null}Update
            Blog
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default EditBlog;
