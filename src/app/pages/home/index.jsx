import React, { useState, useEffect } from "react";
import { Page } from "@/components/shared/Page";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApi from "@/hooks/useApi";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);
  const { apiGet } = useApi();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: "₹0",
    orders: "0",
    bottlesDelivered: "1,240",
    activeCustomers: "0",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [ordersRes, customersRes] = await Promise.allSettled([
          apiGet('/orders/all'),
          apiGet('/admin/customers'),
        ]);

        const normalize = (res) => {
          if (res.status !== 'fulfilled') return [];
          const v = res.value;
          return Array.isArray(v) ? v : (Array.isArray(v?.data) ? v.data : []);
        };

        const fetchedOrders = normalize(ordersRes);
        const customers = normalize(customersRes);

        setStats({
          revenue: `₹${fetchedOrders.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0).toLocaleString()}`,
          orders: fetchedOrders.length.toString(),
          bottlesDelivered: "1,240",
          activeCustomers: customers.length.toString(),
        });
      } catch (e) {
        console.error('Dashboard error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [apiGet]);

  const statCards = [
    { label: 'Total Revenue', value: stats.revenue, sub: 'Monthly Growth: +12%', icon: 'pi pi-wallet', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Orders', value: stats.orders, sub: 'Processing: 5', icon: 'pi pi-shopping-bag', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Bottles Delivered', value: stats.bottlesDelivered, sub: 'Daily Target: 2k', icon: 'pi pi-filter', color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Active Customers', value: stats.activeCustomers, sub: 'New this week: 14', icon: 'pi pi-users', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const quickCards = [
    { title: "New Order", desc: "Create a fresh delivery order", icon: "pi pi-plus-circle", gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-200", url: "/admin/orders" },
    { title: "Customers", desc: "Manage your consumer base", icon: "pi pi-users", gradient: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-200", url: "/admin/customers" },
    { title: "Inventory", desc: "Check stock & water levels", icon: "pi pi-box", gradient: "from-violet-500 to-violet-600", shadow: "shadow-violet-200", url: "/admin/inventory/stock" },
    { title: "Reports", desc: "View detailed performance", icon: "pi pi-chart-line", gradient: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-200", url: "/admin/orders" },
  ];

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <Page title="Dashboard">
      <div className="flex flex-col gap-8 animate-fade-in pb-12">

        {/* HEADER */}
        <div className="bg-white/70 backdrop-blur-xl rounded-4xl p-8 shadow-sm hover:shadow-md transition-all border border-white/50">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-extrabold bg-linear-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                {greeting}, Admin 👋
              </h1>
              <p className="text-slate-500 font-medium mt-1">Here&apos;s a quick overview of your Amrut Water management system.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button
                label="Quick Order"
                icon="pi pi-plus"
                className="btn-primary"
                onClick={() => navigate('/admin/orders')}
              />
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-4xl p-6 shadow-sm border border-slate-50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} mb-4 group-hover:scale-110 transition-transform`}>
                <i className={`${s.icon} text-xl`} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{s.label}</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {loading ? <Skeleton width="4rem" /> : s.value}
                </h2>
                <p className="text-slate-400 text-[10px] font-bold">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className="px-2">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Quick Management</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickCards.map((card) => (
            <div
              key={card.url}
              className="bg-white rounded-4xl p-8 border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col items-start"
              onClick={() => navigate(card.url)}
            >
              <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${card.gradient} flex items-center justify-center mb-6 shadow-lg ${card.shadow} group-hover:scale-110 transition-transform text-white`}>
                <i className={`${card.icon} text-lg`} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{card.title}</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </Page>
  );
}


