import React, { useState, useEffect } from "react";
import { Page } from "@/components/shared/Page";
import StatisticsChart from "./StatisticsChart";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
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
    stockAlerts: "0",
    customers: "0",
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Simulated fetch or real fetch if endpoints exist
        const [ordersRes, customersRes, stocksRes] = await Promise.allSettled([
          apiGet('/admin/orders'),
          apiGet('/admin/customers'),
          apiGet('/admin/inventory'),
        ]);

        const normalize = (res) => {
          if (res.status !== 'fulfilled') return [];
          const v = res.value;
          return Array.isArray(v) ? v : (Array.isArray(v?.data) ? v.data : []);
        };

        const orders = normalize(ordersRes);
        const customers = normalize(customersRes);
        const stocks = normalize(stocksRes);

        setStats({
          revenue: `₹${orders.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0).toLocaleString()}`,
          orders: orders.length.toString(),
          stockAlerts: stocks.filter(s => (s.qty || s.quantity) < 10).length.toString(),
          customers: customers.length.toString(),
        });
      } catch (e) {
        console.error('Dashboard stats error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [apiGet]);

  const recentOrders = [
    { id: "ORD-942", customer: "Aman Sharma", status: "Delivered", amount: "₹500", date: "Today" },
    { id: "ORD-943", customer: "Sita Gupta", status: "In Progress", amount: "₹1,200", date: "Today" },
    { id: "ORD-944", customer: "Rajesh Kumar", status: "Delivered", amount: "₹750", date: "Yesterday" },
    { id: "ORD-945", customer: "Vikram Singh", status: "Pending", amount: "₹340", date: "Yesterday" },
  ];

  const statCards = [
    { label: 'Total Revenue', value: stats.revenue, sub: 'This Month', icon: 'pi pi-wallet', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: stats.orders, sub: 'Daily average: 12', icon: 'pi pi-shopping-bag', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Stock Alerts', value: stats.stockAlerts, sub: 'Low inventory items', icon: 'pi pi-exclamation-triangle', color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Total Customers', value: stats.customers, sub: '24 new this week', icon: 'pi pi-users', color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  const statusTemplate = (row) => {
    const map = {
      Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
      "In Progress": "bg-amber-50 text-amber-600 border-amber-100",
      Pending: "bg-rose-50 text-rose-600 border-rose-100",
    };

    return (
      <span className={`px-4 py-1 text-xs font-extrabold rounded-xl border ${map[row.status] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
        {row.status}
      </span>
    );
  };

  return (
    <Page title="Admin Dashboard">
      <div className="flex flex-col gap-8 animate-fade-in pb-12">
        {/* HEADER */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 shadow-sm hover:shadow-md transition-all border border-white/50">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black bg-linear-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                {greeting}, Admin 👋
              </h1>
              <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Pure Water Management System Overview</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button 
                label="New Order" 
                icon="pi pi-plus" 
                className="btn-primary btn-responsive"
                onClick={() => navigate('/admin/orders')}
              />
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[100px] -mr-8 -mt-8 opacity-50 group-hover:bg-blue-50 transition-colors" />
              <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} mb-6 group-hover:scale-110 transition-transform relative z-10`}>
                <i className={`${s.icon} text-xl`} />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 relative z-10">{s.label}</p>
              <div className="flex items-baseline gap-2 relative z-10">
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter">
                  {loading ? <Skeleton width="4rem" height="2rem" /> : s.value}
                </h2>
                <p className="text-slate-400 text-xs font-bold">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CHART */}
          <div className="lg:col-span-2 bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Revenue Analytics</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-blue-500" /> Revenue</span>
              </div>
            </div>
            <div className="h-[350px]">
              {loading ? <Skeleton height="100%" borderRadius="20px" /> : <StatisticsChart />}
            </div>
          </div>

          {/* RECENT ORDERS */}
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 hover:shadow-md transition-all flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Orders</h3>
              <Button icon="pi pi-arrow-right" className="p-button-rounded p-button-text p-button-sm text-blue-500" onClick={() => navigate('/admin/orders')} />
            </div>
            
            <div className="flex flex-col gap-6 flex-grow">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton shape="circle" size="3rem" />
                    <div className="flex-grow flex flex-col gap-2">
                      <Skeleton width="60%" height="1rem" />
                      <Skeleton width="40%" height="0.6rem" />
                    </div>
                  </div>
                ))
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm group-hover:scale-110 transition-transform">
                        {order.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{order.customer}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{order.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-800">{order.amount}</p>
                      {statusTemplate(order)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}