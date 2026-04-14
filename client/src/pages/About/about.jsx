import React from "react";
import { Link } from "react-router-dom";
import { IconShield, IconHandFinger, IconWorld } from "@tabler/icons-react";

const ACCENT = "#8fbab5";
const PAGE_BG = "#F9F9F7";

const HERO_IMG =
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1920&q=85";
const IMG_CRAFT =
  "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=1200&q=80";
const IMG_DINING =
  "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=1200&q=80";
const IMG_MISSION =
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80";
const WOOD_BG =
  "https://images.unsplash.com/photo-1541123603104-512281d704e3?w=1920&q=75";

const STORY_ROWS = [
  {
    title: "Craftsmanship & quality",
    body: "Every BK piece is chosen for balance, edge retention, and materials that age gracefully in a real kitchen. We work with makers who treat cookware as functional art—so your prep feels steady, precise, and quietly luxurious.",
    image: IMG_CRAFT,
    imageAlt: "Professional knives on a wooden cutting board",
  },
  {
    title: "Designed for home chefs",
    body: "From weeknight sautés to weekend gatherings, our assortment is curated so you can plate with confidence. Clean silhouettes, honest finishes, and details you notice every time you reach for the same pan or fork.",
    image: IMG_DINING,
    imageAlt: "Dining table set with plates, glassware, and candles",
  },
  {
    title: "Our mission: inspiration",
    body: "We exist to make the heart of your home calmer and more creative. That means thoughtful guidance, dependable quality, and a brand voice that celebrates home cooking—whether you are feeding one or a full table.",
    image: IMG_MISSION,
    imageAlt: "Chefs collaborating in a bright kitchen",
  },
];

const PROMISE_COLUMNS = [
  {
    Icon: IconShield,
    title: "Durable materials",
    bullets: [
      "Forged and clad metals selected for even heating",
      "Finishes tested for daily dishwashing and wear",
      "Woods and composites from trusted suppliers",
    ],
  },
  {
    Icon: IconHandFinger,
    title: "Ergonomic design",
    bullets: [
      "Handles shaped for long sessions at the stove",
      "Weights tuned for balance—not showroom-only appeal",
      "Controls and grips reviewed by working cooks",
    ],
  },
  {
    Icon: IconWorld,
    title: "Ethical sourcing",
    bullets: [
      "Partners screened for labor and safety standards",
      "Lower-impact packaging where we can improve it",
      "Transparent answers when you ask where things come from",
    ],
  },
];

const About = () => {
  return (
    <div className="font-about bg-[#F9F9F7] text-neutral-900 min-h-screen">
      <section className="relative min-h-[78vh] md:min-h-[82vh] flex flex-col justify-end overflow-hidden">
        <img
          src={HERO_IMG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/10" />

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 md:px-14 pb-10 md:pb-16 pt-32 md:pt-40">
          <div className="max-w-2xl">
            <div
              className="inline-block px-8 py-6 md:px-10 md:py-8 shadow-lg"
              style={{ backgroundColor: ACCENT }}
            >
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.12em] leading-tight">
                Our story.
                <br />
                Your kitchen.
              </h1>
            </div>
            <p className="mt-6 md:mt-8 max-w-xl text-[15px] md:text-base font-medium leading-relaxed text-black bg-[#F9F9F7]/95 backdrop-blur-sm px-5 py-4 md:px-6 md:py-5 rounded-lg shadow-sm border border-black/[0.06]">
              Welcome to a passion for cooking, minimalist design, and quality
              tools for the heart of your home.
            </p>
          </div>
        </div>

        <div className="relative z-10 leading-none text-[#F9F9F7] pointer-events-none">
          <svg
            viewBox="0 0 1440 120"
            className="block h-14 w-full sm:h-20 md:h-24"
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

      <section
        className="py-16 md:py-28 px-6 md:px-12"
        style={{ backgroundColor: PAGE_BG }}
      >
        <div className="max-w-6xl mx-auto space-y-20 md:space-y-28">
          {STORY_ROWS.map((row) => (
            <div
              key={row.title}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-center"
            >
              <div className="overflow-hidden rounded-2xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.04]">
                <img
                  src={row.image}
                  alt={row.imageAlt}
                  className="h-[280px] sm:h-[340px] md:h-[400px] w-full object-cover"
                />
              </div>
              <div className="space-y-5 md:space-y-6">
                <h2
                  className="text-lg md:text-xl font-bold uppercase tracking-[0.2em]"
                  style={{ color: ACCENT }}
                >
                  {row.title}
                </h2>
                <p className="text-[15px] md:text-base leading-relaxed text-neutral-700 font-medium">
                  {row.body}
                </p>
                <Link
                  to="/shop"
                  className="inline-block text-sm font-semibold uppercase tracking-widest border-b-2 border-black pb-0.5 hover:opacity-70 transition-opacity"
                >
                  Explore the shop
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="relative py-16 md:py-24 px-6 md:px-12 border-t border-black/[0.06]"
        style={{
          backgroundImage: `linear-gradient(rgba(249,249,247,0.94), rgba(249,249,247,0.94)), url(${WOOD_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-bold uppercase tracking-[0.18em] text-black mb-14 md:mb-16">
            Our promise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
            {PROMISE_COLUMNS.map(({ Icon, title, bullets }) => (
              <div
                key={title}
                className="rounded-2xl bg-white/80 backdrop-blur-sm border border-black/[0.06] px-6 py-8 md:px-8 md:py-10 shadow-sm"
              >
                <div
                  className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border-2"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                  aria-hidden
                >
                  <Icon stroke={1.35} size={30} />
                </div>
                <h3 className="text-base font-bold uppercase tracking-widest text-black mb-5">
                  {title}
                </h3>
                <ul className="space-y-3 text-sm md:text-[15px] leading-relaxed text-neutral-700 font-medium">
                  {bullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: ACCENT }}
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
