import Rating from "@mui/material/Rating";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";
import Style from "./Product.module.css";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ADD_TO_CART_BUTTON_FULL } from "../../constants/addToCartButton.js";

function normalizeProduct(product) {
  if (!product || typeof product !== "object") {
    return {
      id: null,
      title: "",
      image: "",
      price: 0,
      description: "",
      rating: { rate: 0, count: 0 },
    };
  }
  const id = product.id;
  const title = product.name ?? product.title ?? "";
  const image = product.image_url ?? product.image ?? "";
  const price = Number(product.price ?? 0);
  const description = product.description ?? "";
  let rating;
  if (product.rating && typeof product.rating === "object" && "rate" in product.rating) {
    rating = {
      rate: Number(product.rating.rate),
      count: Number(product.rating.count ?? 0),
    };
  } else {
    rating = {
      rate: Number(product.rating ?? product.rating_avg ?? 4.5),
      count: Number(product.review_count ?? product.rating_count ?? 0),
    };
  }
  return { id, title, image, price, description, rating };
}

const ProductCard = ({ product, flex, renderDesc, renderAdd }) => {
  const { id, title, image, price, description, rating } = normalizeProduct(product);
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
        </Link>
        {renderDesc && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-3">
            {description}
          </p>
        )}
        <div className={Style.rating}>
          <Rating
            name="read-only"
            value={rating.rate}
            readOnly
            precision={0.1}
            size="small"
          />
          <small className="text-xs text-gray-500 ml-1">({rating.count})</small>
        </div>
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
                borderRadius: "25px" ,
                backgroundColor:'#5fb3a3'
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
