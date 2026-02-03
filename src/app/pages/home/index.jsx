import React, { useState, useEffect } from "react";
import { Page } from "@/components/shared/Page";
import { RealTimeAnalytics } from "./RealTimeAnalytics";
import StatisticsChart from "./StatisticsChart";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Skeleton } from "primereact/skeleton"; 
import { useNavigate } from "react-router-dom";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate a data fetch to show loading effects
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const recentOrders = [
    { id: "1001", customer: "Aman Sharma", status: "Delivered", amount: "₹500" },
    { id: "1002", customer: "Sita Gupta", status: "Pending", amount: "₹1200" },
    { id: "1003", customer: "Rajesh Kumar", status: "In Transit", amount: "₹750" },
  ];

  const statusBodyTemplate = (row) => {
    let severity = row.status === "Delivered" ? "success" : row.status === "Pending" ? "warning" : "info";
    return <Tag value={row.status} severity={severity} className="text-xs font-semibold" />;
  };

  return (
    <Page title="Amrut Water Dashboard">
      <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
        {/* KPI Section */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Card className="shadow-sm border-none ring-1 ring-slate-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 m-0">Financial Overview</h2>
                  <p className="text-slate-500 text-sm">Monitor your revenue and sales performance</p>
                </div>
                <Button 
                  label="New Order" 
                  icon="pi pi-plus" 
                  className="p-button-primary shadow-sm" 
                  onClick={() => navigate('/master/orders')} 
                />
              </div>
              {loading ? <Skeleton width="100%" height="150px" /> : <RealTimeAnalytics />}
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Card className="shadow-sm border-none ring-1 ring-slate-200">
              <h3 className="text-lg font-bold text-slate-700 mb-4">Sales Analytics</h3>
              {loading ? <Skeleton width="100%" height="300px" /> : <StatisticsChart />}
            </Card>

            <Card className="shadow-sm border-none ring-1 ring-slate-200">
              <h3 className="text-lg font-bold text-slate-700 mb-4">Recent Deliveries</h3>
              {loading ? (
                <Skeleton width="100%" height="200px" />
              ) : (
                <DataTable value={recentOrders} responsiveLayout="scroll" className="p-datatable-sm">
                  <Column field="id" header="Order ID" headerClassName="bg-slate-50 text-slate-600 font-bold" />
                  <Column field="customer" header="Customer" headerClassName="bg-slate-50 text-slate-600 font-bold" />
                  <Column field="amount" header="Amount" headerClassName="bg-slate-50 text-slate-600 font-bold" />
                  <Column field="status" header="Status" body={statusBodyTemplate} headerClassName="bg-slate-50 text-slate-600 font-bold" />
                </DataTable>
              )}
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Live Inventory */}
            <Card className="shadow-sm border-none ring-1 ring-slate-200">
               <h3 className="text-lg font-bold text-slate-700 mb-4">Live Inventory</h3>
               <div className="flex flex-col gap-3">
                {loading ? (
                  <>
                    <Skeleton height="3.5rem" />
                    <Skeleton height="3.5rem" />
                    <Skeleton height="3.5rem" />
                  </>
                ) : (
                  <>
                    <InventoryItem label="20L Water Cans" count={540} color="blue" />
                    <InventoryItem label="1L Bottles" count={320} color="green" />
                    <InventoryItem label="Plastic Crates" count={380} color="orange" />
                    <Button 
                      label="Stock Management" 
                      icon="pi pi-box" 
                      className="p-button-outlined p-button-secondary w-full mt-4" 
                      onClick={() => navigate('/master/inventory/stock')} 
                    />
                  </>
                )}
              </div>
            </Card>

            {/* Quick Tasks */}
            <Card className="shadow-sm border-none ring-1 ring-slate-200">
              <h3 className="text-lg font-bold text-slate-700 mb-4">Quick Tasks</h3>
              <div className="flex flex-col gap-2">
                <Button label="Manage Drivers" icon="pi pi-truck" className="p-button-text text-left w-full hover:bg-slate-50" onClick={() => navigate('/master/drivers')} />
                <Button label="View Route Maps" icon="pi pi-map" className="p-button-text text-left w-full hover:bg-slate-50" onClick={() => navigate('/master/routes')} />
                <Button label="Customer List" icon="pi pi-users" className="p-button-text text-left w-full hover:bg-slate-50" onClick={() => navigate('/master/customers')} />
                <Button label="billings" icon="pi pi-file-pdf" className="p-button-text text-left w-full hover:bg-slate-50" onClick={() => navigate('/master//billings')} />

              </div>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}

const InventoryItem = ({ label, count, color }) => (
  <div className={`flex justify-between items-center p-4 rounded-lg bg-${color}-50 border border-${color}-100`}>
    <span className={`font-semibold text-${color}-700`}>{label}</span>
    <span className={`text-xl font-black text-${color}-900`}>{count}</span>
  </div>
);