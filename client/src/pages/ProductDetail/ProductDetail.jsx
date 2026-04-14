import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import Loader from "../../components/Loader/Loader.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat.jsx";
import Rating from "@mui/material/Rating";
import { useCart } from "../../context/CartContext";
import { ADD_TO_CART_BUTTON_INLINE } from "../../constants/addToCartButton.js";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/api/products/${productId}`);
        if (cancelled) return;
        setProduct(res.data);
        const all = await api.get("/api/products");
        if (cancelled) return;
        const list = Array.isArray(all.data) ? all.data : [];
        setRelated(
          list.filter((p) => p.id !== Number(productId)).slice(0, 4),
        );
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setProduct(null);
          setRelated([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <Link to="/shop" className="text-teal-700 font-semibold hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const ratingVal = Number(product.rating ?? product.rating_avg ?? 4.5);
  const count = Number(product.review_count ?? 0);

  return (
    <div className="bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="bg-[#FAF9F6] rounded-2xl border border-gray-100 p-6 md:p-10 flex items-center justify-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-h-[420px] w-full object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700 mb-2">
              {product.category_slug?.replace(/-/g, " ")}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-6">
              <Rating name="read-only" value={ratingVal} precision={0.1} readOnly size="small" />
              <span className="text-sm text-gray-500">({count} reviews)</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-8">
              <CurrencyFormat amount={product.price} />
            </p>
            <p className="text-gray-600 leading-relaxed mb-10">{product.description}</p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    image_url: product.image_url,
                    price: Number(product.price),
                  })
                }
                className={ADD_TO_CART_BUTTON_INLINE}
              >
                Add to Cart
              </button>
              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-10 py-3 text-sm font-bold uppercase tracking-widest hover:border-teal-600 hover:text-teal-700"
              >
                View cart
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 md:mt-24 border-t border-gray-100 pt-12">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">You may also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} renderAdd />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
