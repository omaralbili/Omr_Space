import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div className="p-10 text-center text-gray-400">...جاري التحميل</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
