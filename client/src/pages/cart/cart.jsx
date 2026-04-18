import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20">
        <h1 className="text-4xl font-serif uppercase mb-4">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/shop"
          className="bg-teal-600 text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-900 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-serif uppercase mb-8 text-center sm:text-left">
          Shopping Cart
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="order-last lg:order-none lg:col-span-2">
            <div className="border border-gray-100 rounded-3xl overflow-hidden">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 sm:p-6 border-b border-gray-100 last:border-0"
                >
                  <div className="w-full sm:w-28 h-28 bg-gray-50 rounded-3xl flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 uppercase text-base sm:text-sm mb-2 truncate">
                      {item.name}
                    </h3>
                    <p className="text-teal-600 font-serif text-lg sm:text-base">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 rounded-full border border-gray-200 hover:border-teal-600 transition flex items-center justify-center"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-base">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 rounded-full border border-gray-200 hover:border-teal-600 transition flex items-center justify-center"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition self-start sm:self-auto"
                    aria-label={`Remove ${item.name}`}
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 lg:sticky lg:top-24">
              <h3 className="font-bold uppercase text-sm tracking-widest mb-6">
                Order Summary
              </h3>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="w-full bg-teal-600 text-white py-4 font-bold uppercase tracking-widest mt-6 hover:bg-gray-900 transition rounded-3xl"
                onClick={() => {
                  if (!user) {
                    navigate("/signin", {
                      state: { msg: "Sign in to checkout", redirect: "/cart" },
                    });
                    return;
                  }
                  navigate("/payment");
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
