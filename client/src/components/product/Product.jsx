import { useEffect, useState } from "react";
import { api } from "../../lib/api.js";
import ProductCard from "./ProductCard";
import Style from "./Product.module.css";
import Loader from "../Loader/Loader";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/api/products");
        if (!cancelled) {
          setProducts(Array.isArray(res.data) ? res.data.slice(0, 10) : []);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">More to explore</h2>
          <a href="/shop" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
            See more
          </a>
        </div>
        <div className={Style.product_container}>
          {products.map((singleProduct) => (
            <ProductCard renderAdd key={singleProduct.id} product={singleProduct} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Product;
