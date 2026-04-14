import { useEffect, useState, useCallback } from "react";
import {
  IconReportAnalytics,
  IconRepeat,
  IconCurrencyDollar,
  IconNotes,
  IconLayersSubtract,
  IconCreditCard,
  IconCashBanknote,
  IconArrowUpLeft,
  IconCalendar,
} from "@tabler/icons-react";
import { adminApi } from "../../../lib/adminApi.js";
import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";
import { DashboardLayout } from "../../../components/dashboard/layout/DashboardLayout";

const money = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const statusClass = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "completed") return "success";
  if (s === "processing") return "primary";
  if (s === "pending") return "warning";
  if (s === "cancelled") return "danger";
  return "secondary";
};

const Dashboard = () => {
  const { isAdmin } = useAdminAuth();
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [err, setErr] = useState("");
  const [period, setPeriod] = useState("all");

  const load = useCallback(async (selectedPeriod = "all") => {
    setErr("");
    try {
      const [s, r, t, l] = await Promise.all([
        adminApi.get("/api/admin/analytics/summary"),
        adminApi.get(
          `/api/admin/dashboard/recent-sales?period=${selectedPeriod}`,
        ),
        adminApi.get("/api/admin/dashboard/top-products"),
        adminApi.get("/api/admin/dashboard/low-stock"),
      ]);
      setSummary(s.data);
      setRecent(Array.isArray(r.data) ? r.data : []);
      setTopProducts(Array.isArray(t.data) ? t.data : []);
      setLowStock(Array.isArray(l.data) ? l.data : []);
    } catch (e) {
      setErr(
        e.response?.data?.error ||
          "Could not load dashboard. Is the database running?",
      );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await load();
    };
    fetchData();
  }, [load]);

  const confirmPayment = async (orderId) => {
    try {
      await adminApi.patch(`/api/admin/orders/${orderId}/confirm`);
      await load();
    } catch (e) {
      alert(e.response?.data?.error || "Confirm failed");
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    load(newPeriod);
  };

  const cancelPayment = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await adminApi.patch(`/api/admin/orders/${orderId}/cancel`);
      await load();
    } catch (e) {
      alert(e.response?.data?.error || "Cancel failed");
    }
  };

  const stats = summary
    ? [
        {
          title: "Total Sales",
          value: money(summary.totalSales),
          icon: IconReportAnalytics,
          color: "primary",
        },
        {
          title: "Total Purchase",
          value: money(summary.totalPurchased),
          icon: IconRepeat,
          color: "success",
        },
        {
          title: "Total Expenses",
          value: money(summary.totalExpenses),
          icon: IconCurrencyDollar,
          color: "info",
        },
        {
          title: "Invoice Due",
          value: money(summary.invoiceDue),
          icon: IconNotes,
          color: "warning",
        },
      ]
    : [];

  const profitCards = summary
    ? [
        {
          title: "Total Profit",
          value: money(summary.totalProfit),
          icon: IconLayersSubtract,
          color: "primary",
        },
        {
          title: "Total Payment Returns",
          value: money(summary.totalPaymentReturns),
          icon: IconCreditCard,
          color: "danger",
        },
        {
          title: "Total Expenses",
          value: money(summary.totalExpenses),
          icon: IconCashBanknote,
          color: "warning",
        },
      ]
    : [];

  const placeholderImg = "https://placehold.co/64x64/e2e8e0/1e293b?text=BK";

  return (
    <DashboardLayout>
      <div className="row">
        <div className="col-12">
          <div className="m-5">
            <h1 className="fs-3 mt-5">Dashboard</h1>
            <p className="text-muted">Live metrics from your database.</p>
            {err && <div className="alert alert-warning">{err}</div>}
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        {stats.map((stat, index) => (
          <div key={index} className="col-lg-3 col-12">
            <div
              className={`card p-4 bg-${stat.color} bg-opacity-10 border border-${stat.color} border-opacity-25 rounded-2`}
            >
              <div className="d-flex gap-3">
                <div
                  className={`icon-shape icon-md bg-${stat.color} text-white rounded-2`}
                >
                  <stat.icon size={20} />
                </div>
                <div>
                  <h2 className="mb-3 fs-6">{stat.title}</h2>
                  <h3 className="fw-bold mb-0">{stat.value}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-3">
        {profitCards.map((card, index) => (
          <div key={index} className="col-lg-4 col-12">
            <div className="card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between border-bottom pb-4 mb-3">
                  <div>
                    <h3 className="fw-bold h4">{card.value}</h3>
                    <span>{card.title}</span>
                  </div>
                  <div>
                    <card.icon
                      size={40}
                      className={`text-${card.color || "primary"}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center bg-transparent px-4 py-3">
              <h3 className="h5 mb-0">Sales vs Purchase</h3>
            </div>
            <div className="card-body p-4">
              <div className="text-center text-muted py-5 small">
                {summary
                  ? `Completed sales ${money(summary.totalSales)} vs purchases ${money(summary.totalPurchased)}`
                  : "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header bg-transparent px-4 py-3">
              <h3 className="h5 mb-0">Overall Information</h3>
            </div>
            <div className="card-body p-4">
              <div className="row text-center border-top pt-4">
                <div className="col-4 border-end">
                  <h3 className="fw-bold mb-2">{recent.length}</h3>
                  <small className="text-secondary">
                    Recent orders (window)
                  </small>
                </div>
                <div className="col-4 border-end">
                  <h3 className="fw-bold mb-2">{topProducts.length}</h3>
                  <small className="text-secondary">Top SKUs tracked</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold mb-2">{lowStock.length}</h3>
                  <small className="text-secondary">Low stock alerts</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
              <h4 className="mb-0 h5">Top Selling Products</h4>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
              >
                <IconCalendar size={14} /> Completed orders
              </button>
            </div>
            <ul className="list-group list-group-flush">
              {topProducts.map((product) => (
                <li
                  key={product.product_id}
                  className="list-group-item d-flex align-items-center gap-3"
                >
                  <img
                    src={product.product_image || placeholderImg}
                    className="rounded"
                    width="48"
                    height="48"
                    alt=""
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1">{product.name}</p>
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <small className="fw-semibold">
                        {money(product.revenue)}
                      </small>
                      <small>•</small>
                      <small>{product.units_sold} units</small>
                    </div>
                  </div>
                </li>
              ))}
              {topProducts.length === 0 && (
                <li className="list-group-item text-muted small">
                  No completed sales yet.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
              <h4 className="mb-0 h5">Low Stock Products</h4>
            </div>
            <ul className="list-group list-group-flush">
              {lowStock.map((product) => (
                <li
                  key={product.id}
                  className="list-group-item d-flex align-items-center gap-3"
                >
                  <img
                    src={product.image_url || placeholderImg}
                    className="rounded"
                    width="48"
                    height="48"
                    alt=""
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1">{product.name}</p>
                    <small>ID #{product.id}</small>
                  </div>
                  <div className="d-flex flex-column gap-0 align-items-center">
                    <span className="fw-semibold text-primary">
                      {product.stock_quantity}
                    </span>
                    <small className="text-muted">In stock</small>
                  </div>
                </li>
              ))}
              {lowStock.length === 0 && (
                <li className="list-group-item text-muted small">
                  No low-stock rows (or stock column missing).
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
              <h4 className="mb-0 h5">Recent Sales</h4>
              <select
                className="form-select form-select-sm"
                style={{ width: "auto" }}
                value={period}
                onChange={(e) => handlePeriodChange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <ul className="list-group list-group-flush">
              {recent.map((sale) => (
                <li
                  key={sale.id}
                  className="list-group-item d-flex align-items-center gap-3 flex-wrap"
                >
                  <img
                    src={sale.product_image || placeholderImg}
                    className="rounded"
                    width="48"
                    height="48"
                    alt=""
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1">
                      {sale.product_name || `Order #${sale.id}`}
                    </p>
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <small className="fw-semibold">
                        {sale.customer_name || sale.customer_email}
                      </small>
                      <small>•</small>
                      <small>{money(sale.total_amount)}</small>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-end gap-1">
                    <span
                      className={`badge bg-${statusClass(sale.status)}-subtle text-${statusClass(sale.status)}`}
                    >
                      {sale.status}
                    </span>
                    {isAdmin &&
                      String(sale.status).toLowerCase() === "processing" && (
                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => confirmPayment(sale.id)}
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => cancelPayment(sale.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                  </div>
                </li>
              ))}
              {recent.length === 0 && (
                <li className="list-group-item text-muted small">
                  No orders yet. Checkouts appear here.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <footer className="text-center py-2 mt-6 text-secondary">
            <p className="mb-0 small">BK Kitchenware — admin dashboard</p>
          </footer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
