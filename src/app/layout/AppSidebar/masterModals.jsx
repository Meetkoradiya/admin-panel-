import DashboardsIcon from "../../../assets/dualicons/dashboards.svg?react";
import ComponentsIcon from "../../../assets/dualicons/prototypes.svg?react";
import DriverIcon from "../../../assets/dualicons/useradd.svg?react";
import OrderIcon from "../../../assets/dualicons/bag.svg?react";
import UserScanIcon from "../../../assets/dualicons/userscan.svg?react";
import MessageIcon from "../../../assets/dualicons/alarm.svg?react";


export const masterMenuModel = [
  {
    label: "DASHBOARD",
    items: [
      { label: "Dashboard", Icon: DashboardsIcon, to: "/master/dashboard" },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        label: "Outlets",
        Icon: ComponentsIcon,
        items: [
          { label: "Create Outlets", to: "/master/outlets/add" },
          { label: "Outlet list", to: "/master/outlets" },
        ],
      },
      {
        label: "Admins",
        Icon: DriverIcon,
        items: [
          { label: "Create Admin", to: "/master/admins/add" },
          { label: "Admin list", to: "/master/admins" },
        ],
      },
      {
        label: "Device Verification",
        Icon: UserScanIcon,
        to: "/master/devices",
      },
      {
        label: "Subscriptions",
        Icon: OrderIcon,
        to: "/master/subscriptions",
      },
    ],
  },
];
