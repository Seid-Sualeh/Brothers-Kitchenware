import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api.js";
import style from "./Orders.module.css";

const money = (n) => `$${Number(n).toFixed(2)}`;
const formatPaymentMethod = (method) => {
  const normalized = String(method || "").toLowerCase();
  if (normalized === "cash") return "Simple Checkout";
  if (normalized === "mpesa") return "M-Pesa";
  if (normalized === "telebirr") return "Telebirr";
  return method || "Payment";
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [oRes, nRes] = await Promise.all([
          api.get("/api/orders/my"),
          api.get("/api/me/notifications").catch(() => ({ data: [] })),
        ]);
        if (!cancelled) {
          setOrders(Array.isArray(oRes.data) ? oRes.data : []);
          setNotes(Array.isArray(nRes.data) ? nRes.data : []);
        }
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <section className={style.container}>
        <div className={style.order_container}>
          <p>Loading orders…</p>
        </div>
      </section>
    );
  }

  return (
    <section className={style.container}>
      <div className={style.order_container}>
        <h2>Your orders</h2>

        {notes.filter((n) => !n.read_at && n.type === "payment_confirmed").length > 0 && (
          <div className="alert alert-success my-3" role="status">
            {notes
              .filter((n) => !n.read_at && n.type === "payment_confirmed")
              .map((n) => (
                <div key={n.id} className="mb-1">
                  {n.title}: {n.body}
                </div>
              ))}
          </div>
        )}

        {orders.length === 0 ? (
          <p className="text-muted py-4">You do not have any orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border-bottom py-4">
              <div className="d-flex flex-wrap justify-content-between gap-2 align-items-center mb-2">
                <strong>Order #{order.id}</strong>
                <span className="badge bg-secondary text-uppercase">{order.status}</span>
              </div>
              <p className="small text-muted mb-2">
                {new Date(order.created_at).toLocaleString()} · Total {money(order.total_amount)}
              </p>
              <p className="small text-muted mb-2">
                Payment: {formatPaymentMethod(order.payment_method)}
              </p>
              <ul className="list-unstyled small mb-0">
                {(order.items || []).map((line) => (
                  <li key={line.id || `${order.id}-${line.product_id}`} className="mb-1">
                    {line.product_name} × {line.quantity} @ {money(line.unit_price)}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}

        <p className="mt-4">
          <Link to="/shop">Continue shopping</Link>
        </p>
      </div>
    </section>
  );
};

export default Orders;
