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
          { label: "Create Route", to: "/admin/routes/add", icon: "pi pi-plus text-violet-400" },
          { label: "Route List", to: "/admin/routes", icon: "pi pi-map text-violet-400" },
        ],
      },
      {
        label: "Product",
        icon: "pi pi-box text-orange-500",
        to: "/admin/products",
      },
      {
        label: "Inventory",
        icon: "pi pi-database text-emerald-500",
        to: "/admin/inventory/stock",
      },
      {
        label: "Drivers",
        icon: "pi pi-id-card text-sky-500",
        items: [
          { label: "Create Driver", to: "/admin/drivers/add", icon: "pi pi-user-plus text-sky-400" },
          { label: "Driver List", to: "/admin/drivers", icon: "pi pi-id-card text-sky-400" },
        ],
      },
      {
        label: "Customers",
        icon: "pi pi-users text-indigo-500",
        items: [
          { label: "Create Customer", to: "/admin/customers/add", icon: "pi pi-user-plus text-indigo-400" },
          { label: "Customer List", to: "/admin/customers", icon: "pi pi-users text-indigo-400" },
        ],
      },
      {
        label: "Device Verification",
        icon: "pi pi-shield text-emerald-500",
        to: "/admin/devices",
      },
      {
        label: "Complaints",
        icon: "pi pi-exclamation-triangle text-rose-500",
        to: "/admin/complaints",
      },
    ],
  },
  {
    label: "BILLING & FINANCE",
    items: [
      { label: "Orders", icon: "pi pi-shopping-cart text-amber-500", to: "/admin/orders" },
      { label: "Billings", icon: "pi pi-receipt text-teal-500", to: "/admin/billings" },
    ],
  },
  
];
