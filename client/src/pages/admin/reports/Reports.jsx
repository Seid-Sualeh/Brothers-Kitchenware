import { useEffect, useState, useCallback } from "react";
import {
  IconArrowUp,
  IconArrowDown,
  IconReceipt,
  IconPackage,
  IconAlertCircle,
} from "@tabler/icons-react";
import { DashboardLayout } from "../../../components/dashboard/layout/DashboardLayout";
import { adminApi } from "../../../lib/adminApi.js";
import Loader from "../../../components/Loader/Loader";
import logo from "../../../asset/images/logo3.png";

const money = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [topPage, setTopPage] = useState(1);
  const itemsPerPage = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const [s, t] = await Promise.all([
        adminApi.get("/api/admin/analytics/summary"),
        adminApi.get("/api/admin/dashboard/top-products"),
      ]);
      setSummary(s.data);
      setTopProducts(Array.isArray(t.data) ? t.data : []);
      setTopPage(1);
    } catch (e) {
      setErr(e.response?.data?.error || "Could not load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const statCards = summary
    ? [
        {
          title: "Total revenue (completed)",
          value: money(summary.totalSales),
          changeType: "positive",
          icon: IconReceipt,
        },
        {
          title: "Total purchases",
          value: money(summary.totalPurchased),
          changeType: "positive",
          icon: IconPackage,
        },
        {
          title: "Total expenses",
          value: money(summary.totalExpenses),
          changeType: "negative",
          icon: IconAlertCircle,
        },
        {
          title: "Invoice due (pending)",
          value: money(summary.invoiceDue),
          changeType: "negative",
          icon: IconAlertCircle,
        },
      ]
    : [];

  const placeholder = logo;

  const displayedTop = topProducts.slice(
    (topPage - 1) * itemsPerPage,
    topPage * itemsPerPage,
  );
  const totalTopPages = Math.ceil(topProducts.length / itemsPerPage);

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
              <div className="d-flex justify-content-between align-items-center mb-4 admin-page-header">
                <div className="m-3">
                  <h1 className="fs-3 mt-3">Reports</h1>
                  <p className="mb-0">Financial metrics from the database</p>
                  {err && (
                    <div className="alert alert-warning mt-2 py-2 small">
                      {err}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary me-3 admin-btn-compact"
                  onClick={load}
                >
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
                    <p
                      className={`mb-0 small ${stat.changeType === "positive" ? "text-success" : "text-danger"}`}
                    >
                      {stat.changeType === "positive" ? (
                        <IconArrowUp size={14} className="me-1" />
                      ) : (
                        <IconArrowDown size={14} className="me-1" />
                      )}
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
                  <h3 className="fw-bold">
                    {money(summary.totalPaymentReturns)}
                  </h3>
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
                    {displayedTop.map((product) => (
                      <div
                        key={product.product_id}
                        className="list-group-item p-3 d-flex align-items-center"
                      >
                        <div className="me-3">
                          <img
                            src={product.product_image || placeholder}
                            alt=""
                            className="rounded"
                            style={{
                              width: 48,
                              height: 48,
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-0">{product.name}</h6>
                              <small className="text-secondary">
                                {product.units_sold} units sold
                              </small>
                            </div>
                            <div className="text-end">
                              <strong>{money(product.revenue)}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {displayedTop.length === 0 && (
                      <div className="text-muted small p-3">
                        No completed order lines yet.
                      </div>
                    )}
                  </div>
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

export default Reports;
