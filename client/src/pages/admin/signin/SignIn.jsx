import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { adminApi } from "../../../lib/adminApi.js";

export default function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin/dashboard";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await adminApi.post("/api/admin/auth/login", { email, password });
      adminLogin(data.user, data.token);
      if (data.user.role === "employee") {
        navigate("/admin/inventory", { replace: true });
      } else {
        navigate(from === "/admin/signin" ? "/admin/dashboard" : from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div className="card shadow-sm" style={{ maxWidth: 420, width: "100%" }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none">
              <span className="fs-2 fw-bold font-serif text-dark">
                B<span className="text-success">K</span>
              </span>
            </Link>
            <h1 className="h5 mt-3 mb-0">Staff sign in</h1>
            <p className="text-muted small mt-2 mb-0">Admin and employee accounts only.</p>
          </div>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-semibold">Password</label>
              <div className="input-group">
                <input
                  type={show ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShow(!show)} aria-label="Toggle password">
                  {show ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-dark w-100 py-2" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="text-center text-muted small mt-4 mb-0">
            <Link to="/">Back to store</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
