import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20">
        <h1 className="text-4xl font-serif uppercase mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="bg-teal-600 text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-900 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif uppercase mb-12">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="border border-gray-100">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-6 p-6 border-b border-gray-100 last:border-0">
                  <div className="w-28 h-28 bg-gray-50 flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 uppercase text-sm mb-1">{item.name}</h3>
                    <p className="text-teal-600 font-serif">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 border border-gray-200 hover:border-teal-600 transition"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 border border-gray-200 hover:border-teal-600 transition"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-8">
              <h3 className="font-bold uppercase text-sm tracking-widest mb-6">Order Summary</h3>
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
                className="w-full bg-teal-600 text-white py-4 font-bold uppercase tracking-widest mt-6 hover:bg-gray-900 transition"
                onClick={() => {
                  if (!user) {
                    navigate('/signin', { state: { msg: 'Sign in to checkout', redirect: '/cart' } });
                    return;
                  }
                  navigate('/payment');
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