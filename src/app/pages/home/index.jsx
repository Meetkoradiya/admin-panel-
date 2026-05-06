import React, { useState, useEffect } from "react";
import { Page } from "@/components/shared/Page";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApi from "@/hooks/useApi";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import successImg from '@/assets/illustrations/success.png';

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);
  const { apiGet } = useApi();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    analytics1: "525",
    analytics2: "556",
    analytics3: "265",
    analytics4: "474",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const data = await apiGet('/orders/all');
        const ordersList = data?.data || data || [];
        setOrders(Array.isArray(ordersList) ? ordersList : []);

        // Mocking analytics numbers for the cards as seen in the user image
        setStats({
          analytics1: "525",
          analytics2: "556",
          analytics3: "265",
          analytics4: "474",
        });
      } catch (e) {
        console.error('Dashboard error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [apiGet]);

  const analyticsCards = [
    { label: 'Analytics 1', value: stats.analytics1, icon: 'pi-file-edit', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Analytics 2', value: stats.analytics2, icon: 'pi-clock', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Analytics 3', value: stats.analytics3, icon: 'pi-file', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { label: 'Analytics 4', value: stats.analytics4, icon: 'pi-chart-bar', bg: 'bg-amber-50', border: 'border-amber-100' },
  ];

  const emptyTemplate = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <img src={successImg} alt="No Data" className="w-32 h-auto mb-4 opacity-80 pointer-events-none select-none" draggable="false" />
      <h4 className="text-sm font-bold text-slate-800">No Orders Found</h4>
      <p className="text-[10px] text-slate-400 font-medium">This customer has not placed any orders yet.</p>
    </div>
  );

  const ExperienceCard = () => (
    <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center justify-center text-center gap-4 flex-1">
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
        <i className="pi pi-file text-3xl" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-800">Add your analytical experience here</h3>
        <p className="text-xs text-slate-400 font-medium mt-1">Show Graph data for better understanding</p>
      </div>
    </div>
  );

  return (
    <Page title="Overview">
      <div className="flex flex-col gap-8 animate-fade-in pb-20">

        {/* 1. TOP ANALYTICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsCards.map((card) => (
            <div key={card.label} className={`p-6 rounded-2xl border ${card.border} ${card.bg} flex flex-col gap-4 relative overflow-hidden`}>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-700">{card.label}</span>
                <h2 className="text-3xl font-black text-slate-900">{card.value}</h2>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                <i className={`pi ${card.icon} text-lg`} />
              </div>
            </div>
          ))}
        </div>

        {/* 2. MAIN GRID (2 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: TABLES */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <DataTable
                  value={[]} // Empty as per user screenshot
                  emptyMessage={emptyTemplate}
                  className="p-datatable-sm"
                  header={<div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <span>Order</span>
                    <span>Date</span>
                    <span>Quantity</span>
                    <span>Total</span>
                    <span>Driver</span>
                    <span>Status <i className="pi pi-sort-alt ml-1" /></span>
                  </div>}
                >
                  <Column field="order" />
                  <Column field="date" />
                  <Column field="qty" />
                  <Column field="total" />
                  <Column field="driver" />
                  <Column field="status" />
                </DataTable>
              </div>
            ))}
          </div>

          {/* RIGHT: EXPERIENCE CARDS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <ExperienceCard />
            <ExperienceCard />
          </div>

        </div>

      </div>
    </Page>
  );
}
