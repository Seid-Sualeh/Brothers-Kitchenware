import { Link } from "react-router-dom";

const STEPS = [
  { key: "shop", label: "Shop", path: "/shop" },
  { key: "cart", label: "Cart", path: "/cart" },
  { key: "checkout", label: "Checkout", path: "/payment" },
  { key: "orders", label: "Orders", path: "/orders" },
];

export default function CheckoutSteps({ current = "cart" }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <nav
      aria-label="Checkout progress"
      className="mb-8 sm:mb-10 overflow-x-auto"
    >
      <ol className="flex items-center gap-2 sm:gap-0 min-w-max sm:min-w-0 sm:justify-center">
        {STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          const reachable = done || active;

          return (
            <li key={step.key} className="flex items-center">
              {index > 0 && (
                <span
                  className={`hidden sm:block w-8 md:w-16 h-px mx-2 ${
                    done ? "bg-[#2d6a6a]" : "bg-gray-200"
                  }`}
                  aria-hidden
                />
              )}
              {reachable && step.key !== "checkout" ? (
                <Link
                  to={step.path}
                  className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors no-underline ${
                    active
                      ? "bg-[#2d6a6a] text-white"
                      : "text-[#2d6a6a] hover:bg-[#eef6f4]"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[#eef6f4] text-[#2d6a6a]"
                    }`}
                  >
                    {index + 1}
                  </span>
                  {step.label}
                </Link>
              ) : (
                <span
                  className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide ${
                    active
                      ? "bg-[#2d6a6a] text-white"
                      : "text-gray-400"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                  {step.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
