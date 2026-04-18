import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Testimonials from "../../components/common/testimonials/testimonials.jsx";
import Layout from "../../components/common/Layout/Layout.jsx";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import CarouselEffect from "../../components/Carousel/Carousel.jsx";
import { api } from "../../lib/api.js";

const Home = () => {
  const [data, setData] = useState({
    categories: [],
    featured: [],
    bestSellers: [],
  });
  const [moreProducts, setMoreProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const [landingRes, productsRes] = await Promise.all([
          api.get("/api/landing"),
          api.get("/api/products"),
        ]);
        if (cancelled) return;
        setData({
          categories: landingRes.data.categories ?? [],
          featured: landingRes.data.featured ?? [],
          bestSellers: landingRes.data.bestSellers ?? [],
        });
        const all = productsRes.data ?? [];
        setMoreProducts(all.slice(0, 8));
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setData({ categories: [], featured: [], bestSellers: [] });
          setMoreProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryGrid = data.categories.slice(0, 8);

  return (
    <Layout>
      <section className="relative min-h-[78vh] flex items-center overflow-hidden bg-[#0f1720]">
        <CarouselEffect />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 md:px-14 py-24 md:py-28">
          <div className="max-w-xl">
            <h1 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-bold uppercase leading-[1.05] tracking-tight">
              Everything to cook, serve, and store.
            </h1>
            <p className="mt-5 text-lg text-white/85 font-light">
              Cookware, tableware, food storage, and kitchen appliances — including fridges, ranges, and more.
            </p>
            <Link
              to="/shop"
              className="inline-flex mt-10 items-center justify-center rounded-full bg-[#5fb3a3] px-10 py-3.5 text-sm font-bold uppercase tracking-widest text-black no-underline hover:bg-[#4fa08f] transition-colors shadow-lg"
            >
              {" "}
              Shop new arrivals{" "}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 leading-none text-[#FAF9F6]">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-16 md:h-24 block"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      <div className="bg-[#FAF9F6]">
        {loading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : (
          <>
            <section className="py-14 md:py-20 px-4 md:px-10">
              <div className="max-w-screen-2xl mx-auto text-center mb-12 md:mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
                  Shop by category
                </h2>
                <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
                  Jump straight into prep, dining, pantry storage, or major appliances — organized like a specialty kitchen store.
                </p>
              </div>
              <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-8">
                {categoryGrid.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="group text-left rounded-2xl bg-[#e6f4f2] p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-teal-200"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-white mb-4">
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">
                      {cat.name}
                    </h3>
                    <span className="text-xs md:text-sm font-semibold text-[#2d6a6a] mt-1 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore <span aria-hidden>→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="py-12 md:py-16 px-4 md:px-10 bg-white border-y border-gray-100">
              <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
                    Featured collections
                  </h2>
                  <p className="text-gray-500 text-sm mt-2">
                    Editor picks across home essentials, organization, and decor.
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="text-sm font-semibold text-[#2d6a6a] hover:underline self-start md:self-auto"
                >
                  View all
                </Link>
              </div>
              <div className="max-w-screen-2xl mx-auto grid md:grid-cols-3 gap-8">
                {data.featured.map((p) => (
                  <article
                    key={p.id}
                    className="rounded-2xl overflow-hidden border border-gray-100 bg-[#FAF9F6] shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <Link
                      to={`/products/${p.id}`}
                      className="block aspect-[4/3] bg-white"
                    >
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-display text-xl font-bold text-gray-900">
                        <Link
                          to={`/products/${p.id}`}
                          className="hover:text-[#2d6a6a]"
                        >
                          {p.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-1">
                        {p.description}
                      </p>
                      <div className="mt-6 flex items-center justify-between gap-4">
                        <span className="text-xl font-bold text-gray-900">
                          <CurrencyFormat amount={p.price} />
                        </span>
                        <Link
                          to={`/products/${p.id}`}
                          className="text-sm font-bold uppercase tracking-wide text-[#2d6a6a] hover:underline"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="py-14 md:py-20 px-4 md:px-10 bg-[#f3f4f6]">
              <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
                    Best sellers
                  </h2>
                  <p className="text-gray-500 text-sm mt-2">
                    Top-rated home goods customers keep coming back for.
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="text-sm font-semibold text-[#2d6a6a] hover:underline self-start md:self-auto"
                >
                  See more
                </Link>
              </div>
              <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.bestSellers.slice(0, 8).map((p) => (
                  <ProductCard key={p.id} product={p} renderAdd />
                ))}
              </div>
            </section>

            <section className="py-14 md:py-20 px-4 md:px-10 bg-white">
              <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
                  More to explore
                </h2>
                <Link
                  to="/shop"
                  className="text-sm font-semibold text-[#2563eb] hover:underline"
                >
                  See more
                </Link>
              </div>
              <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                {moreProducts.map((p) => (
                  <ProductCard key={p.id} product={p} renderAdd />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <Testimonials />
    </Layout>
  );
};

export default Home;
