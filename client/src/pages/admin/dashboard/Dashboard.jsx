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
  IconBell,
  IconAlertCircle,
} from "@tabler/icons-react";
import { adminApi } from "../../../lib/adminApi.js";
import logo from "../../../asset/images/logo3.png";
import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";
import { useSocket } from "../../../context/SocketContext.jsx";
import { DashboardLayout } from "../../../components/dashboard/layout/DashboardLayout";
import Loader from "../../../components/Loader/Loader";

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
  const { isConnected } = useSocket();
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [err, setErr] = useState("");
  const [period, setPeriod] = useState("all");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [recentPage, setRecentPage] = useState(1);
  const [topPage, setTopPage] = useState(1);
  const [lowPage, setLowPage] = useState(1);
  const itemsPerPage = 10;

  // Handle real-time notifications
  useEffect(() => {
    const handleOrderProcessing = (event) => {
      const data = event.detail;
      const message = `New order #${data.orderId} is processing (${data.paymentMethod})`;
      setNotifications((prev) => [
        ...prev,
        { type: "order_processing", message, time: new Date() },
      ]);
      setErr(""); // Clear any previous errors when new data arrives
    };

    const handleOrderCompleted = (event) => {
      const data = event.detail;
      const message = `Order #${data.orderId} has been completed`;
      setNotifications((prev) => [
        ...prev,
        { type: "order_completed", message, time: new Date() },
      ]);
      // Refresh data when order status changes
      load();
    };

    const handleInventoryAlert = (event) => {
      const data = event.detail;
      const message = `Low stock alert: ${data.productName} (${data.stockQuantity} remaining)`;
      setNotifications((prev) => [
        ...prev,
        { type: "inventory_alert", message, time: new Date() },
      ]);
      // Refresh low stock data
      load();
    };

    window.addEventListener("socket:order:processing", handleOrderProcessing);
    window.addEventListener("socket:order:completed", handleOrderCompleted);
    window.addEventListener("socket:inventory:alert", handleInventoryAlert);

    return () => {
      window.removeEventListener(
        "socket:order:processing",
        handleOrderProcessing,
      );
      window.removeEventListener(
        "socket:order:completed",
        handleOrderCompleted,
      );
      window.removeEventListener(
        "socket:inventory:alert",
        handleInventoryAlert,
      );
    };
  }, []);

  const load = useCallback(async (selectedPeriod = "all") => {
    setLoading(true);
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
      setRecentPage(1);
      setTopPage(1);
      setLowPage(1);
    } catch (e) {
      setErr(
        e.response?.data?.error ||
          "Could not load dashboard. Is the database running?",
      );
    } finally {
      setLoading(false);
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

  const connectionStatus = isConnected ? "Connected" : "Disconnected";
  const connectionColor = isConnected ? "success" : "danger";

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

  const placeholderImg = logo;

  const displayedRecent = recent.slice(
    (recentPage - 1) * itemsPerPage,
    recentPage * itemsPerPage,
  );
  const totalRecentPages = Math.ceil(recent.length / itemsPerPage);

  const displayedTop = topProducts.slice(
    (topPage - 1) * itemsPerPage,
    topPage * itemsPerPage,
  );
  const totalTopPages = Math.ceil(topProducts.length / itemsPerPage);

  const displayedLow = lowStock.slice(
    (lowPage - 1) * itemsPerPage,
    lowPage * itemsPerPage,
  );
  const totalLowPages = Math.ceil(lowStock.length / itemsPerPage);

  return (
    <DashboardLayout>
      {loading ? (
        <div className="py-20">
          <Loader />
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-12">
              <div className="m-5">
                <div className="d-flex justify-content-between align-items-center admin-page-header">
                  <div>
                    <h1 className="fs-3 mt-5">Dashboard</h1>
                    <p className="text-muted">
                      Live metrics from your database.
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className={`badge bg-${connectionColor}-subtle text-${connectionColor}`}
                    >
                      <IconBell size={14} className="me-1" />
                      {connectionStatus}
                    </span>
                    {notifications.length > 0 && (
                      <span className="badge bg-primary-subtle text-primary">
                        {notifications.length} notifications
                      </span>
                    )}
                  </div>
                </div>
                {err && <div className="alert alert-warning">{err}</div>}

                {/* Real-time notifications */}
                {notifications.length > 0 && (
                  <div className="mt-3">
                    <div
                      className="alert alert-info alert-dismissible fade show"
                      role="alert"
                    >
                      <div className="d-flex flex-column gap-2">
                        {notifications.slice(-3).map((notification, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center gap-2"
                          >
                            <IconAlertCircle size={16} />
                            <span>{notification.message}</span>
                            <small className="text-muted ms-auto">
                              {notification.time.toLocaleTimeString()}
                            </small>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setNotifications([])}
                        aria-label="Close"
                      ></button>
                    </div>
                  </div>
                )}
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
                  {displayedTop.map((product) => (
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
                  {displayedTop.length === 0 && (
                    <li className="list-group-item text-muted small">
                      No completed sales yet.
                    </li>
                  )}
                </ul>
                {totalTopPages > 1 && (
                  <div className="card-footer bg-white px-4 py-3">
                    <nav>
                      <ul className="pagination pagination-sm mb-0 justify-content-center admin-pagination-compact">
                        <li
                          className={`page-item ${topPage === 1 ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setTopPage(topPage - 1)}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from(
                          { length: totalTopPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <li
                            key={page}
                            className={`page-item ${page === topPage ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setTopPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${topPage === totalTopPages ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setTopPage(topPage + 1)}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
                  <h4 className="mb-0 h5">Low Stock Products</h4>
                </div>
                <ul className="list-group list-group-flush">
                  {displayedLow.map((product) => (
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
                  {displayedLow.length === 0 && (
                    <li className="list-group-item text-muted small">
                      No low-stock rows (or stock column missing).
                    </li>
                  )}
                </ul>
                {totalLowPages > 1 && (
                  <div className="card-footer bg-white px-4 py-3">
                    <nav>
                      <ul className="pagination pagination-sm mb-0 justify-content-center admin-pagination-compact">
                        <li
                          className={`page-item ${lowPage === 1 ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setLowPage(lowPage - 1)}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from(
                          { length: totalLowPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <li
                            key={page}
                            className={`page-item ${page === lowPage ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setLowPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${lowPage === totalLowPages ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setLowPage(lowPage + 1)}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
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
                  {displayedRecent.map((sale) => (
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
                          String(sale.status).toLowerCase() ===
                            "processing" && (
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
                  {displayedRecent.length === 0 && (
                    <li className="list-group-item text-muted small">
                      No orders yet. Checkouts appear here.
                    </li>
                  )}
                </ul>
                {totalRecentPages > 1 && (
                  <div className="card-footer bg-white px-4 py-3">
                    <nav>
                      <ul className="pagination pagination-sm mb-0 justify-content-center admin-pagination-compact">
                        <li
                          className={`page-item ${recentPage === 1 ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setRecentPage(recentPage - 1)}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from(
                          { length: totalRecentPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <li
                            key={page}
                            className={`page-item ${page === recentPage ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setRecentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${recentPage === totalRecentPages ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setRecentPage(recentPage + 1)}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <footer className="text-center py-2 mt-6 text-secondary ">
                <p className="mb-0">
                  Copyright © Brother&apos;s Kitchenware{" "}
                  {new Date().getFullYear()}. All rights reserved.
                </p>
              </footer>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
