import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";

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

        // Normalize: API may return array directly or wrapped in { data: [...] }
        const normalize = (res) => {
          if (res.status !== 'fulfilled') return [];
          const v = res.value;
          return Array.isArray(v) ? v : (Array.isArray(v?.data) ? v.data : []);
        };

        const admins = normalize(adminsRes);
        const devices = normalize(devicesRes);

        setStats(prev => ({
          ...prev,
          totalAdmins: admins.length,
          activeAdmins: admins.filter(a => a.status === 'ACTIVE').length,
          pendingDevices: devices.filter(d => (d.status || d.approvalStatus || 'PENDING') === 'PENDING').length,
        }));
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
  ];

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="animate-fade-in space-y-8">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {greeting}, Master Admin 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            System health and administrative overview
          </p>
        </div>
        <button 
          onClick={() => navigate('/master/admins/add')}
          className="btn-primary px-8 py-3 h-auto"
        >
          <i className="pi pi-plus text-sm" />
          <span>New Administrator</span>
        </button>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} mb-5 group-hover:scale-110 transition-transform`}>
              <i className={`${s.icon} text-xl`} />
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tighter">{loadingStats ? '—' : s.value}</h2>
              <p className="text-slate-400 text-xs font-semibold">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="h-6 w-1.5 bg-blue-600 rounded-full" />
          <h2 className="text-xl font-bold text-slate-800">System Management</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickCards.map((card) => (
            <div
              key={card.url}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(card.url)}
            >
              <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${card.gradient} flex items-center justify-center mb-6 shadow-lg ${card.shadow} group-hover:scale-110 transition-transform text-white`}>
                <i className={`${card.icon} text-lg`} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">{card.title}</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasterDashboard;

