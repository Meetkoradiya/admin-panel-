import React, { useState, useEffect } from "react";
import { Page } from "@/components/shared/Page";
import Button from "@/components/ui/Button";
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
    { label: 'Analytics 1', value: stats.analytics1, icon: 'pi-file-edit', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    { label: 'Analytics 2', value: stats.analytics2, icon: 'pi-clock', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    { label: 'Analytics 3', value: stats.analytics3, icon: 'pi-file', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
    { label: 'Analytics 4', value: stats.analytics4, icon: 'pi-chart-bar', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  ];

  const emptyTemplate = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <img src={successImg} alt="No Data" className="w-32 h-auto mb-6 opacity-40 grayscale" draggable="false" />
      <h4 className="text-lg font-bold text-slate-800 uppercase tracking-tight">No Active Records</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Logistics logs will appear here once orders are processed</p>
    </div>
  );

  const ExperienceCard = ({ title, subtitle }) => (
    <div className="bg-white rounded-3xl border border-slate-100 p-10 flex flex-col items-center justify-center text-center gap-6 shadow-sm hover:shadow-md transition-all">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
        <i className="pi pi-file text-3xl" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-800 uppercase tracking-tight">{title}</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <Page title="Overview">
      <div className="flex flex-col gap-10 animate-fade-in pb-20">

        {/* 1. TOP ANALYTICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsCards.map((card) => (
            <div key={card.label} className={`p-8 rounded-3xl border ${card.border} ${card.bg} flex flex-col gap-6 relative overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1`}>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</span>
                <h2 className="text-3xl font-black text-slate-900">{card.value}</h2>
              </div>
              <div className={`absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white flex items-center justify-center ${card.text} shadow-sm`}>
                <i className={`pi ${card.icon} text-xl`} />
              </div>
            </div>
          ))}
        </div>

        {/* 2. MAIN GRID (2 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: TABLES */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Administrative Logistics Log</h3>
                    <i className="pi pi-ellipsis-h text-slate-300 cursor-pointer hover:text-slate-500 transition-colors" />
                </div>
                <DataTable
                  value={[]} 
                  emptyMessage={emptyTemplate}
                  className="p-datatable-minimal"
                  responsiveLayout="scroll"
                >
                  <Column header="Order" headerClassName="px-8 py-4 bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 tracking-widest" />
                  <Column header="Date" headerClassName="py-4 bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 tracking-widest" />
                  <Column header="Quantity" headerClassName="py-4 bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 tracking-widest text-center" />
                  <Column header="Status" headerClassName="py-4 bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 tracking-widest text-center" />
                </DataTable>
              </div>
            ))}
          </div>

          {/* RIGHT: EXPERIENCE CARDS */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <ExperienceCard title="Analytical Experience" subtitle="Visualization Terminal" />
            <ExperienceCard title="Graph Data" subtitle="Distribution Metrics" />
            <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl shadow-blue-100">
                <h4 className="text-xl font-bold leading-tight mb-4 tracking-tight">&quot;Efficiency is doing things right.&quot;</h4>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-60">Master Directive</p>
                <i className="pi pi-bolt absolute -right-4 -bottom-4 text-8xl text-white/10" />
            </div>
          </div>

        </div>

      </div>
    </Page>
  );
}

