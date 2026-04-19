import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const DashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div
        id="overlay"
        className={`overlay ${mobileMenuOpen ? "show" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      <Topbar
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        sidebarCollapsed={sidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
      />

      <Sidebar
        collapsed={sidebarCollapsed}
        mobileShow={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main
        id="content"
        className={`content py-10 ${sidebarCollapsed ? "full" : ""}`}
      >
        <div className="container-fluid">{children}</div>
      </main>
    </>
  );
};

export default DashboardLayout;
