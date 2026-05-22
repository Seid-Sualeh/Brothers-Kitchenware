import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const GUEST_SESSION_KEY = "bk_guest_session";

const getGuestSessionId = () => {
  let guestId = sessionStorage.getItem(GUEST_SESSION_KEY);
  if (!guestId) {
    guestId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `guest_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem(GUEST_SESSION_KEY, guestId);
  }
  return guestId;
};

const getCartKey = (user) => {
  if (user?.id != null && user.id !== "") {
    return `cart:user:${String(user.id)}`;
  }
  if (user?.email) {
    return `cart:user:${String(user.email).toLowerCase()}`;
  }
  return `cart:guest:${getGuestSessionId()}`;
};

const readCart = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const cart = raw ? JSON.parse(raw) : [];
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
};

const writeCart = (key, cart) => {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(cart));
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
    case "SET_CART":
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [cartReady, setCartReady] = useState(false);

  const cartRef = useRef(cart);
  const activeKeyRef = useRef(null);

  cartRef.current = cart;

  useEffect(() => {
    if (authLoading) {
      setCartReady(false);
      return;
    }

    const nextKey = getCartKey(user);
    const prevKey = activeKeyRef.current;

    if (prevKey === nextKey) {
      setCartReady(true);
      return;
    }

    if (prevKey) {
      writeCart(prevKey, cartRef.current);
    }

    activeKeyRef.current = nextKey;
    dispatch({ type: "SET_CART", payload: readCart(nextKey) });
    setCartReady(true);
  }, [authLoading, user?.id, user?.email]);

  useEffect(() => {
    if (authLoading || !cartReady || !activeKeyRef.current) return;
    writeCart(activeKeyRef.current, cart);
  }, [cart, authLoading, cartReady]);

  const addToCart = (product) =>
    dispatch({ type: "ADD_TO_CART", payload: product });
  const removeFromCart = (id) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      dispatch({ type: "REMOVE_FROM_CART", payload: id });
      return;
    }
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = cartReady
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const totalPrice = cartReady
    ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

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
        cartReady,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
