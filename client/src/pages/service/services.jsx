import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import {
  IconHeadset,
  IconChefHat,
  IconShieldCheck,
  IconGift,
} from "@tabler/icons-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1920&q=80";

const SERVICES = [
  {
    title: "Product Consultation",
    description:
      "Personalized expert advice on selecting the right tools. Available via video call.",
    icon: IconHeadset,
  },
  {
    title: "Culinary Workshops",
    description:
      "Exclusive cooking classes using BK tools. Led by guest chefs.",
    icon: IconChefHat,
  },
  {
    title: "Warranty & Repairs",
    description:
      "Comprehensive product coverage. Hassle-free repair process managed through the dashboard.",
    icon: IconShieldCheck,
  },
  {
    title: "Corporate Gifting",
    description: "Curated sets and branding options for businesses.",
    icon: IconGift,
  },
];

const FAQS = [
  {
    question: "What are the next steps?",
    answer:
      "Browse our shop or book a consultation. After checkout, you will receive a confirmation email with tracking and any next steps for workshops or warranty registration.",
  },
  {
    question: "What are your shipping options?",
    answer:
      "We offer standard and express delivery where available. Exact rates and timelines appear at checkout based on your address.",
  },
  {
    question: "How do I book a product consultation?",
    answer:
      "Use the contact form or call our team to schedule a video session. A specialist will review your kitchen goals and recommend the right BK tools.",
  },
  {
    question: "Can I return or exchange an item?",
    answer:
      "Yes. Unused items in original packaging may be returned within the window stated in our policy. Initiate a return from your account dashboard.",
  },
];

const Services = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="relative min-h-[72vh] md:min-h-[78vh] flex items-center overflow-hidden bg-[#0f1720]">
        <img
          src={HERO_IMG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/50 to-black/35" />
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 md:px-14 py-24 md:py-32 text-center md:text-left">
          <div className="max-w-3xl mx-auto md:mx-0">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-bold uppercase tracking-tight leading-tight">
              Beyond the product.
              <span className="block sm:inline sm:before:content-['_']">
                Our services.
              </span>
            </h1>
            <p className="mt-5 md:mt-6 text-white/90 text-base md:text-lg max-w-xl mx-auto md:mx-0 font-light">
              Comprehensive support to bring professional quality to the heart
              of your home.
            </p>
            <Link
              to="/shop"
              className="inline-flex mt-8 md:mt-10 items-center justify-center rounded-full bg-[#9fd4cb] hover:bg-[#8bc9bf] px-10 py-3.5 text-sm font-bold uppercase tracking-widest text-gray-900 transition-colors shadow-lg"
            >
              Shop new arrivals
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 leading-none text-white pointer-events-none">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-14 sm:h-20 md:h-24 block"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      <section className="py-14 md:py-20 px-6 md:px-10 bg-white">
        <h2 className="font-display text-center text-3xl md:text-4xl font-bold text-gray-900 mb-12 md:mb-16">
          Services
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {SERVICES.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-[#c5e4df] bg-white p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-14 h-14 rounded-xl border border-[#e6f4f2] bg-[#f7fcfb] flex items-center justify-center text-[#2d6a6a] mb-6"
                aria-hidden
              >
                <Icon stroke={1.35} size={32} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-14 md:py-20 px-6 md:px-10 bg-[#FAF9F6] border-t border-[#e8e4df]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-center text-3xl md:text-4xl font-bold text-[#1a1f1e] mb-10 md:mb-12">
            FAQ
          </h2>
         
          <div
            className="rounded-2xl border border-[#dce8e5] bg-white shadow-[0_1px_3px_rgba(15,23,20,0.06)] overflow-hidden 
          "
          >
            <ul className="divide-y divide-[#e8efed]">
              {FAQS.map((faq, index) => {
                const open = openIndex === index;
                return (
                  <li key={faq.question}>
                    <h3 className="m-0">
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        className={[
                          "w-full flex items-center justify-between gap-4 text-left px-5 py-4 md:px-7 md:py-5 transition-colors duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a6a]/35 focus-visible:ring-inset",
                          open
                            ? "bg-[#f0faf8] text-[#143d36]"
                            : "bg-white text-[#1f2b28] hover:bg-[#f7fbfa]",
                        ].join(" ")}
                        aria-expanded={open}
                        id={`faq-trigger-${index}`}
                        aria-controls={`faq-panel-${index}`}
                      >
                        <span className="font-semibold text-sm md:text-[15px] leading-snug pr-2 tracking-tight">
                          {faq.question}
                        </span>
                        <span
                          className={[
                            "shrink-0 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300",
                            open
                              ? "rotate-180 border-[#2d6a6a] bg-[#2d6a6a] text-white"
                              : "border-[#cfd9d6] bg-[#fafcfb] text-[#5a6a66]",
                          ].join(" ")}
                          aria-hidden
                        >
                          <FiChevronDown size={18} strokeWidth={2.5} />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${index}`}
                      aria-hidden={!open}
                      className={[
                        "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      ].join(" ")}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="px-5 md:px-7 py-4 md:py-5 text-sm md:text-[15px] leading-relaxed border-t border-[#d4ebe6] bg-[#f7fcfb] text-[#3d4f4a]">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
