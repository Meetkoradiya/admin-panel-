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
          { label: "Create Route", to: "/admin/routes/add", icon: "pi pi-circle-fill !text-[5px] size-2" },
          { label: "Route List", to: "/admin/routes", icon: "pi pi-circle-fill !text-[5px] size-2" },
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
          { label: "Create Driver", to: "/admin/drivers/add", icon: "pi pi-circle-fill !text-[5px] size-2" },
          { label: "Driver List", to: "/admin/drivers", icon: "pi pi-circle-fill !text-[5px] size-2" },
        ],
      },
      {
        label: "Customers",
        icon: "pi pi-users text-indigo-500",
        items: [
          { label: "Create Customer", to: "/admin/customers/add", icon: "pi pi-circle-fill !text-[5px] size-2" },
          { label: "Customer List", to: "/admin/customers", icon: "pi pi-circle-fill !text-[5px] size-2" },
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
