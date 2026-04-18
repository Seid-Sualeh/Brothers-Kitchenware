import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api.js";

const PAYMENT_OPTIONS = [
  {
    value: "telebirr",
    label: "Telebirr",
    description: "Send a payment request to the customer's phone for confirmation.",
  },
  {
    value: "mpesa",
    label: "M-Pesa",
    description: "Trigger a phone confirmation flow before marking the order paid.",
  },
  {
    value: "cash",
    label: "Simple Checkout",
    description: "Place the order now and let the admin confirm payment manually.",
  },
];

export default function Payment() {
  const { user, loading: authLoading } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("telebirr");
  const [walletForm, setWalletForm] = useState({
    phoneNumber: "",
    fullName: "",
    pin: "",
  });
  const [pendingMobilePayment, setPendingMobilePayment] = useState(null);

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
      const trimmedPhone = walletForm.phoneNumber.trim();
      const trimmedName = walletForm.fullName.trim();
      const trimmedPin = walletForm.pin.trim();

      if (selectedMethod === "telebirr" || selectedMethod === "mpesa") {
        if (!trimmedPhone || !trimmedName || !trimmedPin) {
          throw new Error("phone number, full name, and PIN are required");
        }

        if (selectedMethod === "telebirr" && !/^09\d{8}$/.test(trimmedPhone)) {
          throw new Error("Telebirr phone number must start with 09 and be 10 digits.");
        }

        if (selectedMethod === "mpesa" && !/^07\d{8}$/.test(trimmedPhone)) {
          throw new Error("M-Pesa phone number must start with 07 and be 10 digits.");
        }
      }

      const items = cart.map((c) => ({
        product_id: c.id,
        quantity: c.quantity,
        unit_price: Number(c.price),
        name: c.name,
        image_url: c.image_url,
      }));
      const payload = {
        items,
        paymentMethod: selectedMethod,
      };

      if (selectedMethod === "telebirr" || selectedMethod === "mpesa") {
        payload.paymentDetails = {
          phoneNumber: trimmedPhone,
          fullName: trimmedName,
          pin: trimmedPin,
        };
      }

      const { data } = await api.post("/api/orders/checkout", payload);
      if (selectedMethod === "cash") {
        clearCart();
        setDone(true);
        setTimeout(() => navigate("/orders", { replace: true }), 1200);
      } else {
        setPendingMobilePayment({
          orderId: data.orderId,
          paymentMethod: selectedMethod,
          message:
            data.paymentAction?.message ||
            "A confirmation request has been sent to your phone.",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Checkout failed. Ensure MySQL is configured.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmMobilePayment = async () => {
    if (!pendingMobilePayment?.orderId) return;
    setSubmitting(true);
    setError("");
    try {
      await api.patch(`/api/orders/${pendingMobilePayment.orderId}/mobile-confirm`);
      clearCart();
      setDone(true);
      setPendingMobilePayment(null);
      setTimeout(() => navigate("/orders", { replace: true }), 1200);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Could not confirm your mobile wallet payment.",
      );
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
        Choose Telebirr, M-Pesa, or Simple Checkout. Mobile wallets send a request
        to the customer's phone, while Simple Checkout stays pending until an admin
        confirms payment.
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
        <div className="grid gap-3">
          {PAYMENT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`rounded-xl border p-4 cursor-pointer transition ${
                selectedMethod === option.value
                  ? "border-teal-600 bg-teal-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option.value}
                checked={selectedMethod === option.value}
                onChange={(e) => {
                  setSelectedMethod(e.target.value);
                  setPendingMobilePayment(null);
                }}
                className="mr-3"
              />
              <span className="font-semibold text-gray-900">{option.label}</span>
              <p className="mt-2 mb-0 text-sm text-gray-600">{option.description}</p>
            </label>
          ))}
        </div>

        {(selectedMethod === "telebirr" || selectedMethod === "mpesa") && !pendingMobilePayment && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedMethod === "telebirr" ? "Telebirr" : "M-Pesa"} payment form
            </h2>
            <input
              type="tel"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Enter your phone number"
              value={walletForm.phoneNumber}
              onChange={(e) =>
                setWalletForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
              }
            />
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Enter your full name"
              value={walletForm.fullName}
              onChange={(e) =>
                setWalletForm((prev) => ({ ...prev, fullName: e.target.value }))
              }
            />
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="PIN"
              value={walletForm.pin}
              onChange={(e) =>
                setWalletForm((prev) => ({ ...prev, pin: e.target.value }))
              }
            />
          </div>
        )}

        {pendingMobilePayment && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Confirm on your phone
            </h2>
            <p className="text-sm text-gray-700 mb-4">{pendingMobilePayment.message}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={confirmMobilePayment}
                disabled={submitting}
                className="rounded-xl bg-[#2a2a2a] text-white px-5 py-3 font-bold uppercase tracking-widest hover:bg-black disabled:opacity-60"
              >
                {submitting ? "Confirming…" : "I confirmed on my phone"}
              </button>
              <button
                type="button"
                onClick={() => setPendingMobilePayment(null)}
                disabled={submitting}
                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700"
              >
                Edit payment details
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || done || Boolean(pendingMobilePayment)}
          className="w-full rounded-xl bg-[#2a2a2a] text-white py-4 font-bold uppercase tracking-widest hover:bg-black disabled:opacity-60"
        >
          {submitting
            ? "Submitting…"
            : selectedMethod === "cash"
              ? "Place simple checkout order"
              : "Send payment request"}
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
