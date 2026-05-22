import React, { useState } from "react";
import './header.css'
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { useAdminAuthSafe } from "../../../context/AdminAuthContext";
import { STORE_CATEGORIES } from "../../../constants/storeCategories.js";

const staffHomePath = (role) =>
  role === "employee" ? "/admin/inventory" : "/admin/dashboard";

const navLinkClass = ({ isActive }) =>
  [
    "uppercase text-[16px] tracking-[0.2em] font-bold transition-colors duration-200 border-b-2 pb-0.5 text-black no-underline",
    isActive ? "border-[#8fbab5]" : "border-transparent hover:border-[#8fbab5]",
  ].join(" ");

const Header = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, cartReady } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const adminAuth = useAdminAuthSafe();
  const staff = adminAuth?.staff ?? null;
  const { pathname } = useLocation();
  const categorySectionActive = pathname.startsWith("/category");

  const categories = STORE_CATEGORIES.map((category) => ({
    name: category.label,
    path: `/category/${category.slug}`,
  }));

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/90 px-4 md:px-12 py-4 flex justify-between items-center gap-4">
      <Link
        to="/"
        className="text-2xl md:text-3xl font-display font-black text-[#1a1f1e] tracking-tight shrink-0 hover:opacity-90 transition-opacity"
        aria-label="Brothers Home Goods home"
      >
        B<span className="text-[#2d6a6a]">K</span>
      </Link>

      <button
        type="button"
        className="lg:hidden p-2 rounded-lg text-black hover:bg-black/[0.04] transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <div className="hidden lg:flex items-center gap-8 xl:gap-10">
        <NavLink to="/" end className={navLinkClass}>
          Home
        </NavLink>
        <NavLink to="/shop" end className={navLinkClass}>
          Shop
        </NavLink>
        <div
          className="relative"
          onMouseEnter={() => setIsCategoryOpen(true)}
          onMouseLeave={() => setIsCategoryOpen(false)}
        >
          <button
            type="button"
            className={[
              "flex items-center gap-1 uppercase text-[11px] tracking-[0.2em] font-bold transition-colors duration-200 border-b-2 pb-0.5 text-black",
              isCategoryOpen || categorySectionActive
                ? "border-[#8fbab5]"
                : "border-transparent hover:border-[#8fbab5]",
            ].join(" ")}
            aria-expanded={isCategoryOpen}
            aria-haspopup="true"
          >
            Categories
            <FiChevronDown
              className={`text-black transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`}
              size={16}
            />
          </button>
          {isCategoryOpen && (
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 w-[17rem] pt-1 pb-2 rounded-xl bg-transparent"
              role="menu"
            >
              <div className="rounded-xl bg-white shadow-lg border border-[#dceee9] ring-1 ring-black/[0.03] py-2 overflow-hidden">
                {categories.map((cat) => (
                  <NavLink
                    key={cat.path}
                    to={cat.path}
                    role="menuitem"
                    className={({ isActive }) =>
                      [
                        "block px-5 py-2.5 text-[12px] tracking-wide font-semibold transition-colors duration-150 border-l-[3px]",
                        isActive
                          ? "bg-[#eef6f4] text-black border-[#8fbab5]"
                          : "text-black border-transparent hover:bg-[#f5faf9] hover:text-black",
                      ].join(" ")
                    }
                  >
                    {cat.name}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>

        <NavLink to="/services" className={navLinkClass}>
          Services
        </NavLink>
        <NavLink to="/about" className={navLinkClass}>
          About
        </NavLink>
        <NavLink to="/contact" className={navLinkClass}>
          Contact
        </NavLink>
      </div>

      <div className="flex items-center gap-4 md:gap-6 text-black">
        <button
          type="button"
          className="hidden sm:block p-2 rounded-lg text-black hover:bg-black/[0.04] transition-colors"
          aria-label="Search"
        >
          <FiSearch size={20} strokeWidth={2} />
        </button>
       

        {isLoggedIn && (
          <div className="flex flex-row items-center gap-3 shrink-0">
            <span className="text-xs md:text-sm font-semibold whitespace-nowrap text-green-600">
              {user?.name || "User"}
            </span>
            <button
              type="button"
              onClick={logout}
              className="text-xs md:text-sm font-bold text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        )}

        {!isLoggedIn && staff && (
          <div className="flex flex-row items-center gap-3 shrink-0">
            <span className="text-xs md:text-sm font-semibold whitespace-nowrap text-[#2d6a6a]">
              {staff.name}
            </span>
            <Link
              to={staffHomePath(staff.role)}
              className="text-xs md:text-sm font-bold text-[#2d6a6a] px-2 py-1 rounded-lg hover:bg-[#eef6f4] transition-colors whitespace-nowrap no-underline"
            >
              Dashboard
            </Link>
          </div>
        )}

        {!isLoggedIn && !staff && (
          <Link
            to="/signin"
            className="p-2 rounded-lg text-black hover:bg-black/[0.04] transition-colors"
            aria-label="Account"
          >
            <FiUser size={20} strokeWidth={2} />
          </Link>
        )}

        <Link
          to="/cart"
          className="relative p-2 rounded-lg text-black hover:bg-black/[0.04] transition-colors"
          aria-label="Shopping cart"
        >
          <FiShoppingCart size={20} strokeWidth={2} />
          {cartReady && totalItems > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-[#2d6a6a] text-white text-[10px] min-w-[1.15rem] h-[1.15rem] px-0.5 rounded-full flex items-center justify-center font-bold shadow-sm">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200/90 shadow-lg z-40">
          <div className="flex flex-col px-4 py-4 space-y-4">
            <NavLink
              to="/"
              end
              className="text-black font-bold uppercase tracking-[0.2em] py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              end
              className="text-black font-bold uppercase tracking-[0.2em] py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </NavLink>
            <NavLink
              to="/services"
              className="text-black font-bold uppercase tracking-[0.2em] py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </NavLink>
            <NavLink
              to="/about"
              className="text-black font-bold uppercase tracking-[0.2em] py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className="text-black font-bold uppercase tracking-[0.2em] py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
