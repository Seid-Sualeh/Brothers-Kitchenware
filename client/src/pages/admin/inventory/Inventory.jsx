import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconFilter,
  IconFileTypeCsv,
  IconFileTypePdf,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { DashboardLayout } from "../../../components/dashboard/layout/DashboardLayout";
import { api } from "../../../lib/api";
import { adminApi } from "../../../lib/adminApi";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/products");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Unable to load inventory from the database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      String(product.name).toLowerCase().includes(term) ||
      String(product.category_slug).toLowerCase().includes(term) ||
      String(product.id).toLowerCase().includes(term)
    );
  });

  const formatCategory = (slug) =>
    String(slug || "")
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const formatPrice = (price) =>
    price === undefined || price === null
      ? "-"
      : `$${Number(price).toFixed(2)}`;

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }
    try {
      await adminApi.delete(`/api/admin/products/${productId}`);
      await fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError("Failed to delete product. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="m-3">
              <h1 className="fs-3 m-3">Inventory</h1>
              <p className="mb-0">Manage your product inventory</p>
            </div>
            <div>
              <Link to="/admin/create-product" className="btn btn-primary">
                Add Product
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div>
            <div className="d-flex gap-2 mb-3 flex-wrap justify-content-between">
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                style={{ maxWidth: 250 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary">
                  <IconFilter size={16} /> Filter
                </button>
                <button className="btn btn-outline-secondary">
                  <IconFileTypeCsv size={16} /> Excel
                </button>
                <button className="btn btn-outline-secondary">
                  <IconFileTypePdf size={16} /> PDF
                </button>
              </div>
            </div>
          </div>
          <div className="card table-responsive">
            <table className="table table-sm mb-0 text-nowrap table-hover">
              <thead className="table-light border-light">
                <tr>
                  <th>Image</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Reviews</th>
                  <th>Best Seller</th>
                  <th>Featured</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      Loading inventory...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="11" className="text-center text-danger py-4">
                      {error}
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="align-middle">
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={
                              product.image_url ||
                              "/assets/images/product-placeholder.png"
                            }
                            alt={product.name}
                            className="avatar avatar-md rounded"
                          />
                          <span className="d-none d-md-inline">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{formatCategory(product.category_slug)}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td>{product.stock_quantity ?? 0}</td>
                      <td>{product.rating ?? "-"}</td>
                      <td>{product.review_count ?? 0}</td>
                      <td>{product.is_best_seller ? "Yes" : "No"}</td>
                      <td>{product.is_featured ? "Yes" : "No"}</td>
                      <td>
                        <Link
                          to={`/admin/edit-product/${product.id}`}
                          className="me-2 text-body"
                          title="Edit Product"
                        >
                          <IconEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="btn btn-link text-danger p-0"
                          title="Delete Product"
                        >
                          <IconTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td className="border-bottom-0">
                    Showing {filteredProducts.length} products
                  </td>
                  <td colSpan="10" className="border-bottom-0">
                    <nav
                      aria-label="Page navigation"
                      className="d-flex justify-content-end"
                    >
                      <ul className="pagination mb-0">
                        <li className="page-item disabled">
                          <a className="page-link" href="#" tabIndex="-1">
                            Previous
                          </a>
                        </li>
                        <li className="page-item active">
                          <a className="page-link" href="#">
                            1
                          </a>
                        </li>
                       
                        <li className="page-item">
                          <a className="page-link" href="#">
                            2
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            Next
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <footer className="text-center py-2 mt-6 text-secondary ">
            <p className="mb-0">
              Copyright © 2026 InApp Inventory Dashboard. Developed by{" "}
              <a
                href="https://codescandy.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                CodesCandy
              </a>{" "}
              • Distributed by{" "}
              <a
                href="https://themewagon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                ThemeWagon
              </a>{" "}
            </p>
          </footer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
