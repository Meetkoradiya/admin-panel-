export const masterMenuModel = [
  {
    label: "DASHBOARD",
    items: [
      { label: "Dashboard", icon: "pi pi-th-large text-blue-500", to: "/master/dashboard" },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        label: "Outlets",
        icon: "pi pi-map text-violet-500",
        items: [
          { label: "Create Outlets", to: "/master/outlets/add", icon: "pi pi-plus-circle text-violet-400" },
          { label: "Outlet list", to: "/master/outlets", icon: "pi pi-list text-violet-400" },
        ],
      },
      {
        label: "Admins",
        icon: "pi pi-users text-sky-500",
        items: [
          { label: "Create Admin", to: "/master/admins/add", icon: "pi pi-plus-circle text-sky-400" },
          { label: "Admin list", to: "/master/admins", icon: "pi pi-list text-sky-400" },
        ],
      },
      {
        label: "Device Verification",
        to: "/master/devices",
        icon: "pi pi-shield text-emerald-500",
      },
      {
        label: "Subscriptions",
        to: "/master/subscriptions",
        icon: "pi pi-ticket text-amber-500",
      },
    ],
  },
];
