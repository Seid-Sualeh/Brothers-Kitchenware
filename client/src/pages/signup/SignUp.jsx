import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api.js";
import { showSuccessToast } from "../../lib/toast.js";
import logo from "../../asset/images/logo3.png";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]/30 focus:border-[#2d6a6a]";

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
      showSuccessToast("Account created successfully.");
      const to = location.state?.redirect || "/";
      navigate(to, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Link to="/" className="inline-flex items-center justify-center" aria-label="Go to homepage">
              <img src={logo} alt="Brothers Home Goods logo" width="80" height="40" />
            </Link>
          </div>
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Join Brothers Kitchenware to checkout and track orders.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
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
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className={inputClass}
            placeholder="Jane Doe"
            required
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={inputClass}
            placeholder="name@example.com"
            required
            value={formData.email}
            onChange={handleChange}
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
              placeholder="Min. 6 characters"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={inputClass}
            placeholder="Repeat password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            id="terms"
            name="agreeTerms"
            type="checkbox"
            required
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="mt-1 rounded border-gray-300 text-[#2d6a6a] focus:ring-[#2d6a6a]"
          />
          <span className="text-sm text-gray-600">
            I agree to the{" "}
            <Link to="/terms-policy" className="text-[#2d6a6a] font-medium hover:underline">
              terms & privacy policy
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#2a2a2a] text-white py-3.5 font-bold uppercase tracking-widest text-sm hover:bg-black disabled:opacity-60 transition-colors"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>

    <div className="mt-6 text-center text-sm text-gray-600">
      <p>
        Already have an account? <Link to="/signin" state={location.state} className="font-semibold text-[#2d6a6a] hover:underline">Sign in</Link>
      </p>
    </div>
  </div>
</main>
</div>
  );
};

export default SignUp;
