import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import Loader from "../../components/Loader/Loader.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat.jsx";
import { useCart } from "../../context/CartContext";
import { ADD_TO_CART_BUTTON_INLINE } from "../../constants/addToCartButton.js";
import StarRating from "../../components/StarRating/StarRating.jsx";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const [productRes, ratingsRes, allRes] = await Promise.all([
          api.get(`/api/products/${productId}`),
          api.get(`/api/products/${productId}/ratings`),
          api.get("/api/products"),
        ]);
        if (cancelled) return;
        setProduct(productRes.data);
        setRatings(ratingsRes.data || []);
        const list = Array.isArray(allRes.data) ? allRes.data : [];
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
            <p className="text-3xl font-bold text-gray-900 mb-4">
              <CurrencyFormat amount={product.price} />
            </p>
            {product.average_rating > 0 && (
              <div className="mb-8">
                <StarRating rating={product.average_rating} totalRatings={product.total_ratings} size="lg" />
              </div>
            )}
            <p className="text-gray-600 leading-relaxed mb-10">{product.description}</p>

            {/* Rating Form */}
            <div className="border-t border-gray-200 pt-8 mb-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate this product</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="text-2xl focus:outline-none"
                      >
                        {star <= userRating ? "★" : "☆"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review (optional)</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                    placeholder="Share your thoughts about this product..."
                  />
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (userRating === 0) return;
                    setSubmitting(true);
                    try {
                      await api.post(`/api/products/${productId}/ratings`, {
                        rating: userRating,
                        review: review.trim() || null,
                      });
                      // Reload ratings
                      const res = await api.get(`/api/products/${productId}/ratings`);
                      setRatings(res.data || []);
                      // Reload product for updated average
                      const productRes = await api.get(`/api/products/${productId}`);
                      setProduct(productRes.data);
                      setUserRating(0);
                      setReview("");
                    } catch (err) {
                      console.error(err);
                      alert(err.response?.data?.error || "Failed to submit rating");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  disabled={submitting || userRating === 0}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Rating"}
                </button>
              </div>
            </div>

            {/* Existing Reviews */}
            {ratings.length > 0 && (
              <div className="border-t border-gray-200 pt-8 mb-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{rating.user_name}</span>
                        <StarRating rating={rating.rating} />
                        <span className="text-sm text-gray-500">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.review && (
                        <p className="text-gray-700">{rating.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
