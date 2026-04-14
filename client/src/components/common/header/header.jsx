import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiSearch, FiUser, FiShoppingCart, FiChevronDown } from "react-icons/fi";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  [
    "uppercase text-[11px] tracking-[0.2em] font-bold transition-colors duration-200 border-b-2 pb-0.5 text-black",
    isActive ? "border-[#8fbab5]" : "border-transparent hover:border-[#8fbab5]",
  ].join(" ");

const Header = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { totalItems } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const { pathname } = useLocation();
  const categorySectionActive = pathname.startsWith("/category");

  const categories = [
    { name: "Cookware", path: "/category/cookware" },
    { name: "Dining ware", path: "/category/dining" },
    { name: "Gadgets", path: "/category/gadgets" },
    { name: "Appliances", path: "/category/appliances" },
    { name: "Cutlery", path: "/category/cutlery" },
    { name: "Bakeware", path: "/category/bakeware" },
    { name: "Storage", path: "/category/storage" },
    { name: "Coffee & tea", path: "/category/coffee-tea" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/90 px-4 md:px-12 py-4 flex justify-between items-center gap-4">
      <Link
        to="/"
        className="text-2xl md:text-3xl font-display font-black text-[#1a1f1e] tracking-tight shrink-0 hover:opacity-90 transition-opacity"
        aria-label="Brothers Kitchenware home"
      >
        B<span className="text-[#2d6a6a]">K</span>
      </Link>

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
        {isLoggedIn ? (
          <button
            type="button"
            onClick={logout}
            className="text-xs md:text-sm font-semibold text-black px-2 py-1 rounded-lg hover:bg-black/[0.04] transition-colors"
          >
            Logout
          </button>
        ) : (
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
          <span className="absolute top-0.5 right-0.5 bg-[#2d6a6a] text-white text-[10px] min-w-[1.15rem] h-[1.15rem] px-0.5 rounded-full flex items-center justify-center font-bold shadow-sm">
            {totalItems}
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
