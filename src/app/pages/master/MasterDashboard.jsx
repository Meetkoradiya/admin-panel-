import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import Button from "@/components/ui/Button";
import { Page } from "@/components/shared/Page";

const MasterDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);
  const { apiGet } = useApi();

  const [stats, setStats] = useState({
    totalAdmins: '—',
    activeAdmins: '—',
    pendingDevices: '—',
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const adminPromise = apiGet('/admin/admins');
        const devicesPromise = apiGet('/auth/master/device-approvals');
        
        const [adminsRes, devicesRes] = await Promise.allSettled([
          adminPromise,
          devicesPromise,
        ]);

        const normalize = (res) => {
          if (res.status !== 'fulfilled') return [];
          const v = res.value;
          return Array.isArray(v) ? v : (Array.isArray(v?.data) ? v.data : []);
        };

        const admins = normalize(adminsRes);
        const devices = normalize(devicesRes);

        setStats({
          totalAdmins: admins.length,
          activeAdmins: admins.filter(a => a.status === 'ACTIVE').length,
          pendingDevices: devices.filter(d => (d.status || d.approvalStatus || 'PENDING') === 'PENDING').length,
        });
      } catch (e) {
        console.error('Dashboard stats error:', e);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [apiGet]);

  const quickCards = [
    { title: "Create Admin", desc: "Register a new administrator", icon: "pi pi-user-plus", gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-200", url: "/master/admins/add" },
    { title: "Admin List", desc: "View & manage all admins", icon: "pi pi-users", gradient: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-200", url: "/master/admins" },
    { title: "Subscriptions", desc: "Manage water plans", icon: "pi pi-calendar", gradient: "from-violet-500 to-violet-600", shadow: "shadow-violet-200", url: "/master/subscriptions" },
    { title: "Device Verification", desc: "Approve device requests", icon: "pi pi-mobile", gradient: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-200", url: "/master/devices" },
  ];

  const statCards = [
    { label: 'Total Admins', value: stats.totalAdmins, sub: `${stats.activeAdmins} active`, icon: 'pi pi-users', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Pending Devices', value: stats.pendingDevices, sub: 'Awaiting approval', icon: 'pi pi-mobile', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Active Outlets', value: '42', sub: 'Regional hubs', icon: 'pi pi-map-marker', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { label: 'System Health', value: '98%', sub: 'Global uptime', icon: 'pi pi-bolt', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  ];

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <Page title="Master Dashboard">
      <div className="flex flex-col gap-10 animate-fade-in pb-20">
        {/* HEADER */}
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-50 flex justify-between items-center flex-wrap gap-6">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {greeting}, <span className="text-blue-600">Master</span> 👋
                </h1>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Administrative Control Terminal</p>
            </div>
            <Button 
                label="New Admin" 
                icon="pi pi-plus" 
                onClick={() => navigate('/master/admins/add')}
                variant="primary"
                className="h-14 px-10 shadow-blue-500/20"
            />
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} mb-6 transition-transform group-hover:scale-110 shadow-inner`}>
                    <i className={`${s.icon} text-xl`} />
                </div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-black text-slate-800">{loadingStats && s.value === '—' ? '...' : s.value}</h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{s.sub}</p>
                </div>
            </div>
            ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex flex-col gap-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">System Core Protocols</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickCards.map((card) => (
                <div
                    key={card.url}
                    className="bg-white rounded-3xl p-8 border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col items-start"
                    onClick={() => navigate(card.url)}
                >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 shadow-lg ${card.shadow} group-hover:scale-110 transition-transform text-white`}>
                        <i className={`${card.icon} text-xl`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1 uppercase tracking-tight">{card.title}</h3>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{card.desc}</p>
                </div>
                ))}
            </div>
        </div>

        {/* INFRASTRUCTURE VIEW */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-16 shadow-sm flex flex-col items-center justify-center text-center gap-6">
            <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 shadow-inner mb-2">
                <i className="pi pi-globe text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Global Infrastructure Monitor</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] max-w-md leading-relaxed">Awaiting regional synchronization with administrative distribution hubs across the network architecture.</p>
        </div>
      </div>
    </Page>
  );
};

export default MasterDashboard;


