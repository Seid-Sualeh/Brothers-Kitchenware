import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const getCartKey = (user) => {
  const id = user?.id || user?.email;
  return id ? `cart:${id}` : "cart:guest";
};

const getLocalStorage = (key) => {
  try {
    const cart = JSON.parse(localStorage.getItem(key));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload);
    case "UPDATE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item,
      );
    case "CLEAR_CART":
      return [];
    case "INITIALIZE_CART":
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const cartKey = getCartKey(user);

  const [cart, dispatch] = useReducer(cartReducer, [], () =>
    getLocalStorage(cartKey),
  );

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  useEffect(() => {
    dispatch({ type: "INITIALIZE_CART", payload: getLocalStorage(cartKey) });
  }, [cartKey]);

  const addToCart = (product) =>
    dispatch({ type: "ADD_TO_CART", payload: product });
  const removeFromCart = (id) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
