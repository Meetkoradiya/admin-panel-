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
              <img
                src="/images/logo2.webp"
                alt="Amrut Water"
                className="w-10 h-10 relative z-10 object-contain"
              />
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
