import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiExternalLink } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api.js";
import CheckoutSteps from "../../components/ecommerce/CheckoutSteps.jsx";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";

const PAYMENT_OPTIONS = [
  {
    value: "telebirr",
    label: "Telebirr",
    description:
      "You will be redirected to Telebirr to enter your PIN and pay if your balance is sufficient.",
    badge: "09xxxxxxxx",
  },
  {
    value: "mpesa",
    label: "M-Pesa",
    description:
      "You will be redirected to M-Pesa to authorize payment from your mobile wallet.",
    badge: "07xxxxxxxx",
  },
  {
    value: "cash",
    label: "Pay on delivery",
    description: "Place your order now. Our team will confirm payment manually.",
  },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]/30 focus:border-[#2d6a6a]";

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
  });

  useEffect(() => {
    if (user?.name) {
      setWalletForm((p) =>
        p.fullName ? p : { ...p, fullName: user.name },
      );
    }
  }, [user?.name]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/signin", {
        state: { msg: "Sign in to complete checkout", redirect: "/payment" },
        replace: true,
      });
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

      if (selectedMethod === "telebirr" || selectedMethod === "mpesa") {
        if (!trimmedPhone || !trimmedName) {
          throw new Error("Phone number and full name are required.");
        }
        if (selectedMethod === "telebirr" && !/^09\d{8}$/.test(trimmedPhone)) {
          throw new Error("Telebirr number must start with 09 and be 10 digits.");
        }
        if (selectedMethod === "mpesa" && !/^07\d{8}$/.test(trimmedPhone)) {
          throw new Error("M-Pesa number must start with 07 and be 10 digits.");
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
        };
      }

      const { data } = await api.post("/api/orders/checkout", payload);

      if (selectedMethod === "cash") {
        clearCart();
        setDone(true);
        setTimeout(() => navigate("/orders", { replace: true }), 1500);
      } else {
        const redirectUrl =
          data.paymentAction?.url ||
          `/payment/wallet/${selectedMethod}?orderId=${data.orderId}`;
        navigate(redirectUrl, { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Checkout failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user || !cart.length) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#FAF9F6]">
        <div className="w-8 h-8 border-2 border-[#2d6a6a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <CheckoutSteps current="checkout" />

        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Checkout
        </h1>
        <p className="text-gray-600 mb-8">
          Secure checkout for <strong>{user.email}</strong>
        </p>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {error && (
              <div
                className="mb-5 p-4 rounded-xl bg-red-50 text-red-800 text-sm border border-red-100"
                role="alert"
              >
                {error}
              </div>
            )}
            {done && (
              <div
                className="mb-5 p-4 rounded-xl bg-emerald-50 text-emerald-900 text-sm border border-emerald-100 flex items-center gap-2"
                role="status"
              >
                <FiCheckCircle size={20} />
                Order placed successfully. Redirecting to your orders…
              </div>
            )}

            <form onSubmit={placeOrder} className="space-y-5">
              <div className="grid gap-3">
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`block rounded-2xl border p-4 cursor-pointer transition ${
                      selectedMethod === option.value
                        ? "border-[#2d6a6a] bg-white ring-1 ring-[#2d6a6a]/20"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.value}
                        checked={selectedMethod === option.value}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="mt-1 text-[#2d6a6a] focus:ring-[#2d6a6a]"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {option.label}
                          </span>
                          {option.badge && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              {option.badge}
                            </span>
                          )}
                          {(option.value === "telebirr" ||
                            option.value === "mpesa") && (
                            <FiExternalLink
                              size={14}
                              className="text-[#2d6a6a]"
                              aria-hidden
                            />
                          )}
                        </div>
                        <p className="mt-1 mb-0 text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {(selectedMethod === "telebirr" || selectedMethod === "mpesa") && (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4 shadow-sm">
                  <h2 className="font-semibold text-gray-900">
                    Link your {selectedMethod === "telebirr" ? "Telebirr" : "M-Pesa"}{" "}
                    wallet
                  </h2>
                  <p className="text-sm text-gray-500 -mt-2">
                    Next step: secure redirect to enter PIN and confirm payment
                    (like card checkout on international stores).
                  </p>
                  <input
                    type="tel"
                    className={inputClass}
                    placeholder={
                      selectedMethod === "telebirr"
                        ? "09xxxxxxxx"
                        : "07xxxxxxxx"
                    }
                    value={walletForm.phoneNumber}
                    onChange={(e) =>
                      setWalletForm((p) => ({
                        ...p,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Full name on wallet account"
                    value={walletForm.fullName}
                    onChange={(e) =>
                      setWalletForm((p) => ({ ...p, fullName: e.target.value }))
                    }
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || done}
                className="w-full rounded-xl bg-[#2a2a2a] text-white py-3.5 font-bold uppercase tracking-widest text-sm hover:bg-black disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2"
              >
                {submitting
                  ? "Processing…"
                  : selectedMethod === "cash"
                    ? "Place order"
                    : `Continue to ${selectedMethod === "telebirr" ? "Telebirr" : "M-Pesa"}`}
              </button>
            </form>

            <Link
              to="/cart"
              className="inline-block mt-4 text-sm text-[#2d6a6a] font-medium hover:underline"
            >
              ← Back to cart
            </Link>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                Your order
              </h2>
              <ul className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <li key={item.id} className="flex gap-3 text-sm">
                    <div className="w-14 h-14 rounded-lg bg-[#FAF9F6] overflow-hidden shrink-0">
                      <img
                        src={item.image_url}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-gray-500">Qty {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900 shrink-0">
                      <CurrencyFormat amount={item.price * item.quantity} />
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-gray-200 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>
                  <CurrencyFormat amount={totalPrice} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
