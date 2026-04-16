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
      <aside className="sidebar">
        <div
          className="side-nav-header flex cursor-pointer"
          onClick={handleLogoClick}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-1 px-6 mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-droplets h-10 w-10 text-[var(--primary-color)]"
                aria-hidden="true"
              >
                <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
                <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
              </svg>
              <div className="flex flex-col whitespace-nowrap ml-2">
                <span className="text-xl font-bold text-slate-800 tracking-tight">
                  {APP_NAME}
                </span>
                <span className="text-[0.65rem] font-bold text-indigo-500 uppercase tracking-wider">
                  Smart Management
                </span>
              </div>
            </div>
          ) : (
            <div className="px-4 mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-droplets h-10 w-10 text-indigo-600"
                aria-hidden="true"
              >
                <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
                <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
              </svg>
            </div>
          )}
        </div>

        <div className="sidebar-section mt-6">
          {!isCollapsed ? (
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
                  <li key={index} className="menu-separator border-b border-slate-200 my-4" />
                ),
              )}
            </ul>
          ) : (
            <ul className="icon-menu">
              {currentMenuModel.map((item, index) => (
                <AppMenuIcon key={item.label} item={item} index={index} />
              ))}
            </ul>
          )}
        </div>
      </aside>
    </MenuProvider>
  );
};

export default AdminSidebar;