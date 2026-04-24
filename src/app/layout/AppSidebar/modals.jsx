import DashboardsIcon from "../../../assets/dualicons/dashboards.svg?react";
import OrdersIcon from "../../../assets/dualicons/bag.svg?react";
import BillingIcon from "../../../assets/dualicons/ticket.svg?react";
import ComponentsIcon from "../../../assets/dualicons/prototypes.svg?react";
import RouteIcon from "../../../assets/dualicons/routes.svg?react";
import DriverIcon from "../../../assets/dualicons/useradd.svg?react";
import CustomersIcon from "../../../assets/dualicons/group.svg?react";

export const menuModel = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", Icon: DashboardsIcon, to: "/admin/dashboard" },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Routes",
        Icon: RouteIcon,
        items: [
          { label: "Manage Routes", to: "/admin/routes", Icon: ComponentsIcon },
          { label: "Add Route", to: "/admin/routes/add", Icon: ComponentsIcon },
        ],
      },
      {
        label: "Drivers",
        Icon: DriverIcon,
        items: [
          { label: "Manage Drivers", to: "/admin/drivers", Icon: ComponentsIcon },
          { label: "Add Driver", to: "/admin/drivers/add", Icon: ComponentsIcon },
        ],
      },
      {
        label: "Customers",
        Icon: CustomersIcon,
        items: [
          { label: "Manage Customers", to: "/admin/customers", Icon: ComponentsIcon },
          { label: "Add Customer", to: "/admin/customers/add", Icon: ComponentsIcon },
        ],
      },
      {
        label: "Inventory",
        to: "/admin/inventory/stock",
        Icon: ComponentsIcon,
      },
      {
        label: "Products",
        to: "/admin/products",
        Icon: ComponentsIcon,
      },
    ],
  },
  {
    label: "Billing & Finance",
    items: [
      { label: "Orders", Icon: OrdersIcon, to: "/admin/orders" },
      { label: "Billings", Icon: BillingIcon, to: "/admin/billings" },
    ],
  },
];
