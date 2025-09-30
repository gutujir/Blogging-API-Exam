import React, { useState } from "react";
import { useBlogStore } from "../../store/blogs";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import { toast } from "react-hot-toast";

const BlogEditor = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    body: "",
  });
  const { createBlog, loading, error } = useBlogStore();
  const navigate = useNavigate();

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
    const success = await createBlog(data);
    if (success) {
      toast.success("Blog created!");
      navigate("/dashboard");
    }
  };

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
          <h1 className="text-2xl font-bold text-center flex-1">New Blog</h1>
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
            {loading ? <Spinner className="inline-block mr-2" /> : null}Create
            Blog
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BlogEditor;
