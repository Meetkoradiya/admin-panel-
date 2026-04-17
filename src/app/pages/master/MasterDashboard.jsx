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
    totalPlans: '—',
    pendingDevices: '—',
    totalComplaints: '—',
    openComplaints: '—',
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const [adminsRes, plansRes, devicesRes, complaintsRes] = await Promise.allSettled([
          apiGet('/admin/admins'),
          apiGet('/master/water-plans'),
          apiGet('/auth/master/device-approvals'),
          apiGet('/customer/admin/complaints'),
        ]);

        const admins = adminsRes.status === 'fulfilled' ? adminsRes.value : [];
        const plans = plansRes.status === 'fulfilled' ? plansRes.value : [];
        const devices = devicesRes.status === 'fulfilled' ? devicesRes.value : [];
        const complaints = complaintsRes.status === 'fulfilled' ? complaintsRes.value : [];

        setStats({
          totalAdmins: Array.isArray(admins) ? admins.length : '—',
          activeAdmins: Array.isArray(admins) ? admins.filter(a => a.status === 'ACTIVE').length : '—',
          totalPlans: Array.isArray(plans) ? plans.length : '—',
          pendingDevices: Array.isArray(devices) ? devices.filter(d => (d.status || d.approvalStatus || 'PENDING') === 'PENDING').length : '—',
          totalComplaints: Array.isArray(complaints) ? complaints.length : '—',
          openComplaints: Array.isArray(complaints) ? complaints.filter(c => c.status === 'PENDING' || c.status === 'IN_PROGRESS').length : '—',
        });
      } catch (e) {
        console.error('Dashboard stats error:', e);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const quickCards = [
    { title: "Create Admin", desc: "Register a new administrator", icon: "pi pi-user-plus", gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-200", url: "/master/admins/add" },
    { title: "Admin List", desc: "View & manage all admins", icon: "pi pi-users", gradient: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-200", url: "/master/admins" },
    { title: "Subscriptions", desc: "Manage water plans", icon: "pi pi-calendar", gradient: "from-violet-500 to-violet-600", shadow: "shadow-violet-200", url: "/master/subscriptions" },
    { title: "Device Verification", desc: "Approve device requests", icon: "pi pi-mobile", gradient: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-200", url: "/master/devices" },
    { title: "Contact Support", desc: "Handle customer complaints", icon: "pi pi-envelope", gradient: "from-sky-500 to-sky-600", shadow: "shadow-sky-200", url: "/master/support" },
  ];

  const statCards = [
    { label: 'Total Admins', value: stats.totalAdmins, sub: `${stats.activeAdmins} active`, icon: 'pi pi-users', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Water Plans', value: stats.totalPlans, sub: 'Subscription plans', icon: 'pi pi-calendar', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
    { label: 'Pending Devices', value: stats.pendingDevices, sub: 'Awaiting approval', icon: 'pi pi-mobile', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Open Complaints', value: stats.openComplaints, sub: `of ${stats.totalComplaints} total`, icon: 'pi pi-envelope', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-5rem)]">

      {/* Hero Welcome Banner */}
      <div className="bg-linear-to-br from-slate-800 via-slate-900 to-blue-900 rounded-3xl p-7 mb-6 shadow-2xl shadow-slate-400/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 60%)', pointerEvents: 'none'}} />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-blue-300 font-semibold text-sm mb-1">💧 {greeting}</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Amrut Water
            </h1>
            <p className="text-slate-400 mt-2 text-sm max-w-md">
              Your central command center for the Amrut Water Management System. Monitor, control, and manage everything from here.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl">
              💧
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-sm">Amrut Water</p>
              <p className="text-slate-400 text-xs">Master Admin Panel</p>
              <p className="text-blue-300 text-xs mt-1">{now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl shadow-sm p-5 border ${s.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-default`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} border ${s.border}`}>
                <i className={`${s.icon} text-base`} />
              </div>
            </div>
            <p className={`text-3xl font-black ${s.color} ${loadingStats ? 'animate-pulse' : ''}`}>
              {loadingStats ? '—' : s.value}
            </p>
            <p className="text-slate-600 font-semibold text-sm mt-0.5">{s.label}</p>
            <p className="text-slate-400 text-xs mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Access Grid */}
      <div className="mb-3">
        <h2 className="text-lg font-extrabold text-slate-800 mb-1">Quick Access</h2>
        <p className="text-slate-400 text-sm">Navigate to any management module</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {quickCards.map((card) => (
          <div
            key={card.url}
            className={`bg-linear-to-br ${card.gradient} rounded-2xl p-5 flex flex-col items-center justify-center text-white shadow-lg ${card.shadow} hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group`}
            onClick={() => navigate(card.url)}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all">
              <i className={`${card.icon} text-2xl`} />
            </div>
            <h3 className="text-sm font-extrabold text-center leading-tight">{card.title}</h3>
            <p className="text-white/70 text-xs text-center mt-1">{card.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MasterDashboard;
