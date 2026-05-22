import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiLock, FiShield } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api.js";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";

const BRANDS = {
  telebirr: {
    name: "Telebirr",
    gradient: "from-[#1a9e4a] via-[#2ecc71] to-[#27ae60]",
    accent: "#1a9e4a",
    logoBg: "bg-white/20",
    chip: "Secure Telebirr checkout",
  },
  mpesa: {
    name: "M-Pesa",
    gradient: "from-[#00a651] via-[#4cd964] to-[#e4002b]",
    accent: "#00a651",
    logoBg: "bg-white/20",
    chip: "Secure M-Pesa Lipa Na M-PESA",
  },
};

export default function WalletPayment() {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { clearCart } = useCart();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const brand = BRANDS[provider] || BRANDS.telebirr;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/signin", {
        state: {
          msg: "Sign in to complete wallet payment",
          redirect: `/payment/wallet/${provider}?orderId=${orderId}`,
        },
        replace: true,
      });
      return;
    }
    if (!orderId || !BRANDS[provider]) {
      navigate("/payment", { replace: true });
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/api/orders/${orderId}/wallet-session`);
        if (cancelled) return;
        if (data.alreadyCompleted) {
          clearCart();
          navigate("/orders", { replace: true });
          return;
        }
        if (String(data.provider) !== provider) {
          navigate(`/payment/wallet/${data.provider}?orderId=${orderId}`, {
            replace: true,
          });
          return;
        }
        setSession(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.error || "Could not load payment session.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, orderId, provider, navigate, clearCart]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError("Enter your wallet PIN to authorize payment.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post(`/api/orders/${orderId}/wallet-pay`, {
        pin: pin.trim(),
      });
      setSuccess(true);
      clearCart();
      setSession((s) =>
        s
          ? {
              ...s,
              remainingBalance: data.remainingBalance,
              amountPaid: data.amountPaid,
            }
          : s,
      );
      setTimeout(() => navigate("/orders", { replace: true }), 2200);
    } catch (err) {
      setError(err.response?.data?.error || "Payment could not be completed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Connecting to {brand.name}…</p>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            to="/payment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 hover:underline"
          >
            <FiArrowLeft /> Back to checkout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div
        className={`bg-gradient-to-r ${brand.gradient} text-white px-4 py-5 sm:px-8 shadow-md`}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl ${brand.logoBg} flex items-center justify-center font-black text-lg`}
            >
              {provider === "telebirr" ? "T" : "M"}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest opacity-90">
                {brand.chip}
              </p>
              <h1 className="text-xl font-bold">{brand.name}</h1>
            </div>
          </div>
          <FiShield size={28} className="opacity-80 shrink-0" />
        </div>
      </div>

      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg">
          {success ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-emerald-100">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                ✓
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Payment successful
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Order #{orderId} has been paid. Redirecting to your orders…
              </p>
              {session?.remainingBalance != null && (
                <p className="text-sm text-emerald-700 font-medium">
                  New balance: ETB {session.remainingBalance.toFixed(2)}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/80">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Pay to merchant
                </p>
                <p className="font-bold text-gray-900 text-lg">
                  {session?.merchantName}
                </p>
                <p className="text-3xl font-black text-gray-900 mt-3">
                  <CurrencyFormat amount={session?.amount} />{" "}
                  <span className="text-base font-semibold text-gray-500">
                    {session?.currency || "ETB"}
                  </span>
                </p>
              </div>

              <div className="px-6 py-4 space-y-3 text-sm border-b border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">From wallet</span>
                  <span className="font-semibold text-gray-900">
                    {session?.maskedPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account name</span>
                  <span className="font-medium text-gray-900">
                    {session?.payerName}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                  <span className="text-gray-500">Available balance</span>
                  <span
                    className={`font-bold text-lg ${
                      session?.availableBalance >= session?.amount
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    ETB {Number(session?.availableBalance || 0).toFixed(2)}
                  </span>
                </div>
                {session?.availableBalance < session?.amount && (
                  <p className="text-red-600 text-xs bg-red-50 rounded-lg p-2.5">
                    Insufficient balance. Top up your {brand.name} wallet or use
                    another payment method.
                  </p>
                )}
              </div>

              <form onSubmit={handlePay} className="p-6">
                {error && (
                  <div
                    className="mb-4 p-3 rounded-xl bg-red-50 text-red-800 text-sm border border-red-100"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {session?.demoHint && (
                  <p className="mb-4 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    Demo mode: {session.demoHint}
                  </p>
                )}

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiLock className="inline mr-1 -mt-0.5" size={14} />
                  Enter {brand.name} PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="off"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full text-center text-2xl tracking-[0.5em] rounded-xl border-2 border-gray-200 py-4 focus:outline-none focus:border-[#2d6a6a] focus:ring-2 focus:ring-[#2d6a6a]/20"
                />

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !pin ||
                    session?.availableBalance < session?.amount
                  }
                  className="w-full mt-5 rounded-xl py-4 font-bold text-white uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  style={{ backgroundColor: brand.accent }}
                >
                  {submitting ? "Authorizing…" : `Pay ETB ${Number(session?.amount || 0).toFixed(2)}`}
                </button>

                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <FiShield size={12} /> Encrypted connection · You will not be
                  charged twice
                </p>
              </form>
            </div>
          )}

          {!success && (
            <Link
              to="/payment"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft size={16} /> Cancel and return to checkout
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
