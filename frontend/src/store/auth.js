import { create } from "zustand";
import API from "../utils/axios";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  async login(email, password) {
    set({ loading: true, error: null });
    try {
      const res = await API.post("/auth/login", { email, password });
      set({ user: res.data.user, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Login failed",
        loading: false,
      });
      return false;
    }
  },
  async signup(data) {
    set({ loading: true, error: null });
    try {
      const res = await API.post("/auth/signup", data);
      set({ user: res.data.user, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Signup failed",
        loading: false,
      });
      return false;
    }
  },
  async logout() {
    set({ loading: true, error: null });
    try {
      await API.post("/auth/logout");
      set({ user: null, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Logout failed",
        loading: false,
      });
    }
  },
  async checkAuth() {
    set({ loading: true });
    try {
      const res = await API.get("/auth/check-auth");
      set({ user: res.data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));
