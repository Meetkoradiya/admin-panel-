import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// imports
import AppMenuitem from "@/app/context/AppMenuitem";
import AppMenuIcon from "@/app/context/AppMenuIcons";
import { MenuProvider } from "@/app/context/menucontext";
import { LayoutContext } from "@/app/context/layoutcontent";
import { menuModel } from "./modals";
import { masterMenuModel } from "./masterModals";
import { APP_NAME } from "@/constants/app.constant";
import "./AppSidebar.scss";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { layoutState } = useContext(LayoutContext);
  const user = useSelector((state) => state.auth.userData);
  
  const currentMenuModel = user?.role === "MASTER_ADMIN" ? masterMenuModel : menuModel;

  const isCollapsed = layoutState.staticMenuDesktopInactive;

  const handleLogoClick = () => navigate("/");

  return (
    <MenuProvider>
      <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div
          className="side-nav-header"
          onClick={handleLogoClick}
        >
          <div className="logo-container">
            <div className="logo-icon relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 relative z-10"
              >
                <defs>
                  <linearGradient id="logo-grad" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 3C12 3 6 10 6 14.5C6 18.0899 8.68629 21 12 21C15.3137 21 18 18.0899 18 14.5C18 10 12 3 12 3Z"
                  fill="url(#logo-grad)"
                />
                <path
                  d="M12 21C15.3137 21 18 18.0899 18 14.5C18 10.9101 15.3137 8 12 8V21Z"
                  fill="white"
                  fillOpacity="0.1"
                />
                <path
                  d="M12 5.5C12 5.5 10 8.5 10 11.5C10 13.5 10.8954 15 12 15V5.5Z"
                  fill="white"
                  fillOpacity="0.25"
                />
                <circle cx="14.5" cy="11" r="1.2" fill="white" fillOpacity="0.5" />
                <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2"
                    stroke="#3b82f6"
                    strokeWidth="0.5"
                    strokeDasharray="3 3"
                    opacity="0.3"
                />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="logo-text">
                <span className="brand-name text-slate-800 font-bold tracking-tight">Amrut Water</span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="brand-tagline text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-500/80">Premium Quality</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-content">
          <ul className="layout-menu">
            {currentMenuModel.map((item, index) =>
              !item.seperator ? (
                <AppMenuitem
                  key={item.label}
                  item={item}
                  index={index}
                  root
                />
              ) : (
                <li key={index} className="menu-separator" />
              ),
            )}
          </ul>
        </div>

      </aside>
    </MenuProvider>
  );
};

export default AdminSidebar;
