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
        { label: "Dashboard", Icon: DashboardsIcon, to: "/master/dashboard" },
      ],
    },
    {
      label: "Operations",
      items: [
        {
          label: "Routes",
          Icon: RouteIcon,
          items: [
            { label: "Manage Routes", to: "/master/routes", Icon: ComponentsIcon },
          ],
        },
        {
          label: "Inventory",
          Icon: ComponentsIcon,
          items: [ { label: "Stock", to: "/master/inventory", Icon: ComponentsIcon } ],
        },
        {
          label: "Drivers",
          Icon: DriverIcon,
          items: [ { label: "List", to: "/master/drivers", Icon: ComponentsIcon } ],
        },
        {
          label: "Customers",
          Icon: CustomersIcon,
          items: [ { label: "Manage", to: "/master/customers", Icon: ComponentsIcon } ],
        },
      ],
    },
    {
      label: "Billing & Finance",
      items: [
        { label: "Orders", Icon: OrdersIcon, to: "/master/orders" },
        { label: "Billings", Icon: BillingIcon, to: "/master/billings" },
      ],
    },
  ]);

  return (
    <MenuProvider>
      <div className="sidebar">
        <div className="sidebar-header-image flex cursor-pointer flex-col" onClick={() => navigate("/")}>
          <div className="flex items-center gap-2">
            <Logo className="h-12 w-12 select-none" />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-(--primary-color)">Amrut Water</span>
              <span className="text-xs">Smart Management</span>
            </div>
          </div>
        </div>
        <ul className="layout-menu">
          {originalModel.map((item, i) => (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ))}
        </ul>
      </div>
    </MenuProvider>
  );
};

export default AppSidebar;