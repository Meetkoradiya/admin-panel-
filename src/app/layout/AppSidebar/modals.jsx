export const menuModel = [
  {
    label: "DASHBOARD",
    items: [
      { label: "Dashboard", icon: "pi pi-th-large text-blue-600", to: "/admin/dashboard" },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      {
        label: "Routes",
        icon: "pi pi-map text-blue-500",
        items: [
          { label: "Create Route", to: "/admin/routes/add", icon: "pi pi-plus text-blue-400" },
          { label: "Route List", to: "/admin/routes", icon: "pi pi-map text-blue-400" },
        ],
      },
      {
        label: "Product",
        icon: "pi pi-box text-indigo-500",
        to: "/admin/products",
      },
      {
        label: "Inventory",
        icon: "pi pi-database text-blue-500",
        to: "/admin/inventory/stock",
      },
      {
        label: "Drivers",
        icon: "pi pi-id-card text-blue-600",
        items: [
          { label: "Create Driver", to: "/admin/drivers/add", icon: "pi pi-user-plus text-blue-400" },
          { label: "Driver List", to: "/admin/drivers", icon: "pi pi-id-card text-blue-400" },
        ],
      },
      {
        label: "Customers",
        icon: "pi pi-users text-indigo-600",
        items: [
          { label: "Create Customer", to: "/admin/customers/add", icon: "pi pi-user-plus text-indigo-400" },
          { label: "Customer List", to: "/admin/customers", icon: "pi pi-users text-indigo-400" },
        ],
      },
      {
        label: "Device Verification",
        icon: "pi pi-shield text-blue-500",
        to: "/admin/devices",
      },
      {
        label: "Complaints",
        icon: "pi pi-exclamation-triangle text-blue-400",
        to: "/admin/complaints",
      },
    ],
  },
  {
    label: "BILLING & FINANCE",
    items: [
      { label: "Orders", icon: "pi pi-shopping-cart text-indigo-500", to: "/admin/orders" },
      { label: "Billings", icon: "pi pi-receipt text-blue-500", to: "/admin/billings" },
    ],
  },
  
];
