import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

/**
 * @param {('admin'|'employee')[]} roles - allowed roles. Default ['admin'] only.
 */
export default function AdminProtectedRoute({ children, roles = ["admin"] }) {
  const { staff, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (!staff) {
    return <Navigate to="/admin/signin" state={{ from: location.pathname }} replace />;
  }

  if (!roles.includes(staff.role)) {
    if (staff.role === "employee") {
      return <Navigate to="/admin/inventory" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
