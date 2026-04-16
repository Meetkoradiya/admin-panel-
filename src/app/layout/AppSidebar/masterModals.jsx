import DashboardsIcon from "../../../assets/dualicons/dashboards.svg?react";
import ComponentsIcon from "../../../assets/dualicons/prototypes.svg?react";
import DriverIcon from "../../../assets/dualicons/useradd.svg?react";
import OrderIcon from "../../../assets/dualicons/bag.svg?react";

export const masterMenuModel = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", Icon: DashboardsIcon, to: "/master/dashboard" },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Admin Management",
        Icon: DriverIcon,
        to: "/master/admins",
      },
      {
        label: "Subscriptions",
        Icon: OrderIcon,
        to: "/master/subscriptions",
      },
      {
        label: "Device Verification",
        Icon: ComponentsIcon,
        to: "/master/devices",
      },
      {
        label: "Contact Support",
        Icon: ComponentsIcon,
        to: "/master/support",
      },
    ],
  },
];
