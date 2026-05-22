import { Link } from "react-router-dom";

export default function AuthPageLayout({
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <header className="px-6 py-5 border-b border-gray-200/80 bg-white/90 backdrop-blur-sm">
        <Link
          to="/"
          className="inline-flex text-2xl font-display font-black text-[#1a1f1e] tracking-tight no-underline hover:opacity-90"
          aria-label="Brothers Home Goods home"
        >
          B<span className="text-[#2d6a6a]">K</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            {children}
          </div>

          {footer && <div className="mt-6 text-center">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
