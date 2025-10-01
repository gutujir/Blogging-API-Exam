import React, { useEffect, useState } from "react";
import { useBlogStore } from "../../store/blogs";
// import { useAuthStore } from "../../store/auth";
import BlogList from "../../components/BlogList";
import Container from "../../components/ui/Container";
import Spinner from "../../components/ui/Spinner";
import Pagination from "../../components/Pagination";

const BlogListPage = () => {
  const { blogs, fetchBlogs, loading, error, meta } = useBlogStore();
  // const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    fetchBlogs({
      page,
      search,
      orderBy,
      order,
    });
    // eslint-disable-next-line
  }, [page, search, orderBy, order]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs({ page: 1, search, orderBy, order });
  };

  return (
    <Container className="py-8">
      {/* User info card removed as per request */}
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h1>
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-3 mb-6 justify-center items-center"
      >
        <input
          type="text"
          placeholder="Search by title, author, or tag"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
        <select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Order By</option>
          <option value="read_count">Read Count</option>
          <option value="reading_time">Reading Time</option>
          <option value="created_at">Date</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Search
        </button>
      </form>
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <>
          <BlogList blogs={blogs} search={search} />
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

export default BlogListPage;
