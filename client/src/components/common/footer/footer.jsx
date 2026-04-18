import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { STORE_CATEGORIES } from "../../../constants/storeCategories.js";

const Footer = () => (
  <footer className="bg-[#111] text-gray-400 py-16 md:py-20 px-6 md:px-10">
    <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
      <div>
        <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Shop</h4>
        <ul className="text-sm space-y-3">
          <li>
            <Link to="/shop" className="hover:text-white transition">
              Shop
            </Link>
          </li>
          <li>
            <Link to="/shop" className="hover:text-white transition">
              All items
            </Link>
          </li>
          <li>
            <Link
              to={`/category/${STORE_CATEGORIES[0].slug}`}
              className="hover:text-white transition"
            >
              {STORE_CATEGORIES[0].label}
            </Link>
          </li>
          <li>
            <Link to="/shop" className="hover:text-white transition">
              New items
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Customer service</h4>
        <ul className="text-sm space-y-3">
          <li>
            <Link to="/about" className="hover:text-white transition">
              About us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-white transition">
              Contact us
            </Link>
          </li>
          <li>
            <Link to="/services" className="hover:text-white transition">
              Services
            </Link>
          </li>
          <li>
            <span className="cursor-default">Terms &amp; policy</span>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Company</h4>
        <ul className="text-sm space-y-3">
          <li>
            <span className="cursor-default">Careers</span>
          </li>
          <li>
            <Link to="/contact" className="hover:text-white transition">
              Connect
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Connect</h4>
        <div className="flex gap-3 mb-6">
          <a
            href="https://facebook.com"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2d6a6a] hover:text-white transition"
            aria-label="Facebook"
          >
            <FaFacebookF size={14} />
          </a>
          <a
            href="https://instagram.com"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2d6a6a] hover:text-white transition"
            aria-label="Instagram"
          >
            <FaInstagram size={14} />
          </a>
          <a
            href="https://linkedin.com"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2d6a6a] hover:text-white transition"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={14} />
          </a>
          <a
            href="https://youtube.com"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2d6a6a] hover:text-white transition"
            aria-label="YouTube"
          >
            <FaYoutube size={14} />
          </a>
        </div>
        <form
          className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 pl-4 pr-1 py-1 max-w-sm"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Email newsletter"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-500 py-2"
          />
          <button
            type="submit"
            className="shrink-0 w-10 h-10 rounded-full bg-[#2d6a6a] text-white flex items-center justify-center hover:bg-[#245757] transition"
            aria-label="Subscribe to newsletter"
          >
            <span className="text-lg leading-none" aria-hidden>
              →
            </span>
          </button>
        </form>
      </div>
    </div>
    <div className="max-w-screen-2xl mx-auto mt-14 pt-8 border-t border-white/10 text-xs text-gray-500">
      Copyright © Brother&apos;s Home Goods
    </div>
  </footer>
);

export default Footer;
