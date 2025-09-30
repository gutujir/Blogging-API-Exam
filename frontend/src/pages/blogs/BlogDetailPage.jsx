import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBlogStore } from "../../store/blogs";
import Container from "../../components/ui/Container";
import Spinner from "../../components/ui/Spinner";
import { formatDate } from "../../utils/helpers";

const BlogDetailPage = () => {
  const { id } = useParams();
  const { blog, fetchBlog, loading, error } = useBlogStore();

  useEffect(() => {
    fetchBlog(id);
  }, [id, fetchBlog]);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!blog) return null;

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <div className="text-gray-500 text-sm mb-4">
        By {blog.author?.first_name || "Unknown"} •{" "}
        {formatDate(blog.created_at)} • {blog.reading_time} • {blog.read_count}{" "}
        reads
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {blog.tags?.map((tag, i) => (
          <span
            key={i}
            className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.body.replace(/\n/g, "<br/>") }}
      />
    </Container>
  );
};

export default BlogDetailPage;
