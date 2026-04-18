import { Link } from "react-router-dom";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import { STORE_CATEGORIES } from "../../../constants/storeCategories.js";

const DEPTS = [
  { label: "All", path: "/shop" },
  ...STORE_CATEGORIES.map((category) => ({
    label: category.label,
    path: `/category/${category.slug}`,
  })),
];

export default function CategoryNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="bg-[#1e2a2f] border-b border-black/20 relative">
      {/* Container set to 75% width and centered */}
      <div className="w-[75%]  px-4 py-2">
        {/* Desktop View */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
          <Link
            to="/shop"
            className="flex items-center gap-2 shrink-0 font-bold px-3 py-1.5 rounded hover:bg-white/10 !text-white !no-underline"
          >
            <FiMenu className="text-lg !text-white" />
            <span>All</span>
          </Link>

          <span className="text-white/20 px-1">|</span>

          {DEPTS.filter((d) => d.label !== "All").map((d) => (
            <Link
              key={d.path}
              to={d.path}
              className="shrink-0 px-3 py-1.5 rounded hover:bg-white/10 whitespace-nowrap !text-white !no-underline"
            >
              {d.label}
            </Link>
          ))}
        </div>

        {/* Mobile View */}
        <div className="lg:hidden">
          <button
            type="button"
            className="flex items-center gap-2 font-bold px-3 py-1.5 rounded hover:bg-white/10 !text-white"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FiMenu className="text-lg" />
            <span>Categories</span>
            <FiChevronDown
              className={`text-sm transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 bg-[#1e2a2f] border-t border-black/20 z-10">
              <div className="flex flex-col py-2">
                {DEPTS.filter((d) => d.label !== "All").map((d) => (
                  <Link
                    key={d.path}
                    to={d.path}
                    className="px-4 py-2 hover:bg-white/10 !text-white !no-underline"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {d.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
