import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api.js";

export default function Payment() {
  const { user, loading: authLoading } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/signin", { state: { msg: "Sign in to complete checkout", redirect: "/payment" }, replace: true });
      return;
    }
    if (!cart.length) {
      navigate("/cart", { replace: true });
    }
  }, [user, authLoading, cart.length, navigate]);

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const items = cart.map((c) => ({
        product_id: c.id,
        quantity: c.quantity,
        unit_price: Number(c.price),
        name: c.name,
        image_url: c.image_url,
      }));
      await api.post("/api/orders/checkout", { items });
      clearCart();
      setDone(true);
      setTimeout(() => navigate("/orders", { replace: true }), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Checkout failed. Ensure MySQL is configured.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user || !cart.length) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="spinner-border text-secondary" role="status" />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-600 mb-6">
        Proceeding will place your order as <strong>processing</strong>. An admin will confirm payment; you will
        receive a notification when it is <strong>completed</strong>.
      </p>

      <div className="border border-gray-100 rounded-xl p-6 bg-gray-50 mb-6">
        <p className="text-sm text-gray-700 mb-1">
          Logged in as <strong>{user.email}</strong>
        </p>
        <p className="text-lg font-bold text-gray-900">Total due: ${totalPrice.toFixed(2)}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}
      {done && (
        <div className="mb-4 p-3 bg-teal-50 text-teal-900 rounded-lg text-sm" role="status">
          Order placed. Redirecting to your orders…
        </div>
      )}

      <form onSubmit={placeOrder} className="space-y-4">
        <button
          type="submit"
          disabled={submitting || done}
          className="w-full rounded-xl bg-[#2a2a2a] text-white py-4 font-bold uppercase tracking-widest hover:bg-black disabled:opacity-60"
        >
          {submitting ? "Placing order…" : "Proceed to checkout"}
        </button>
        <div className="text-center">
          <Link to="/cart" className="text-sm text-teal-700 hover:underline">
            Back to cart
          </Link>
        </div>
      </form>
    </div>
  );
}
