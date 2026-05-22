import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const MOBILE_BREAKPOINT = 992;

export const DashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
  );
  const location = useLocation();

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => {
      setIsMobile(mq.matches);
      if (!mq.matches) setMobileMenuOpen(false);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("admin-mobile-menu-open", mobileMenuOpen);
    return () => document.body.classList.remove("admin-mobile-menu-open");
  }, [mobileMenuOpen]);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen((open) => !open);
    } else {
      setSidebarCollapsed((collapsed) => !collapsed);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const contentClass = [
    "content",
    "py-10",
    !isMobile && sidebarCollapsed ? "full" : "",
    isMobile ? "content-mobile" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const topbarClass = [
    !isMobile && sidebarCollapsed ? "full" : "",
    isMobile ? "topbar-mobile" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="admin-shell">
      {isMobile && mobileMenuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={closeMobileMenu}
        />
      )}

      <Topbar
        onToggleSidebar={handleToggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
      />

      <Sidebar
        collapsed={!isMobile && sidebarCollapsed}
        mobileOpen={isMobile && mobileMenuOpen}
        isMobile={isMobile}
        onClose={closeMobileMenu}
      />

      <main id="content" className={contentClass}>
        <div className="container-fluid admin-container">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
