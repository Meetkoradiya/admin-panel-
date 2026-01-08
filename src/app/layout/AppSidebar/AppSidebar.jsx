import "./AppSidebar.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuProvider } from "../../context/menucontext";
import AppMenuitem from "../../context/AppMenuitem";
import DashboardsIcon from "../../../assets/dualicons/dashboards.svg?react";
import OrdersIcon from "../../../assets/dualicons/bag.svg?react";
import BillingIcon from "../../../assets/dualicons/ticket.svg?react";
import ComponentsIcon from "../../../assets/dualicons/prototypes.svg?react";
import RouteIcon from "../../../assets/dualicons/routes.svg?react";
import DriverIcon from "../../../assets/dualicons/useradd.svg?react";
import CustomersIcon from "../../../assets/dualicons/useradd.svg?react";

import Logo from "../../../assets/appLogo.svg?react";

const AppSidebar = () => {
  const navigate = useNavigate();
  const [originalModel, setOriginalModel] = useState([
    {
      label: "Dashboard",
      items: [
        {
          label: "Dashboard",
          Icon: DashboardsIcon,
          to: "/",
        },
      ],
    },

    {
      label: "Operations",
      items: [
        {
          label: "Routes",
          Icon: RouteIcon,
          items: [
            {
              label: "Role",
              to: "/role",
              Icon: ComponentsIcon,
            },
          ],
        },

        {
          label: "Inventory",
          Icon: ComponentsIcon,
          items: [
            {
              label: "Role",
              to: "/role",
              Icon: ComponentsIcon,
            },
          ],
        },
        {
          label: "Drivers",
          Icon: DriverIcon,
          items: [
            {
              label: "Role",
              to: "/role",
              Icon: ComponentsIcon,
            },
          ],
        },
        {
          label: "Customers",
          Icon: CustomersIcon,
          items: [
            {
              label: "Role",
              to: "/role",
              Icon: ComponentsIcon,
            },
          ],
        },
      ],
    },

    {
      label: "Billing & Finance",
      items: [
        {
          label: "Orders",
          Icon: OrdersIcon,
        },
        {
          label: "Billings",
          Icon: BillingIcon,
        },
      ],
    },

    // {
    //   label: "General",
    //   items: [],
    // },
  ]);

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <MenuProvider>
      <div className="sidebar">
        <div
          className="sidebar-header-image flex cursor-pointer flex-col"
          onClick={handleLogoClick}
        >
          <div className="flex items-center gap-2">
            <span>
              <Logo className="h-12 w-12 select-none" />
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-(--primary-color)">
                Amrut Water
              </span>
              <span className="text-xs">Smart Managment</span>
            </div>
          </div>
        </div>
        <ul className="layout-menu">
          {originalModel.map((item, i) => {
            return !item?.seperator ? (
              <AppMenuitem item={item} root={true} index={i} key={item.label} />
            ) : (
              <li className="menu-separator"></li>
            );
          })}
        </ul>
      </div>
    </MenuProvider>
  );
};

export default AppSidebar;
