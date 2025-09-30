import { create } from "zustand";
import API from "../utils/axios";

export const useBlogStore = create((set) => ({
  blogs: [],
  blog: null,
  meta: null,
  loading: false,
  error: null,
  async fetchBlogs(params = {}) {
    set({ loading: true, error: null });
    try {
      let res;
      // If 'author' param is present, use /blogs/me/blogs for dashboard (my blogs)
      if (params.author) {
        const { page, state } = params;
        const query = [];
        if (page) query.push(`page=${page}`);
        if (state) query.push(`state=${state}`);
        const queryString = query.length ? `?${query.join("&")}` : "";
        res = await API.get(`/blogs/me/blogs${queryString}`);
      } else {
        res = await API.get("/blogs", { params });
      }
      set({
        blogs: res.data.blogs || res.data.blog || [],
        meta: res.data.meta || {
          page: res.data.page,
          pages: res.data.pages,
          total: res.data.total,
        },
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch blogs",
        loading: false,
      });
    }
  },
  async fetchBlog(id) {
    set({ loading: true, error: null });
    try {
      const res = await API.get(`/blogs/${id}`);
      set({ blog: res.data.blog, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch blog",
        loading: false,
      });
    }
  },
  async createBlog(data) {
    set({ loading: true, error: null });
    try {
      const res = await API.post("/blogs", data);
      set((state) => ({
        blogs: [res.data.blog, ...state.blogs],
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create blog",
        loading: false,
      });
      return false;
    }
  },
  async editBlog(id, data) {
    set({ loading: true, error: null });
    try {
      const res = await API.patch(`/blogs/${id}`, data);
      set((state) => ({
        blogs: state.blogs.map((b) => (b._id === id ? res.data.blog : b)),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to edit blog",
        loading: false,
      });
      return false;
    }
  },
  async publishBlog(id) {
    set({ loading: true, error: null });
    try {
      const res = await API.patch(`/blogs/${id}/publish`);
      set((state) => ({
        blogs: state.blogs.map((b) => (b._id === id ? res.data.blog : b)),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to publish blog",
        loading: false,
      });
      return false;
    }
  },
  async deleteBlog(id) {
    set({ loading: true, error: null });
    try {
      await API.delete(`/blogs/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((b) => b._id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to delete blog",
        loading: false,
      });
      return false;
    }
  },
}));
