import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  IconHome,
  IconBox,
  IconPlus,
  IconReceipt,
  IconUser,
  IconArrowRight,
  IconX,
} from "@tabler/icons-react";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import logo from "../../../asset/images/logo3.png";

const ALL_NAV = [
  {
    name: "Dashboard",
    icon: IconHome,
    path: "/admin/dashboard",
    roles: ["admin"],
  },
  {
    name: "Inventory",
    icon: IconBox,
    path: "/admin/inventory",
    roles: ["admin", "employee"],
  },
  {
    name: "Add Product",
    icon: IconPlus,
    path: "/admin/create-product",
    roles: ["admin", "employee"],
  },
  {
    name: "Add Employee",
    icon: IconUser,
    path: "/admin/add-employee",
    roles: ["admin", "employee"],
  },
  {
    name: "Reports",
    icon: IconReceipt,
    path: "/admin/reports",
    roles: ["admin", "employee"],
  },
  {
    name: "Account",
    icon: IconUser,
    path: "/admin/account",
    roles: ["admin", "employee"],
    isAccount: true,
  },
];

export const Sidebar = ({ collapsed, mobileOpen, isMobile, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { staff, adminLogout } = useAdminAuth();

  const navItems = staff
    ? ALL_NAV.filter((item) => item.roles.includes(staff.role))
    : ALL_NAV.filter((item) => !item.isAccount);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/signin", { replace: true });
  };

  const goToStoreHome = () => {
    onClose?.();
    navigate("/");
  };

  const displayEmail = staff?.email ? staff.email.split("@")[0] : "";

  const profileInitial = staff?.name ? staff.name.charAt(0).toUpperCase() : "A";
  const profileColor = staff?.role === "admin" ? "#3b82f6" : "#22c55e";

  const sidebarClass = [
    "sidebar",
    collapsed ? "collapsed" : "",
    mobileOpen ? "mobile-open" : "",
    isMobile ? "sidebar-mobile" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside
      id="sidebar"
      className={sidebarClass}
      aria-hidden={isMobile && !mobileOpen}
    >
      <div className="logo-area">
        <button
          type="button"
          className="logo-area-btn border-0 bg-transparent p-0"
          aria-label="Brothers Home Goods home"
          onClick={goToStoreHome}
        >
          <img
            src={logo}
            alt="Brothers Home Goods logo"
            width="80"
            height="50"
          />
          <span className="sidebar-brand-sub d-md-none">Admin</span>
        </button>
        {isMobile && (
          <button
            type="button"
            className="sidebar-close-btn"
            aria-label="Close menu"
            onClick={() => onClose?.()}
          >
            <IconX size={22} />
          </button>
        )}
      </div>
      <ul className="nav flex-column mt-4">
        <li className="px-4 py-2">
          <small className="nav-text text-muted">Main</small>
        </li>
        {navItems
          .filter((item) => !item.isAccount)
          .map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => onClose?.()}
              >
                <item.icon size={18} />
                <span className="nav-text">{item.name}</span>
              </Link>
            </li>
          ))}

        <li className="px-4 pt-4 pb-2">
          <small className="nav-text text-muted">Account</small>
        </li>
        {staff && navItems.find((item) => item.isAccount) && (
          <li className="pb-2">
            {collapsed ? (
              <div className="nav-link d-flex align-items-center justify-content-center rounded-3 bg-light p-3">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: profileColor,
                    flexShrink: 0,
                    fontSize: 12,
                  }}
                >
                  {profileInitial}
                </div>
              </div>
            ) : (
              <div className="nav-link d-flex align-items-center justify-content-between gap-3 rounded-3 bg-light p-3">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: profileColor,
                      flexShrink: 0,
                      fontSize: 12,
                    }}
                  >
                    {profileInitial}
                  </div>
                  <div>
                    <div className="nav-text fw-semibold">{staff.name}</div>
                    <div className="nav-text small text-muted text-truncate sidebar-account-email">
                      {displayEmail}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-link text-start border-0 p-0 d-flex align-items-center gap-2"
                  style={{ minWidth: 0, color: "#e66239" }}
                  onClick={() => {
                    handleLogout();
                    onClose?.();
                  }}
                >
                  <IconArrowRight size={18} className="text-danger" />
                </button>
              </div>
            )}
          </li>
        )}
        {!staff && (
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
