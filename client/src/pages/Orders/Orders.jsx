import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api.js";
import CheckoutSteps from "../../components/ecommerce/CheckoutSteps.jsx";
import OrderStatusBadge from "../../components/ecommerce/OrderStatusBadge.jsx";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";

const formatPaymentMethod = (method) => {
  const normalized = String(method || "").toLowerCase();
  if (normalized === "cash") return "Pay on delivery";
  if (normalized === "mpesa") return "M-Pesa";
  if (normalized === "telebirr") return "Telebirr";
  return method || "Payment";
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const [oRes, nRes] = await Promise.all([
          api.get("/api/orders/my"),
          api.get("/api/me/notifications").catch(() => ({ data: [] })),
        ]);
        if (!cancelled) {
          setOrders(Array.isArray(oRes.data) ? oRes.data : []);
          setNotes(Array.isArray(nRes.data) ? nRes.data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setOrders([]);
          setError(
            err.response?.data?.error || "Could not load your orders.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const paymentNotes = notes.filter(
    (n) => !n.read_at && n.type === "payment_confirmed",
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <CheckoutSteps current="orders" />

        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Your orders
        </h1>
        <p className="text-gray-600 mb-8">
          Track purchases and payment status for {user?.email}
        </p>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#2d6a6a] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div
            className="p-4 rounded-xl bg-red-50 text-red-800 text-sm border border-red-100 mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        {!loading && paymentNotes.length > 0 && (
          <div
            className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-sm"
            role="status"
          >
            {paymentNotes.map((n) => (
              <p key={n.id} className="mb-1 last:mb-0">
                <strong>{n.title}:</strong> {n.body}
              </p>
            ))}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#eef6f4] flex items-center justify-center text-[#2d6a6a] mb-4">
              <FiPackage size={24} />
            </div>
            <p className="text-gray-600 mb-6">You have not placed any orders yet.</p>
            <Link
              to="/shop"
              className="inline-flex rounded-full bg-[#2d6a6a] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#245a5a] no-underline"
            >
              Start shopping
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm"
              >
                <div className="flex flex-wrap justify-between gap-3 items-start mb-3">
                  <div>
                    <h2 className="font-bold text-gray-900">
                      Order #{order.id}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                  <span>
                    Total{" "}
                    <strong className="text-gray-900">
                      <CurrencyFormat amount={order.total_amount} />
                    </strong>
                  </span>
                  <span>
                    Payment:{" "}
                    <strong className="text-gray-900">
                      {formatPaymentMethod(order.payment_method)}
                    </strong>
                  </span>
                </div>

                <ul className="space-y-2">
                  {(order.items || []).map((line) => (
                    <li
                      key={line.id || `${order.id}-${line.product_id}`}
                      className="flex justify-between gap-2 text-sm text-gray-700"
                    >
                      <span className="truncate">
                        {line.product_name} × {line.quantity}
                      </span>
                      <span className="font-medium text-gray-900 shrink-0">
                        <CurrencyFormat
                          amount={Number(line.unit_price) * line.quantity}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}

        {!loading && orders.length > 0 && (
          <p className="mt-8 text-center">
            <Link
              to="/shop"
              className="text-[#2d6a6a] font-semibold hover:underline"
            >
              Continue shopping
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Orders;
