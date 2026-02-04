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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const recentOrders = [
    { id: "1001", customer: "Aman Sharma", status: "Delivered", amount: "₹500" },
    { id: "1002", customer: "Sita Gupta", status: "Pending", amount: "₹1200" },
    { id: "1003", customer: "Rajesh Kumar", status: "In Transit", amount: "₹750" },
  ];

  const statusBodyTemplate = (row) => {
    const severity =
      row.status === "Delivered"
        ? "success"
        : row.status === "Pending"
        ? "warning"
        : "info";

    return <Tag value={row.status} severity={severity} />;
  };

  return (
    <Page title="Amrut Water Dashboard">
      <div className="bg-slate-50 min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header KPI */}
          <Card className="shadow-sm border border-slate-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Financial Overview
                </h2>
                <p className="text-sm text-slate-500">
                  Track revenue & performance
                </p>
              </div>
              <Button
                label="New Order"
                icon="pi pi-plus"
                disabled={loading}
                onClick={() => navigate("/master/orders")}
              />
            </div>

            {loading ? <Skeleton height="8rem" /> : <RealTimeAnalytics />}
          </Card>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Section */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <Card className="shadow-sm border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">
                  Sales Analytics
                </h3>
                {loading ? <Skeleton height="18rem" /> : <StatisticsChart />}
              </Card>

              <Card className="shadow-sm border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">
                  Recent Deliveries
                </h3>

                {loading ? (
                  <Skeleton height="12rem" />
                ) : (
                  <DataTable value={recentOrders} className="p-datatable-sm">
                    <Column field="id" header="Order ID" />
                    <Column field="customer" header="Customer" />
                    <Column field="amount" header="Amount" />
                    <Column
                      field="status"
                      header="Status"
                      body={statusBodyTemplate}
                    />
                  </DataTable>
                )}
              </Card>
            </div>

            {/* Right Section */}
            <div className="col-span-12 lg:col-span-4 space-y-6">

              {/* Live Inventory */}
              <Card className="shadow-sm border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">
                  Live Inventory
                </h3>

                {loading ? (
                  <div className="space-y-3">
                    <Skeleton height="3.5rem" />
                    <Skeleton height="3.5rem" />
                    <Skeleton height="3.5rem" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <InventoryItem label="20L Water Cans" count={540} variant="blue" />
                    <InventoryItem label="1L Bottles" count={320} variant="green" />
                    <InventoryItem label="Plastic Crates" count={380} variant="orange" />

                    <Button
                      label="Stock Management"
                      icon="pi pi-box"
                      className="w-full mt-2"
                      onClick={() => navigate("/master/inventory/stock")}
                    />
                  </div>
                )}
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-sm border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">
                  Quick Actions
                </h3>

                <div className="flex flex-col gap-2">
                  <Button label="Manage Drivers" icon="pi pi-truck" text onClick={() => navigate("/master/drivers")} />
                  <Button label="Routes" icon="pi pi-map" text onClick={() => navigate("/master/routes")} />
                  <Button label="Customers" icon="pi pi-users" text onClick={() => navigate("/master/customers")} />
                  <Button label="Billings" icon="pi pi-file-pdf" text onClick={() => navigate("/master/billings")} />
                </div>
              </Card>

              {/* System Summary */}
              <Card className="shadow-md border border-slate-200 p-6 bg-sky-50">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">
                  System Summary
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <SummaryBox title="Total Orders" value="154" color="text-sky-600" bg="bg-sky-100" />
                  <SummaryBox title="Pending" value="12" color="text-orange-600" bg="bg-orange-100" />
                  <SummaryBox title="Delivered" value="142" color="text-green-600" bg="bg-green-100" />
                  <SummaryBox title="Revenue" value="₹12,500" color="text-indigo-600" bg="bg-indigo-100" />
                </div>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

const styles = {
  blue: "bg-blue-50 border-blue-200 text-blue-800",
  green: "bg-green-50 border-green-200 text-green-800",
  orange: "bg-orange-50 border-orange-200 text-orange-800",
};

const InventoryItem = ({ label, count, variant }) => (
  <div className={`flex justify-between items-center p-4 rounded-lg border ${styles[variant]}`}>
    <span className="font-medium">{label}</span>
    <span className="text-xl font-bold">{count}</span>
  </div>
);

const SummaryBox = ({ title, value, color, bg }) => (
  <div className={`p-4 rounded-xl ${bg} border border-slate-200`}>
    <p className="text-sm text-slate-600">{title}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);
