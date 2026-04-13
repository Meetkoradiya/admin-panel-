import React, { useState, useEffect } from "react";
import { Page } from "@/components/shared/Page";
import StatisticsChart from "./StatisticsChart";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { useNavigate } from "react-router-dom";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const recentOrders = [
    { id: "ORD-942", customer: "Aman Sharma", status: "Delivered", amount: "₹500", date: "Today" },
    { id: "ORD-943", customer: "Sita Gupta", status: "In Progress", amount: "₹1,200", date: "Today" },
    { id: "ORD-944", customer: "Rajesh Kumar", status: "Delivered", amount: "₹750", date: "Yesterday" },
    { id: "ORD-945", customer: "Vikram Singh", status: "Pending", amount: "₹340", date: "Yesterday" },
  ];

  // STATUS UI
  const statusTemplate = (row) => {
    const map = {
      Delivered: "bg-green-100 text-green-700",
      "In Progress": "bg-yellow-100 text-yellow-700",
      Pending: "bg-red-100 text-red-600",
    };

    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-2 ${map[row.status]}`}>
        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
        {row.status}
      </span>
    );
  };

  return (
    <Page title="Dashboard">
      <div className="min-h-full bg-slate-50 p-6">

        {/* HEADER */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 mb-8 shadow hover:shadow-lg transition-all">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
                Welcome Back, Admin 👋
              </h1>
              <p className="text-slate-500 mt-1">Dashboard overview</p>
            </div>

            <div className="flex gap-3">
              <Button label="Reports" icon="pi pi-chart-pie" />
              <Button
                label="Orders"
                icon="pi pi-bolt"
                className="bg-blue-600 text-white"
                onClick={() => navigate("/admin/orders")}
              />
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Revenue" value="₹45,231" loading={loading} />
          <StatCard title="Orders" value="184" loading={loading} />
          <StatCard title="Stock Alerts" value="12" loading={loading} />
          <StatCard title="Customers" value="892" loading={loading} />
        </div>

        {/* CHART */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-4">Revenue Chart</h3>
          {loading ? (
            <Skeleton height="300px" />
          ) : (
            <StatisticsChart />
          )}
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-3xl p-6 shadow hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-4">Recent Orders</h3>

          {loading ? (
            <Skeleton height="200px" />
          ) : (
            <DataTable
              value={recentOrders}
              rowHover
              className="rounded-xl overflow-hidden"
              rowClassName={() => "hover:bg-indigo-50 cursor-pointer"}
            >
              <Column field="id" header="Order ID" />
              <Column field="customer" header="Customer" />
              <Column body={statusTemplate} header="Status" />
              <Column field="amount" header="Amount" />
            </DataTable>
          )}
        </div>
      </div>

      {/* GLOBAL ANIMATIONS */}
      <style>{`
        .hover-lift:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </Page>
  );
}

// STAT CARD COMPONENT
const StatCard = ({ title, value, loading }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
      {loading ? (
        <Skeleton height="80px" />
      ) : (
        <>
          <h4 className="text-slate-500 font-bold">{title}</h4>
          <h2 className="text-3xl font-extrabold mt-2">{value}</h2>
        </>
      )}
    </div>
  );
};