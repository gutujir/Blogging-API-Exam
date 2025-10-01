import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import BlogListPage from "./pages/blogs/BlogListPage";
import BlogDetailPage from "./pages/blogs/BlogDetailPage";
import Dashboard from "./pages/dashboard/Dashboard";
import MyBlog from "./pages/dashboard/MyBlog";
import BlogEditor from "./pages/dashboard/BlogEditor";
import EditBlog from "./pages/dashboard/EditBlog";
import NotFound from "./pages/NotFound";
import { useAuthStore } from "./store/auth";

const App = () => {
  const { user, checkAuth, logout } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={logout} />
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={user ? <Home user={user} /> : <LandingPage />}
            />
            <Route path="/blogs" element={<BlogListPage />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />
            <Route
              path="/auth/login"
              element={user ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/auth/signup"
              element={user ? <Navigate to="/dashboard" /> : <Signup />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/auth/login" />}
            />
            <Route
              path="/dashboard/myblogs"
              element={user ? <MyBlog /> : <Navigate to="/auth/login" />}
            />
            <Route
              path="/dashboard/new"
              element={user ? <BlogEditor /> : <Navigate to="/auth/login" />}
            />
            <Route
              path="/dashboard/edit/:id"
              element={user ? <EditBlog /> : <Navigate to="/auth/login" />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
};

export default App;
