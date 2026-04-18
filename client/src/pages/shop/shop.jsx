import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import ProductCard from "../../components/product/ProductCard.jsx";
import Loader from "../../components/Loader/Loader";
import img7 from "../../asset/images/3.jpg";
import { FiChevronRight } from "react-icons/fi";

const Shop = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/products", {
          params: categoryName ? { category: categoryName } : {},
        });

        let fetchedProducts = Array.isArray(res.data) ? [...res.data] : [];

        if (sortBy === "price-low") {
          fetchedProducts.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === "price-high") {
          fetchedProducts.sort((a, b) => Number(b.price) - Number(a.price));
        }

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName, sortBy]);

  const title = categoryName
    ? categoryName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "All collections";

  return (
    <div className="bg-white min-h-screen">
      <header
        className="py-12 md:py-16 border-b border-gray-100 px-6 md:px-10"
        style={{
          backgroundImage: `url(${img7})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 capitalize">
            {title}
          </h1>
          <div className="text-white/70 mt-2 text-sm font-medium flex items-center">
           
            <Link
              to="/"
              className="text-gray/50 hover:text-white no-underline transition-colors ml-1"
            >
              Home
            </Link>
            <span className="mx-2 text-black/50">/</span>
            <span className="text-black">Shop</span>
            {categoryName && (
              <>
                <span className="mx-2 text-white/50">/</span>
                <span className="text-white">{title}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10 md:py-12 flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-64 space-y-8 shrink-0">
          <div>
            <h3 className="font-bold uppercase text-xs tracking-widest mb-3 border-b pb-2 text-gray-800">
              Sort by
            </h3>
            <select
              className="w-full p-2.5 bg-white border border-gray-200 text-sm outline-none focus:border-teal-600 rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="font-bold uppercase text-xs tracking-widest mb-2 text-gray-800">
              Tip
            </p>
            <p>
              Use the department strip above to jump between categories quickly.
            </p>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id || product._id}
                    product={product}
                    renderAdd
                  />
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center py-10">
                  No products found in this category.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
