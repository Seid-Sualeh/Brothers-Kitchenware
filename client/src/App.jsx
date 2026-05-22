import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { SocketProvider } from "./context/SocketContext";
import { DataProvider } from "./components/DataProvider/DataProvider";
import Header from "./components/common/header/header.jsx";
import Footer from "./components/common/footer/footer.jsx";
import Home from "./pages/homepage/homepage.jsx";
import About from "./pages/About/about.jsx";
import Services from "./pages/service/services.jsx";
import Contact from "./pages/contact/contact.jsx";
import Shop from "./pages/shop/shop.jsx";
import Cart from "./pages/cart/cart.jsx";
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Inventory from "./pages/admin/inventory/Inventory";
import CreateProduct from "./pages/admin/createProduct/CreateProduct";
import Reports from "./pages/admin/reports/Reports";
import AdminSignIn from "./pages/admin/signin/SignIn";
import AddEmployee from "./pages/admin/addEmployee/AddEmployee";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Orders from "./pages/Orders/Orders";
import Payment from "./pages/Payment/Payment";
import WalletPayment from "./pages/Payment/WalletPayment";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminProtectedRoute from "./components/ProtectedRoute/AdminProtectedRoute";
import TermsPolicy from "./pages/terms-policy/TermsPolicy";
import NotFound from "./pages/NotFound/NotFound";
import ScrollToTop from "./components/common/ScrollToTop";

const staffRoutes = ["admin", "employee"];

function App() {
  return (
    <HelmetProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <AdminAuthProvider>
            <SocketProvider>
              <DataProvider>
                <CartProvider>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/about"
                      element={
                        <>
                          <Header />
                          <About />
                          <Footer />
                        </>
                      }
                    />
                    <Route
                      path="/services"
                      element={
                        <>
                          <Header />
                          <Services />
                          <Footer />
                        </>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <>
                          <Header />
                          <Contact />
                          <Footer />
                        </>
                      }
                    />
                    <Route
                      path="/shop"
                      element={
                        <>
                          <Header />
                          <Shop />
                          <Footer />
                        </>
                      }
                    />
                    <Route
                      path="/category/:categoryName"
                      element={
                        <>
                          <Header />
                          <Shop />
                          <Footer />
                        </>
                      }
                    />
                    <Route
                      path="/cart"
                      element={
                        <>
                          <Header />
                          <Cart />
                          <Footer />
                        </>
                      }
                    />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />

                    <Route path="/admin/signin" element={<AdminSignIn />} />
                    <Route
                      path="/admin"
                      element={<Navigate to="/admin/dashboard" replace />}
                    />
                    <Route
                      path="/admin/dashboard"
                      element={
                        <AdminProtectedRoute roles={["admin"]}>
                          <Dashboard />
                        </AdminProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/inventory"
                      element={
                        <AdminProtectedRoute roles={staffRoutes}>
                          <Inventory />
                        </AdminProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/create-product"
                      element={
                        <AdminProtectedRoute roles={staffRoutes}>
                          <CreateProduct />
                        </AdminProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/edit-product/:id"
                      element={
                        <AdminProtectedRoute roles={staffRoutes}>
                          <CreateProduct />
                        </AdminProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/reports"
                      element={
                        <AdminProtectedRoute roles={staffRoutes}>
                          <Reports />
                        </AdminProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/add-employee"
                      element={
                        <AdminProtectedRoute roles={staffRoutes}>
                          <AddEmployee />
                        </AdminProtectedRoute>
                      }
                    />

                    <Route
                      path="/products/:productId"
                      element={
                        <>
                          <Header />
                          <ProductDetail />
                          <Footer />
                        </>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute
                          msg="You must login to see your orders"
                          redirect="/orders"
                        >
                          <Header />
                          <Orders />
                          <Footer />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/payment"
                      element={
                        <ProtectedRoute
                          msg="You must login to pay first"
                          redirect="/payment"
                        >
                          <Header />
                          <Payment />
                          <Footer />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/payment/wallet/:provider"
                      element={
                        <ProtectedRoute
                          msg="Sign in to complete wallet payment"
                          redirect="/payment"
                        >
                          <WalletPayment />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/terms-policy"
                      element={
                        <>
                          <Header />
                          <TermsPolicy />
                          <Footer />
                        </>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </CartProvider>
              </DataProvider>
            </SocketProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
