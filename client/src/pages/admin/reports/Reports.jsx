import { useEffect, useState, useCallback } from "react";
import { IconArrowUp, IconArrowDown, IconReceipt, IconPackage, IconAlertCircle } from "@tabler/icons-react";
import { DashboardLayout } from "../../../components/dashboard/layout/DashboardLayout";
import { adminApi } from "../../../lib/adminApi.js";

const money = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setErr("");
    try {
      const [s, t] = await Promise.all([
        adminApi.get("/api/admin/analytics/summary"),
        adminApi.get("/api/admin/dashboard/top-products"),
      ]);
      setSummary(s.data);
      setTopProducts(Array.isArray(t.data) ? t.data : []);
    } catch (e) {
      setErr(e.response?.data?.error || "Could not load reports.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const statCards = summary
    ? [
        { title: "Total revenue (completed)", value: money(summary.totalSales), changeType: "positive", icon: IconReceipt },
        { title: "Total purchases", value: money(summary.totalPurchased), changeType: "positive", icon: IconPackage },
        { title: "Total expenses", value: money(summary.totalExpenses), changeType: "negative", icon: IconAlertCircle },
        { title: "Invoice due (pending)", value: money(summary.invoiceDue), changeType: "negative", icon: IconAlertCircle },
      ]
    : [];

  const placeholder = "https://placehold.co/48x48/e2e8e0/1e293b?text=BK";

  return (
    <DashboardLayout>
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="m-3">
              <h1 className="fs-3 mt-3">Reports</h1>
              <p className="mb-0">Financial metrics from the database</p>
              {err && <div className="alert alert-warning mt-2 py-2 small">{err}</div>}
            </div>
            <button type="button" className="btn btn-sm btn-outline-primary me-3" onClick={load}>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        {statCards.map((stat, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-3">
            <div className="card h-100">
              <div className="card-body p-4">
                <h6 className="mb-4">{stat.title}</h6>
                <h3 className="mb-1 fw-bold">{stat.value}</h3>
                <p className={`mb-0 small ${stat.changeType === "positive" ? "text-success" : "text-danger"}`}>
                  {stat.changeType === "positive" ? <IconArrowUp size={14} className="me-1" /> : <IconArrowDown size={14} className="me-1" />}
                  Live data
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {summary && (
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <div className="card p-4">
              <h6 className="text-muted">Total profit</h6>
              <h3 className="fw-bold">{money(summary.totalProfit)}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4">
              <h6 className="text-muted">Payment returns</h6>
              <h3 className="fw-bold">{money(summary.totalPaymentReturns)}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4">
              <h6 className="text-muted">Expenses (detail)</h6>
              <h3 className="fw-bold">{money(summary.totalExpenses)}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="mb-3 fs-5">Top products (completed orders)</h2>
              <div className="list-group list-group-flush">
                {topProducts.map((product) => (
                  <div key={product.product_id} className="list-group-item p-3 d-flex align-items-center">
                    <div className="me-3">
                      <img
                        src={product.product_image || placeholder}
                        alt=""
                        className="rounded"
                        style={{ width: 48, height: 48, objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">{product.name}</h6>
                          <small className="text-secondary">{product.units_sold} units sold</small>
                        </div>
                        <div className="text-end">
                          <strong>{money(product.revenue)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {topProducts.length === 0 && <div className="text-muted small p-3">No completed order lines yet.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
