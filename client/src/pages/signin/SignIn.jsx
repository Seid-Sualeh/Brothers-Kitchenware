import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api.js";
import AuthPageLayout from "../../components/ecommerce/AuthPageLayout.jsx";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]/30 focus:border-[#2d6a6a]";

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
  const redirectMsg = location.state?.msg;

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
      setError(
        err.response?.data?.error || "Invalid credentials. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in to checkout, pay, and view your orders."
      footer={
        <>
          <p className="text-sm text-gray-600 mb-2">
            New here?{" "}
            <Link
              to="/signup"
              state={location.state}
              className="font-semibold text-[#2d6a6a] hover:underline"
            >
              Create an account
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Staff?{" "}
            <Link to="/admin/signin" className="text-[#2d6a6a] hover:underline">
              Admin sign in
            </Link>
          </p>
        </>
      }
    >
      {redirectMsg && (
        <div
          className="mb-5 p-3 rounded-xl bg-[#eef6f4] text-[#1a4d4d] text-sm border border-[#8fbab5]/40"
          role="status"
        >
          {redirectMsg}
        </div>
      )}

      {error && (
        <div
          className="mb-5 p-3 rounded-xl bg-red-50 text-red-800 text-sm border border-red-100"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={inputClass}
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className={inputClass}
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="remember"
            id="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="rounded border-gray-300 text-[#2d6a6a] focus:ring-[#2d6a6a]"
          />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-[#2a2a2a] text-white py-3.5 font-bold uppercase tracking-widest text-sm hover:bg-black disabled:opacity-60 transition-colors"
        >
          {isLoading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center mt-4 mb-0">
        <Link to="/terms-policy" className="text-sm text-gray-500 hover:text-[#2d6a6a]">
          Terms & policy
        </Link>
      </p>
    </AuthPageLayout>
  );
};

export default SignIn;
