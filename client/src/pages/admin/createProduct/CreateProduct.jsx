import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import { DashboardLayout } from "../../../components/dashboard/layout/DashboardLayout";
import { adminApi } from "../../../lib/adminApi.js";
import { STORE_CATEGORIES } from "../../../constants/storeCategories.js";

const defaultCategoryOptions = [
  { value: "", label: "Select category" },
  ...STORE_CATEGORIES.map((category) => ({
    value: category.slug,
    label: category.label,
  })),
];

const CreateProduct = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const [categories, setCategories] = useState(defaultCategoryOptions);
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productStock: "",
    productCategory: "",
    productImageUrl: "",
    productDescription: "",
    productBestSeller: false,
    productFeatured: false,
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await adminApi.get("/api/categories");
        const options = Array.isArray(data)
          ? data.map((cat) => ({ value: cat.slug, label: cat.name }))
          : [];
        setCategories([...defaultCategoryOptions, ...options]);
      } catch (error) {
        console.warn("Failed to load categories:", error);
      }
    };

    const loadProduct = async () => {
      if (!isEdit) return;
      try {
        const { data } = await adminApi.get(`/api/admin/products/${id}`);
        setFormData({
          productName: data.name || "",
          productPrice: data.price || "",
          productStock: data.stock_quantity || "",
          productCategory: data.category_slug || "",
          productImageUrl: data.image_url || "",
          productDescription: data.description || "",
          productBestSeller: !!data.is_best_seller,
          productFeatured: !!data.is_featured,
        });
      } catch (error) {
        console.error("Failed to load product:", error);
        setErr("Failed to load product for editing.");
      }
    };

    loadCategories();
    loadProduct();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      const payload = {
        name: formData.productName,
        description: formData.productDescription,
        price: parseFloat(formData.productPrice),
        image_url: formData.productImageUrl.trim(),
        category_slug: formData.productCategory,
        stock_quantity: parseInt(formData.productStock),
        is_best_seller: formData.productBestSeller ? 1 : 0,
        is_featured: formData.productFeatured ? 1 : 0,
      };

      if (isEdit) {
        await adminApi.put(`/api/admin/products/${id}`, payload);
        setMsg("Product updated successfully.");
      } else {
        await adminApi.post("/api/admin/products", payload);
        setMsg("Product added successfully.");
        handleReset();
      }
    } catch (er) {
      setErr(
        er.response?.data?.error ||
          `Could not ${isEdit ? "update" : "add"} product.`,
      );
    }
  };

  const handleReset = () => {
    setFormData({
      productName: "",
      productPrice: "",
      productStock: "",
      productCategory: "",
      productImageUrl: "",
      productDescription: "",
      productBestSeller: false,
      productFeatured: false,
    });
  };

  return (
    <DashboardLayout>
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div className="m-3">
              <h1 className="fs-3 mt-3">
                {isEdit ? "Edit Product" : "Add Inventory"}
              </h1>
              <p className="mb-0">Manage your product inventory</p>
            </div>
            <div>
              <Link to="/admin/inventory" className="btn btn-primary"
               
              >
                Go to Inventory List
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-4">
              <form id="addProductForm" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="productName" className="form-label">
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="productName"
                      placeholder="Enter product name"
                      required
                      value={formData.productName}
                      onChange={handleChange}
                    />
                  </div>
                  {/* <div className="col-md-6 mb-3">
                    <label htmlFor="productSKU" className="form-label">SKU</label>
                    <input
                      type="text"
                      className="form-control"
                      id="productSKU"
                      placeholder="Enter SKU"
                      required
                      value={formData.productSKU}
                      onChange={handleChange}
                    />
                  </div> */}
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="productPrice" className="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="productPrice"
                      placeholder="0.00"
                      step="0.01"
                      required
                      value={formData.productPrice}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="productStock" className="form-label">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="productStock"
                      placeholder="0"
                      required
                      value={formData.productStock}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="productCategory" className="form-label">
                    Category
                  </label>
                  <select
                    className="form-select"
                    id="productCategory"
                    required
                    value={formData.productCategory}
                    onChange={handleChange}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="productImageUrl" className="form-label">
                    Image URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productImageUrl"
                    placeholder="Enter image URL"
                    required
                    value={formData.productImageUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="productBestSeller"
                    checked={formData.productBestSeller}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="productBestSeller"
                  >
                    Best seller
                  </label>
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="productFeatured"
                    checked={formData.productFeatured}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="productFeatured">
                    Featured
                  </label>
                </div>
                <div className="mb-3">
                  <label htmlFor="productDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="productDescription"
                    rows="4"
                    placeholder="Enter product description"
                    value={formData.productDescription}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {isEdit ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="reset"
                    className="btn btn-light  rounded-pill mt-4 px-5 py-2  fw-bold shadow-lg"
                    onClick={handleReset}
                  >
                    Clear
                  </button>
                </div>
                {msg && <div className="alert alert-success mt-3">{msg}</div>}
                {err && <div className="alert alert-danger mt-3">{err}</div>}
              </form>
            </div>
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

export default CreateProduct;
