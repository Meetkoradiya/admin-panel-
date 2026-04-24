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
            <div className="logo-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
                <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
              </svg>
            </div>
            {!isCollapsed && (
              <div className="logo-text">
                <span className="brand-name">Amrut Water</span>
                <span className="brand-tagline">Pure Management</span>
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