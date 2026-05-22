import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";
import Style from "./Product.module.css";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { showSuccessToast } from "../../lib/toast.js";
import { ADD_TO_CART_BUTTON_FULL } from "../../constants/addToCartButton.js";
import StarRating from "../StarRating/StarRating";

function normalizeProduct(product) {
  if (!product || typeof product !== "object") {
    return {
      id: null,
      title: "",
      image: "",
      price: 0,
      description: "",
      averageRating: 0,
      totalRatings: 0,
    };
  }
  const id = product.id;
  const title = product.name ?? product.title ?? "";
  const image = product.image_url ?? product.image ?? "";
  const price = Number(product.price ?? 0);
  const description = product.description ?? "";
  const averageRating = Number(product.average_rating ?? 0);
  const totalRatings = Number(product.total_ratings ?? 0);
  return { id, title, image, price, description, averageRating, totalRatings };
}

const ProductCard = ({ product, flex, renderDesc, renderAdd }) => {
  const { id, title, image, price, description, averageRating, totalRatings } = normalizeProduct(product);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;
    addToCart({
      id,
      name: title,
      image_url: image,
      price,
    });
    showSuccessToast("Added to cart");
  };

  if (!id) {
    return null;
  }

  return (
    <div
      className={`${Style.card_container} ${flex ? Style.product_flex : ""}`}
    >
      <Link to={`/products/${id}`}>
        <img src={image} alt={title} />
      </Link>
      <div className="flex-1 flex flex-col">
        <Link to={`/products/${id}`} className="hover:text-teal-700">
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
            {title}
          </h3>
          {averageRating > 0 && (
            <StarRating rating={averageRating} totalRatings={totalRatings} />
          )}
        </Link>
        {renderDesc && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-3">
            {description}
          </p>
        )}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-lg font-bold text-gray-900">
              <CurrencyFormat amount={price} />
            </span>
          </div>
          {renderAdd && (
            <button
              type="button"
              className={ADD_TO_CART_BUTTON_FULL}
              onClick={handleAddToCart}
              style={{
                borderRadius: "25px",
                backgroundColor: "#5fb3a3",
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
