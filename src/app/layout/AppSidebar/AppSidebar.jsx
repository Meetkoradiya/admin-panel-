import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// imports
// import logo from "@/assets/logo.svg?react";
const Logo = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
  </svg>
);
import AppMenuitem from "@/app/context/AppMenuitem";
import { MenuProvider } from "@/app/context/menucontext";
import { LayoutContext } from "@/app/context/layoutcontent";
import { menuModel } from "./modals";
import { masterMenuModel } from "./masterModals";
import "./AppSidebar.scss";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { layoutState } = useContext(LayoutContext);
  const user = useSelector((state) => state.auth.userData);

  const currentMenuModel =
    user?.role === "MASTER_ADMIN" ? masterMenuModel : menuModel;

  const handleLogoClick = () => navigate("/");

  return (
    <MenuProvider>
      <aside className="sidebar">
        <div className="side-nav-header" onClick={handleLogoClick}>
          <div className="logo-container">
            <div className="logo-icon relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl" />
              <Logo className="relative z-10 h-10 w-10 object-contain text-slate-800" />
            </div>
            <div className="logo-text">
              <span className="brand-name font-bold tracking-tight text-blue-600">
                Amrut Water
              </span>
              <div className="flex items-center gap-1">
                <span className="brand-tagline text-[8px] font-bold tracking-[0.12em] text-gray-500 uppercase">
                  Trust in Every Drop
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          <ul className="layout-menu">
            {currentMenuModel.map((item, index) =>
              !item.seperator ? (
                <AppMenuitem key={item.label} item={item} index={index} root />
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
