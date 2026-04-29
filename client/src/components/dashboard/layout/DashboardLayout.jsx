import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const DashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <Topbar
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      <Sidebar collapsed={sidebarCollapsed} onClose={() => {}} />

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
