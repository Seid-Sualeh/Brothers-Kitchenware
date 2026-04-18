import React from "react";
import { Helmet } from "react-helmet-async";

const TermsPolicy = () => (
  <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
    <Helmet>
      <title>Terms & Policy - Brother's Kitchenware</title>
      <meta
        name="description"
        content="Read our terms of use and privacy policy at Brother's Kitchenware."
      />
      <meta
        name="keywords"
        content="terms, policy, privacy, Brother's Kitchenware"
      />
      <link
        rel="canonical"
        href="https://brothers-kitchenware.netlify.app/terms-policy"
      />
    </Helmet>
    <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl border border-gray-200 shadow-sm p-8 sm:p-12">
      <h1 className="text-4xl font-serif font-black text-gray-900 mb-6">
        Terms & Policy
      </h1>
      <p className="text-gray-700 leading-relaxed mb-6">
        Welcome to Brother&apos;s Kitchenware. Please review the terms and
        privacy policy below before using our site.
      </p>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Terms of Use
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          By accessing or using our website, you agree to comply with our terms
          and all applicable laws and regulations.
        </p>
        <p className="text-gray-600 leading-relaxed">
          You may not use our site for any unlawful purposes or attempt to
          interfere with its proper functioning.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Privacy Policy
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          We take your privacy seriously. We collect only the information needed
          to provide services and process orders.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Your data is stored securely and will not be shared with third parties
          except as required to fulfill your order or comply with the law.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact</h2>
        <p className="text-gray-600 leading-relaxed">
          If you have questions about these terms or our policy, please contact
          us through the site contact form.
        </p>
      </section>
    </div>
  </div>
);

export default TermsPolicy;
