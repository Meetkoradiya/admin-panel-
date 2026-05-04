import { 
  LayoutDashboard, 
  Map, 
  Package, 
  Database, 
  UserRound, 
  Users, 
  ShieldCheck, 
  MessageSquareWarning, 
  ShoppingCart, 
  Receipt 
} from 'lucide-react';

export const menuModel = [
  {
    label: "DASHBOARD",
    items: [
      { label: "Dashboard", Icon: LayoutDashboard, iconColor: "text-blue-500", to: "/admin/dashboard" },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      {
        label: "Routes",
        Icon: Map,
        iconColor: "text-violet-500",
        items: [
          { label: "Create Route", to: "/admin/routes/add", icon: "pi pi-circle-fill !text-[5px] size-2" },
          { label: "Route List", to: "/admin/routes", icon: "pi pi-circle-fill !text-[5px] size-2" },
        ],
      },
      {
        label: "Product",
        Icon: Package,
        iconColor: "text-orange-500",
        to: "/admin/products",
      },
      {
        label: "Inventory",
        Icon: Database,
        iconColor: "text-emerald-500",
        to: "/admin/inventory/stock",
      },
      {
        label: "Drivers",
        Icon: UserRound,
        iconColor: "text-sky-500",
        items: [
          { label: "Create Driver", to: "/admin/drivers/add", icon: "pi pi-circle-fill !text-[5px] size-2" },
          { label: "Driver List", to: "/admin/drivers", icon: "pi pi-circle-fill !text-[5px] size-2" },
        ],
      },
      {
        label: "Customers",
        Icon: Users,
        iconColor: "text-indigo-500",
        items: [
          { label: "Create Customer", to: "/admin/customers/add", icon: "pi pi-circle-fill !text-[5px] size-2" },
          { label: "Customer List", to: "/admin/customers", icon: "pi pi-circle-fill !text-[5px] size-2" },
        ],
      },
      {
        label: "Device Verification",
        Icon: ShieldCheck,
        iconColor: "text-emerald-500",
        to: "/admin/devices",
      },
      {
        label: "Complaints",
        Icon: MessageSquareWarning,
        iconColor: "text-rose-500",
        to: "/admin/complaints",
      },
    ],
  },
  {
    label: "BILLING & FINANCE",
    items: [
      { label: "Orders", Icon: ShoppingCart, iconColor: "text-amber-500", to: "/admin/orders" },
      { label: "Billings", Icon: Receipt, iconColor: "text-teal-500", to: "/admin/billings" },
    ],
  },
];

