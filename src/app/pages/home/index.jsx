import React from "react";
import { Page } from "@/components/shared/Page";
import { RealTimeAnalytics } from "./RealTimeAnalytics";
import StatisticsChart from "./StatisticsChart";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom"; 

export default function UnifiedDashboard() {
  const navigate = useNavigate(); // Hook initialize karyo

  const recentOrders = [
    { id: "1001", customer: "Aman Sharma", status: "Delivered", amount: "₹500" },
    { id: "1002", customer: "Sita Gupta", status: "Pending", amount: "₹1200" },
    { id: "1003", customer: "Rajesh Kumar", status: "In Transit", amount: "₹750" },
  ];

  const statusBodyTemplate = (row) => {
    let severity = row.status === "Delivered" ? "success" : row.status === "Pending" ? "warning" : "info";
    return <Tag value={row.status} severity={severity} />;
  };

  return (
    <Page title="Amrut Water Dashboard">
      <div className="layout-dashboard pb-6 px-4">
        {/* KPI Section */}
        <div className="grid grid-cols-12 gap-4 mb-6">
          <div className="col-span-12">
            <Card className="shadow-sm border-round-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-700">Financial Overview</h2>
                <Button 
                  label="New Order" 
                  icon="pi pi-plus" 
                  className="p-button-sm p-button-info" 
                  onClick={() => navigate('/billing/orders')} // Billing/Order page par navigate
                />
              </div>
              <RealTimeAnalytics />
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <Card className="shadow-sm border-round-xl mb-4">
              <StatisticsChart />
            </Card>

            <Card title="Recent Deliveries" className="shadow-sm border-round-xl">
              <DataTable value={recentOrders} responsiveLayout="scroll" className="p-datatable-sm">
                <Column field="id" header="Order ID" />
                <Column field="customer" header="Customer" />
                <Column field="amount" header="Amount" />
                <Column field="status" header="Status" body={statusBodyTemplate} />
              </DataTable>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Live Inventory - Clickable Item */}
            <Card title="Live Inventory" className="shadow-sm border-round-xl">
              <div className="flex flex-col gap-3">
                <InventoryItem label="20L Water Cans" count={540} color="blue" />
                <InventoryItem label="1L Bottles" count={320} color="green" />
                <InventoryItem label="Plastic Crates" count={380} color="orange" />
                <Button 
                  label="Stock Management" 
                  icon="pi pi-box" 
                  className="p-button-outlined w-full mt-2" 
                  onClick={() => navigate('/operations/inventory/stock')} // Stock page
                />
              </div>
            </Card>

            {/* Quick Tasks - Buttons Click Logic */}
            <Card title="Quick Tasks" className="shadow-sm border-round-xl">
              <div className="flex flex-col gap-2">
                <Button 
                  label="Manage Drivers" 
                  icon="pi pi-truck" 
                  className="p-button-text text-left w-full" 
                  onClick={() => navigate('/operations/driver')} // Driver page
                />
                <Button 
                  label="View Route Maps" 
                  icon="pi pi-map" 
                  className="p-button-text text-left w-full" 
                  onClick={() => navigate('/operations/route')} // Route page
                />
                <Button 
                  label="Customer List" 
                  icon="pi pi-users" 
                  className="p-button-text text-left w-full" 
                  onClick={() => navigate('/operations/customer')} // Customer page
                />
                <Button 
                  label="Download Reports" 
                  icon="pi pi-file-pdf" 
                  className="p-button-text text-left w-full p-button-secondary" 
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}

const InventoryItem = ({ label, count, color }) => (
  <div className={`flex justify-between items-center p-3 border-round bg-${color}-50`}>
    <span className={`font-medium text-${color}-700`}>{label}</span>
    <span className={`text-lg font-bold text-${color}-900`}>{count}</span>
  </div>
);