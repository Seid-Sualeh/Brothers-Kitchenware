import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBell,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarLeftCollapse,
} from "@tabler/icons-react";
import { adminApi } from "../../../lib/adminApi.js";
import { useAdminAuth } from "../../../context/AdminAuthContext";

export const Topbar = ({ onToggleSidebar, sidebarCollapsed }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { staff, adminLogout } = useAdminAuth();

  const loadNotifications = async () => {
    if (!staff) return;
    try {
      const { data } = await adminApi.get("/api/admin/notifications");
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();
    const t = setInterval(loadNotifications, 30000);
    return () => clearInterval(t);
  }, [staff?.id]);

  const unread = notifications.filter((n) => !n.read_at).length;

  const markRead = async (id) => {
    try {
      await adminApi.patch(`/api/admin/notifications/${id}/read`);
      loadNotifications();
    } catch {
      /* ignore */
    }
  };

  const fmtTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <nav
      id="topbar"
      className={`topbar d-flex align-items-center px-3 ${sidebarCollapsed ? "full" : ""}`}
    >
      <button
        id="toggleBtn"
        className="btn btn-light btn-icon btn-sm me-2"
        type="button"
        onClick={onToggleSidebar}
      >
        {sidebarCollapsed ? (
          <IconLayoutSidebarLeftCollapse size={18} />
        ) : (
          <IconLayoutSidebarLeftExpand size={18} />
        )}
      </button>

      <div className="d-flex align-items-center gap-1 ms-auto">
        {staff && (
          <div className="d-flex align-items-center gap-1">
            <div className="relative" style={{ position: "relative" }}>
              <button
                type="button"
                className="btn btn-light btn-icon btn-sm rounded-circle position-relative"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
              >
                <IconBell size={20} />
                {unread > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-2 ms-n2">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="dropdown-menu dropdown-menu-end show p-0 shadow"
                  style={{
                    minWidth: 320,
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    zIndex: 1000,
                  }}
                >
                  <ul
                    className="list-unstyled p-0 m-0"
                    style={{ maxHeight: 360, overflowY: "auto" }}
                  >
                    {notifications.length === 0 && (
                      <li className="p-3 text-muted small">
                        No notifications yet.
                      </li>
                    )}
                    {notifications.map((notif) => (
                      <li key={notif.id} className="p-3 border-bottom">
                        <button
                          type="button"
                          className="btn btn-link text-start text-decoration-none p-0 w-100 text-dark"
                          onClick={() => {
                            if (!notif.read_at) markRead(notif.id);
                          }}
                        >
                          <p className="mb-0 fw-semibold small">
                            {notif.title}
                          </p>
                          <p className="mb-1 small text-secondary">
                            {notif.body}
                          </p>
                          <div
                            className="text-secondary"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {fmtTime(notif.created_at)}
                            {!notif.read_at && (
                              <span className="badge bg-primary ms-2">New</span>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="dropdown ms-3" style={{ position: "relative" }}>
              <button
                type="button"
                className="btn btn-light btn-sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {staff.name}
              </button>

              {showUserMenu && (
                <div
                  className="dropdown-menu dropdown-menu-end show p-0 shadow"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    zIndex: 1000,
                    minWidth: 200,
                  }}
                >
                  <div className="px-3 py-2 border-bottom small text-muted">
                    {staff.email}
                  </div>
                  <div className="p-2">
                    <span className="badge bg-secondary text-uppercase">
                      {staff.role}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="dropdown-item text-danger"
                    onClick={() => {
                      adminLogout();
                      navigate("/admin/signin", { replace: true });
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Topbar;
