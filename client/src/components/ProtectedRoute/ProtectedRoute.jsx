import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, msg, redirect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const redirectTo =
    redirect || `${location.pathname}${location.search}`;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin", { state: { msg, redirect: redirectTo } });
    }
  }, [user, loading, navigate, msg, redirectTo]);

  if (loading || !user) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-50 py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
