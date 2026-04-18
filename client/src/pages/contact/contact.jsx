import React, { useState } from "react";
import { FiPhone, FiMail, FiClock } from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import { api } from "../../lib/api.js";

const MAP_EMBED_ADDIS =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31307.19098838402!2d39.043316614055314!3d11.232040336625916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1646f42f81fd2757%3A0x92d3818696152876!2sMasha%20Wollo!5e0!3m2!1sen!2set!4v1776537242747!5m2!1sen!2set";

const PANEL_BG = "#dcece9";
const ACCENT = "#8fbab5";

const FieldLabel = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="block text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-800 mb-2"
  >
    {children}
  </label>
);

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    orderNumber: "",
    message: "",
  });
  const [status, setStatus] = useState({
    sending: false,
    error: null,
    ok: false,
  });

  const send = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, error: null, ok: false });
    try {
      let message = form.message.trim();
      if (form.orderNumber.trim()) {
        message = `[Order #${form.orderNumber.trim()}]\n\n${message}`;
      }
      await api.post("/api/contact", {
        name: form.name.trim(),
        email: form.email.trim(),
        message,
      });
      setStatus({ sending: false, error: null, ok: true });
      setForm({ name: "", email: "", orderNumber: "", message: "" });
    } catch (err) {
      setStatus({
        sending: false,
        error:
          err?.response?.data?.error ||
          "Something went wrong. Please try again.",
        ok: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-about">
      <Helmet>
        <title>Contact Us - Brother's Kitchenware</title>
        <meta
          name="description"
          content="Get in touch with Brother's Kitchenware. Find our location, contact information, and send us a message."
        />
        <meta
          name="keywords"
          content="contact, Brother's Kitchenware, customer service, location"
        />
        <link
          rel="canonical"
          href="https://brothers-kitchenware.netlify.app/contact"
        />
      </Helmet>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:min-h-[640px] overflow-hidden rounded-2xl lg:rounded-3xl border border-black/[0.06] bg-white shadow-[0_12px_40px_-20px_rgba(0,0,0,0.12)]">
          {/* Left: map */}
          <div className="flex flex-col bg-white p-6 sm:p-8 lg:p-10 lg:border-r border-neutral-200/80">
            <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight mb-6 md:mb-8">
              Contact Us
            </h1>
            <div className="relative flex-1 min-h-[320px] sm:min-h-[400px] lg:min-h-0 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
              <iframe
                title="BK store location — Addis Ababa"
                src={MAP_EMBED_ADDIS}
                className="absolute inset-0 h-full w-full border-0 grayscale-[0.15] contrast-[0.97]"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div
                className="pointer-events-none absolute left-1/2 top-[42%] z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/90 text-sm font-display font-black text-white shadow-lg"
                style={{ backgroundColor: ACCENT }}
                aria-hidden
              >
                B<span className="opacity-95">K</span>
              </div>
            </div>
          </div>

          {/* Right: info + form */}
          <div
            className="flex flex-col p-6 sm:p-8 lg:p-10 lg:pl-12"
            style={{ backgroundColor: PANEL_BG }}
          >
            <div className="mb-8 md:mb-10 space-y-6">
              <div className="flex gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white/90"
                  aria-hidden
                >
                  <FiPhone
                    size={18}
                    strokeWidth={2}
                    style={{ color: ACCENT }}
                  />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-800">
                    Call now:
                  </p>
                  <a
                    href="tel:+18234557790"
                    className="text-base font-semibold text-black hover:opacity-70"
                  >
                    +1 823 455-7790
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white/90"
                  aria-hidden
                >
                  <FiMail size={18} strokeWidth={2} style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-800">
                    Email address:
                  </p>
                  <a
                    href="mailto:support@brothershomegoods.com"
                    className="text-base font-semibold text-black hover:opacity-70 break-all"
                  >
                    support@brothershomegoods.com
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white/90"
                  aria-hidden
                >
                  <FiClock
                    size={18}
                    strokeWidth={2}
                    style={{ color: ACCENT }}
                  />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-800">
                    Opening hours:
                  </p>
                  <p className="text-base font-semibold text-black">
                    Mon–Sat, 9AM–7PM
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={send}
              className="rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm space-y-5 md:space-y-6 flex-1 flex flex-col"
            >
              <div>
                <FieldLabel htmlFor="contact-name">Your name</FieldLabel>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-shadow focus:border-[#8fbab5] focus:ring-2 focus:ring-[#8fbab5]/25"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <FieldLabel htmlFor="contact-email">Email address</FieldLabel>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-shadow focus:border-[#8fbab5] focus:ring-2 focus:ring-[#8fbab5]/25"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <FieldLabel htmlFor="contact-order">
                  Order number (optional)
                </FieldLabel>
                <input
                  id="contact-order"
                  type="text"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-shadow focus:border-[#8fbab5] focus:ring-2 focus:ring-[#8fbab5]/25"
                  value={form.orderNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, orderNumber: e.target.value }))
                  }
                  placeholder=""
                />
              </div>
              <div className="flex-1 flex flex-col min-h-[140px]">
                <FieldLabel htmlFor="contact-message">Your message</FieldLabel>
                <div className="relative flex-1 min-h-[160px]">
                  <textarea
                    id="contact-message"
                    rows={6}
                    className="h-full min-h-[160px] w-full resize-y rounded-lg border border-neutral-300 bg-white px-4 py-3 pb-12 text-sm text-neutral-900 outline-none transition-shadow focus:border-[#8fbab5] focus:ring-2 focus:ring-[#8fbab5]/25"
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    required
                  />
                  <span
                    className="pointer-events-none absolute bottom-3 right-4 font-display text-5xl font-black text-neutral-300/40 select-none"
                    aria-hidden
                  >
                    BK
                  </span>
                </div>
              </div>

              {status.error && (
                <p className="text-sm text-red-600" role="alert">
                  {status.error}
                </p>
              )}
              {status.ok && (
                <p className="text-sm font-medium text-[#2d6a6a]" role="status">
                  Message sent. We will get back to you soon.
                </p>
              )}

              <button
                type="submit"
                disabled={status.sending}
                className="w-full rounded-xl bg-[#2a2a2a] px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-sm transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status.sending ? "Sending…" : "Send message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
