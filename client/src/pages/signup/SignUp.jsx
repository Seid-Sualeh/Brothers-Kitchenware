import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import { showSuccessToast, showErrorToast } from "../../lib/toast.js";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

    if (!formData.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the terms and privacy policy.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
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
            <h1 className="card-title mb-5 h5">Create your account</h1>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form
            className="needs-validation mt-3"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="form-control"
                placeholder="Jane Doe"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
              <div className="invalid-feedback">Please enter your name.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <div className="invalid-feedback">
                Please enter a valid email.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="position-relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Create a password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="btn btn-sm btn-outline-secondary rounded-3xl position-absolute end-0 top-50 translate-middle-y me-2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{ zIndex: 2 }}
                >
                  {showPassword ? (
                    <IconEyeOff size={18} />
                  ) : (
                    <IconEye size={18} />
                  )}
                </button>
              </div>
              <div className="invalid-feedback">
                Please provide a password (min 6 characters).
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Repeat password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <div className="invalid-feedback">Passwords must match.</div>
            </div>

            <div className="mb-3 form-check">
              <input
                id="terms"
                name="agreeTerms"
                className="form-check-input"
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label className="form-check-label small" htmlFor="terms">
                I agree to the{" "}
                <Link to="/terms-policy" className="text-decoration-none">
                  terms and privacy
                </Link>
              </label>
              <div className="invalid-feedback">
                You must agree before continuing.
              </div>
            </div>

            <button
              className="btn btn-primary w-100 rounded-3xl"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <div className="text-center mt-3 small text-muted">
            Already have an account?{" "}
            <Link to="/signin" className="link-primary">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
