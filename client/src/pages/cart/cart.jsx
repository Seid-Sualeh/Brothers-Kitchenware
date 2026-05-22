import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CheckoutSteps from "../../components/ecommerce/CheckoutSteps.jsx";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, cartReady } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/signin", {
        state: {
          msg: "Sign in to complete your purchase",
          redirect: "/payment",
        },
      });
      return;
    }
    navigate("/payment");
  };

  if (!cartReady) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#FAF9F6]">
        <div className="w-8 h-8 border-2 border-[#2d6a6a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center py-20 px-6">
        <div className="w-16 h-16 rounded-full bg-[#eef6f4] flex items-center justify-center text-[#2d6a6a] mb-6">
          <FiShoppingBag size={28} />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
          Your cart is empty
        </h1>
        <p className="text-gray-600 mb-8 text-center max-w-sm">
          Browse our kitchenware collection and add items you love.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center rounded-full bg-[#2d6a6a] text-white px-8 py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-[#245a5a] transition-colors no-underline"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <CheckoutSteps current="cart" />

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Shopping cart
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 sm:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
              >
                <div className="w-full sm:w-28 h-28 bg-[#FAF9F6] rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {item.name}
                  </h3>
                  <p className="text-[#2d6a6a] font-semibold">
                    <CurrencyFormat amount={item.price} />
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-9 h-9 rounded-full border border-gray-200 hover:border-[#2d6a6a] transition flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-8 text-center font-semibold text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-9 h-9 rounded-full border border-gray-200 hover:border-[#2d6a6a] transition flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 transition self-start sm:self-center"
                  aria-label={`Remove ${item.name}`}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm lg:sticky lg:top-24">
              <h2 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-6">
                Order summary
              </h2>
              <div className="flex justify-between mb-3 text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>
                  <CurrencyFormat amount={totalPrice} />
                </span>
              </div>
              <div className="flex justify-between mb-4 text-gray-600 text-sm">
                <span>Shipping</span>
                <span className="text-emerald-700 font-medium">Free</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>
                  <CurrencyFormat amount={totalPrice} />
                </span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full mt-6 rounded-xl bg-[#2a2a2a] text-white py-3.5 font-bold uppercase tracking-widest text-sm hover:bg-black transition-colors"
              >
                Proceed to checkout
              </button>
              <Link
                to="/shop"
                className="block text-center mt-4 text-sm text-[#2d6a6a] font-medium hover:underline no-underline"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
