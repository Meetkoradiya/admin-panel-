export const menuModel = [
  {
    label: "DASHBOARD",
    items: [
      { label: "Dashboard", icon: "pi pi-th-large text-blue-500", to: "/admin/dashboard" },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      {
        label: "Routes",
        icon: "pi pi-map text-violet-500",
        items: [
          { label: "Create route", to: "/admin/routes/add", icon: "pi pi-circle-fill text-[8px]" },
          { label: "Route list", to: "/admin/routes", icon: "pi pi-circle-fill text-[8px]" },
        ],
      },
      {
        label: "Product",
        to: "/admin/products",
        icon: "pi pi-box text-orange-500",
      },
      {
        label: "Inventory",
        to: "/admin/inventory/stock",
        icon: "pi pi-database text-emerald-500",
      },
      {
        label: "Drivers",
        icon: "pi pi-id-card text-sky-500",
        items: [
          { label: "Add Driver", to: "/admin/drivers/add", icon: "pi pi-circle-fill text-[8px]" },
          { label: "Driver list", to: "/admin/drivers", icon: "pi pi-circle-fill text-[8px]" },
        ],
      },
      {
        label: "Customers",
        icon: "pi pi-users text-indigo-500",
        items: [
          { label: "Add Customer", to: "/admin/customers/add", icon: "pi pi-circle-fill text-[8px]" },
          { label: "Customer list", to: "/admin/customers", icon: "pi pi-circle-fill text-[8px]" },
        ],
      },
      {
        label: "Device Verification",
        to: "/admin/devices",
        icon: "pi pi-shield text-emerald-500",
      },
      {
        label: "Complaints",
        to: "/admin/complaints",
        icon: "pi pi-exclamation-circle text-rose-500",
      },
    ],
  },
  {
    label: "BILLING & FINANCE",
    items: [
      { label: "Orders", icon: "pi pi-shopping-cart text-amber-500", to: "/admin/orders" },
      { label: "Billings", icon: "pi pi-ticket text-teal-500", to: "/admin/billings" },
    ],
  },
];
