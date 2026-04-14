import React from "react";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import CategoryNav from "../CategoryNav/CategoryNav.jsx";

const Layout = ({ children, showCategoryNav = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Header />
      {showCategoryNav ? <CategoryNav /> : null}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
