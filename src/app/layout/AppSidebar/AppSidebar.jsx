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
                  <linearGradient id="logo-grad-main" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <filter id="glass-effect">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
                  </filter>
                </defs>
                {/* Outer Glow Ring */}
                <circle cx="12" cy="13" r="9" stroke="url(#logo-grad-main)" strokeWidth="0.5" strokeDasharray="4 2" opacity="0.4" />
                {/* Main Premium Drop */}
                <path
                  d="M12 3C12 3 6 10 6 14.5C6 18.0899 8.68629 21 12 21C15.3137 21 18 18.0899 18 14.5C18 10 12 3 12 3Z"
                  fill="url(#logo-grad-main)"
                />
                {/* Glass Inner Reflection */}
                <path
                  d="M12 6C12 6 8.5 10.5 8.5 14C8.5 15.933 10.067 17.5 12 17.5C13.933 17.5 15.5 15.933 15.5 14C15.5 10.5 12 6 12 6Z"
                  fill="white"
                  fillOpacity="0.25"
                  filter="url(#glass-effect)"
                />
                <circle cx="14" cy="10" r="1.5" fill="white" fillOpacity="0.4" />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="logo-text">
                <span className="brand-name text-slate-800 font-black tracking-tight">Amrut Water</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="h-[2px] w-3 bg-blue-500 rounded-full" />
                  <span className="brand-tagline text-[9px] font-black uppercase tracking-[0.25em] text-blue-600">Premium Quality</span>
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