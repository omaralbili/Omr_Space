import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Viewer from "./pages/Viewer";
import Share from "./pages/Share";
import { useAuthStore } from "./store/useAuthStore";

function WithNavbar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <Routes>
      <Route path="/" element={<WithNavbar><Home /></WithNavbar>} />
      <Route path="/login" element={<WithNavbar><Login /></WithNavbar>} />
      <Route path="/register" element={<WithNavbar><Register /></WithNavbar>} />

      <Route
        path="/dashboard"
        element={
          <WithNavbar>
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          </WithNavbar>
        }
      />
      <Route
        path="/editor/:id"
        element={
          <WithNavbar>
            <ProtectedRoute><Editor /></ProtectedRoute>
          </WithNavbar>
        }
      />
      <Route
        path="/share/:id"
        element={
          <WithNavbar>
            <ProtectedRoute><Share /></ProtectedRoute>
          </WithNavbar>
        }
      />

      {/* عرض المتحف بملء الشاشة - بدون Navbar */}
      <Route
        path="/gallery/:id"
        element={
          <ProtectedRoute>
            <Viewer />
          </ProtectedRoute>
        }
      />
      <Route path="/view/:slug" element={<Viewer isPublic />} />
    </Routes>
  );
}
