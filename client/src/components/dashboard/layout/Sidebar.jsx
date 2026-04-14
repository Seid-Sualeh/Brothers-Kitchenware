import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  IconHome,
  IconBox,
  IconPlus,
  IconReceipt,
  IconUser,
} from "@tabler/icons-react";
import { useAdminAuth } from "../../../context/AdminAuthContext";

const ALL_NAV = [
  { name: "Dashboard", icon: IconHome, path: "/admin/dashboard", roles: ["admin"] },
  { name: "Inventory", icon: IconBox, path: "/admin/inventory", roles: ["admin", "employee"] },
  { name: "Add Product", icon: IconPlus, path: "/admin/create-product", roles: ["admin", "employee"] },
  { name: "Add Employee", icon: IconUser, path: "/admin/add-employee", roles: ["admin"] },
  { name: "Reports", icon: IconReceipt, path: "/admin/reports", roles: ["admin", "employee"] },
];

export const Sidebar = ({ collapsed, mobileShow }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { staff, adminLogout } = useAdminAuth();

  const navItems = staff ? ALL_NAV.filter((item) => item.roles.includes(staff.role)) : ALL_NAV;

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/signin", { replace: true });
  };

  return (
    <aside
      id="sidebar"
      className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileShow ? "mobile-show" : ""}`}
      style={{ left: 0 }}
    >
      <div className="logo-area">
        <Link to={staff?.role === "employee" ? "/admin/inventory" : "/admin/dashboard"} className="d-inline-flex">
          <img src="/logo-icon.svg" alt="" width="24" />
          {!collapsed && (
            <span className="logo-text ms-2">
              <img src="/logo.svg" alt="" />
            </span>
          )}
        </Link>
      </div>
      <ul className="nav flex-column mt-4">
        <li className="px-4 py-2">
          <small className="nav-text text-muted">Main</small>
        </li>
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <item.icon size={18} />
              <span className="nav-text">{item.name}</span>
            </Link>
          </li>
        ))}

        <li className="px-4 pt-4 pb-2">
          <small className="nav-text text-muted">Account</small>
        </li>
        {staff ? (
          <li>
            <button type="button" className="nav-link btn btn-link text-start w-100 border-0 p-0 ps-4" onClick={handleLogout}>
              <span className="nav-text text-danger">Log out</span>
            </button>
          </li>
        ) : (
          <li>
            <Link to="/admin/signin" className="nav-link">
              <span className="nav-text">Log in</span>
            </Link>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
