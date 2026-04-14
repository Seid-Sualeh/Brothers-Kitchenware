import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api.js";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });
      login(data.user, data.token);
      const to = location.state?.redirect || "/";
      navigate(to, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid credentials. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card" style={{ maxWidth: 420, width: "100%" }}>
        <div className="card-body p-5">
          <div className="text-center mb-3">
            <Link to="/" className="mb-4 d-inline-block">
              <span className="text-3xl font-serif font-black text-gray-900 tracking-tighter">
                B<span className="text-teal-600">K</span>
              </span>
            </Link>
            <h1 className="card-title mb-5 h5">Sign in to your account</h1>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="input-group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>
            <div className="mb-4 form-check">
              <input
                type="checkbox"
                name="remember"
                className="form-check-input"
                id="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="remember">
                Remember me
              </label>
            </div>
            <button type="submit" className="btn btn-dark w-100 py-2" disabled={isLoading}>
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="text-center text-muted mt-4 mb-0 small">
            Staff? <Link to="/admin/signin">Admin / employee sign in</Link>
          </p>
          <p className="text-center mt-2 mb-0">
            <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
