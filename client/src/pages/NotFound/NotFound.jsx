import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <Helmet>
        <title>Page Not Found - Brother's Kitchenware</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist. Return to Brother's Kitchenware homepage."
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="max-w-xl text-center">
        <p className="text-4x1 uppercase tracking-[0.3em] text-red-700  text-4xl sm:text-5xl font-bold  mb-6">
          404
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Page not found!
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Use the
          link below to return to the store.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-teal-200/30 hover:bg-teal-700 transition"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
