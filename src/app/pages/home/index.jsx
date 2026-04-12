import React, { useState, useEffect } from "react";
import { Page } from "@/components/shared/Page";
import { RealTimeAnalytics } from "./RealTimeAnalytics";
import StatisticsChart from "./StatisticsChart";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Skeleton } from "primereact/skeleton";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Beautiful loading transition
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const recentOrders = [
    { id: "ORD-942", customer: "Aman Sharma", status: "Delivered", amount: "₹500", date: "Today, 10:45 AM" },
    { id: "ORD-943", customer: "Sita Gupta", status: "In Progress", amount: "₹1,200", date: "Today, 11:30 AM" },
    { id: "ORD-944", customer: "Rajesh Kumar", status: "Delivered", amount: "₹750", date: "Yesterday, 4:15 PM" },
    { id: "ORD-945", customer: "Vikram Singh", status: "Pending", amount: "₹340", date: "Yesterday, 2:10 PM" },
  ];

  const statusTemplate = (row) => {
    let bg, text;
    switch (row.status) {
      case "Delivered": bg = "bg-emerald-100"; text = "text-emerald-700"; break;
      case "In Progress": bg = "bg-amber-100"; text = "text-amber-700"; break;
      case "Pending": bg = "bg-rose-100"; text = "text-rose-700"; break;
      default: bg = "bg-slate-100"; text = "text-slate-700";
    }
    return <span className={`px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-full ${bg} ${text} shadow-sm`}>{row.status}</span>;
  };

  const amountTemplate = (row) => <span className="font-extrabold text-slate-800">{row.amount}</span>;
  const customerTemplate = (row) => (
    <div>
        <span className="font-bold text-slate-800 block text-sm">{row.customer}</span>
        <span className="text-xs text-slate-400 font-medium">{row.date}</span>
    </div>
  );
  const idTemplate = (row) => <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md text-xs">{row.id}</span>;

  return (
    <Page title="Dashboard">
      <div className="min-h-full bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans">
        
        {/* Top Floating Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    Welcome Back, Admin <span className="text-3xl animate-bounce">👋</span>
                </h1>
                <p className="text-slate-500 font-medium mt-1">Here is exactly what&apos;s happening with your inventory today.</p>
            </div>
            <div className="flex gap-3">
                <Button label="View Reports" icon="pi pi-chart-pie" className="bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 border px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all hover:shadow hover:-translate-y-0.5" />
                <Button label="Generate Order" icon="pi pi-bolt" className="bg-gradient-to-r from-blue-600 to-indigo-600 border-none hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5" onClick={() => navigate("/admin/orders")} />
            </div>
        </div>

        {/* Global KPI Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard loading={loading} title="Total Revenue" value="₹45,231" trend="+14.5%" trendUp icon="pi-wallet" gradient="from-emerald-500 to-teal-500" shadow="shadow-emerald-200" />
            <StatCard loading={loading} title="Orders Today" value="184" trend="+5.2%" trendUp icon="pi-shopping-bag" gradient="from-blue-500 to-indigo-500" shadow="shadow-blue-200" />
            <StatCard loading={loading} title="Stock Alerts" value="12" trend="-2.1%" trendUp={false} icon="pi-exclamation-triangle" gradient="from-orange-500 to-amber-500" shadow="shadow-orange-200" />
            <StatCard loading={loading} title="Active Customers" value="892" trend="+1.2%" trendUp icon="pi-users" gradient="from-purple-500 to-pink-500" shadow="shadow-purple-200" />
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            
            {/* Chart Section */}
            <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 over hover:shadow-xl hover:border-slate-200 transition-all duration-300 group">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Revenue Analytics</h3>
                        <p className="text-sm font-medium text-slate-400">Monthly breakdown of gross income</p>
                    </div>
                    <div className="bg-slate-100 p-1 rounded-xl flex text-sm font-bold shadow-inner">
                        <span className="px-4 py-1.5 cursor-pointer bg-white shadow-sm text-slate-800 rounded-lg">Weekly</span>
                        <span className="px-4 py-1.5 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">Monthly</span>
                    </div>
                </div>
                <div className="h-[350px] w-full relative">
                    {loading ? <Skeleton width="100%" height="100%" borderRadius="16px" /> : <StatisticsChart />}
                </div>
            </div>

            {/* Inventory Snap Grid */}
            <div className="lg:col-span-4 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl shadow-xl p-6 relative overflow-hidden group">
                {/* Decorative BG Blob */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-30 group-hover:scale-125 group-hover:opacity-40 transition-all duration-700 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6">
                        <h3 className="text-2xl font-black text-white tracking-tight">Live Inventory</h3>
                        <p className="text-indigo-200 text-sm font-medium mt-1">Real-time stock measurements</p>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                        {loading ? (
                            <>
                                <Skeleton height="5rem" borderRadius="16px" className="bg-slate-800/50" />
                                <Skeleton height="5rem" borderRadius="16px" className="bg-slate-800/50" />
                                <Skeleton height="5rem" borderRadius="16px" className="bg-slate-800/50" />
                            </>
                        ) : (
                            <>
                                <DarkInventoryItem title="20L Premium Cans" qty="450" unit="units" color="text-cyan-400" bg="bg-cyan-400/10" border="border-cyan-400/20" icon="pi-box" />
                                <DarkInventoryItem title="1L Pet Bottles" qty="1,200" unit="bottles" color="text-amber-400" bg="bg-amber-400/10" border="border-amber-400/20" icon="pi-th-large" />
                                <DarkInventoryItem title="Empty Returns" qty="85" unit="cans" color="text-rose-400" bg="bg-rose-400/10" border="border-rose-400/20" icon="pi-sync" />
                            </>
                        )}
                    </div>
                    
                    <Button label="Manage All Stock" icon="pi pi-arrow-right" iconPos="right" className="w-full mt-6 bg-white/10 hover:bg-white/20 border-white/10 text-white py-3 rounded-xl font-bold backdrop-blur-sm transition-all" onClick={() => navigate("/admin/inventory/stock")} />
                </div>
            </div>
        </div>

        {/* Bottom Dual Frame */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Quick Actions Panel */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="mb-6">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Quick Operations</h3>
                    <p className="text-sm text-slate-400 font-medium">Jump straight into core management tools</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <ActionTile icon="pi-map" label="Routes" color="bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-600 hover:text-white hover:border-orange-600" onClick={() => navigate("/admin/routes")} />
                    <ActionTile icon="pi-users" label="Customers" color="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600" onClick={() => navigate("/admin/customers")} />
                    <ActionTile icon="pi-truck" label="Drivers" color="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-600" onClick={() => navigate("/admin/drivers")} />
                    <ActionTile icon="pi-comments" label="Complaints" color="bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-600 hover:text-white hover:border-purple-600" onClick={() => navigate("/admin/complaints")} />
                </div>
            </div>

            {/* Recent Live Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Recent Deliveries</h3>
                        <p className="text-sm text-slate-400 font-medium">Status of the most recent orders</p>
                    </div>
                    <Button icon="pi pi-expand" text rounded className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 w-8 h-8" tooltip="Expand View" />
                </div>

                {loading ? (
                    <Skeleton width="100%" height="220px" borderRadius="16px" />
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
                        <DataTable value={recentOrders} size="small" stripedRows rowHover className="p-datatable-sm bg-transparent">
                            <Column header="ID" body={idTemplate} headerClassName="bg-transparent text-slate-500 font-bold text-xs" />
                            <Column header="Customer" body={customerTemplate} headerClassName="bg-transparent text-slate-500 font-bold text-xs" />
                            <Column header="Status" body={statusTemplate} headerClassName="bg-transparent text-slate-500 font-bold text-xs" />
                            <Column header="Amount" body={amountTemplate} headerClassName="bg-transparent text-slate-500 font-bold text-xs" align="right" />
                        </DataTable>
                    </div>
                )}
            </div>
        </div>

      </div>
    </Page>
  );
}

// ---------------- MICRO COMPONENTS ---------------- //

const StatCard = ({ loading, title, value, trend, trendUp, icon, gradient, shadow }) => (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl hover:border-blue-100 flex flex-col justify-between min-h-[140px]">
        {loading ? (
            <div className="h-full w-full flex flex-col justify-between">
                <div className="flex justify-between"><Skeleton width="40%" height="1.5rem" /><Skeleton width="3rem" height="3rem" shape="circle" /></div>
                <Skeleton width="50%" height="2.5rem" />
            </div>
        ) : (
            <>
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-slate-500 tracking-tight">{title}</p>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} ${shadow} shadow-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300`}>
                        <i className={`pi ${icon} text-xl text-white`} />
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h2>
                    <div className="flex items-center gap-1.5 mt-2">
                        <i className={`pi ${trendUp ? 'pi-arrow-up text-emerald-500' : 'pi-arrow-down text-rose-500'} text-xs font-bold`} />
                        <span className={`text-xs font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>{trend} <span className="text-slate-400 font-medium">vs last month</span></span>
                    </div>
                </div>
            </>
        )}
    </div>
);

const DarkInventoryItem = ({ title, qty, unit, color, bg, border, icon }) => (
    <div className={`flex items-center justify-between p-4 rounded-2xl border origin-left ${bg} ${border} hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer`}>
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-black/20 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`pi ${icon} font-bold text-lg`} />
            </div>
            <div>
                <h4 className="text-white font-bold tracking-tight">{title}</h4>
                <p className="text-indigo-200/60 text-xs font-semibold uppercase tracking-wider">In Warehouse</p>
            </div>
        </div>
        <div className="text-right">
            <span className={`text-2xl font-black ${color} tracking-tight`}>{qty}</span>
            <span className="text-indigo-200/50 text-xs font-bold ml-1">{unit}</span>
        </div>
    </div>
);

const ActionTile = ({ icon, label, color, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center aspect-square p-4 rounded-2xl border shadow-sm transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 ${color}`}>
        <div className="transform group-hover:scale-110 transition-transform duration-300 mb-2">
            <i className={`pi ${icon} text-3xl opacity-80 group-hover:opacity-100`} />
        </div>
        <span className="font-bold tracking-tight text-sm opacity-90 group-hover:opacity-100">{label}</span>
    </button>
);
