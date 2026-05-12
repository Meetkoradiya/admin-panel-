import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';

const MasterDashboard = () => {
    const navigate = useNavigate();
    const { apiGet } = useApi();
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalAdmins: 0,
        totalOutlets: 0,
        totalSubscriptions: 0,
        pendingVerification: 0,
        activeAdmins: 0,
        verifiedDevices: 0,
        expiredPlans: 0
    });

    const [recentAdmins, setRecentAdmins] = useState([]);

    const fetchMasterData = useCallback(async () => {
        setLoading(true);
        try {
            const [adminsRes, outletsRes, subsRes, devicesRes] = await Promise.allSettled([
                apiGet('/admin/admins'),
                apiGet('/admin/outlets'),
                apiGet('/admin/subscriptions'),
                apiGet('/admin/devices')
            ]);

            // Extract data from settled promises
            const admins = adminsRes.status === 'fulfilled' ? (adminsRes.value?.data?.admins || adminsRes.value?.admins || adminsRes.value?.data || adminsRes.value || []) : [];
            const outlets = outletsRes.status === 'fulfilled' ? (outletsRes.value?.data?.outlets || outletsRes.value?.outlets || outletsRes.value?.data || outletsRes.value || []) : [];
            const subs = subsRes.status === 'fulfilled' ? (subsRes.value?.data?.subscriptions || subsRes.value?.subscriptions || subsRes.value?.data || subsRes.value || []) : [];
            const devices = devicesRes.status === 'fulfilled' ? (devicesRes.value?.data?.devices || devicesRes.value?.devices || devicesRes.value?.data || devicesRes.value || []) : [];

            const adminsList = Array.isArray(admins) ? admins : [];
            const outletsList = Array.isArray(outlets) ? outlets : [];
            const subsList = Array.isArray(subs) ? subs : [];
            const devicesList = Array.isArray(devices) ? devices : [];

            setStats({
                totalAdmins: adminsList.length,
                totalOutlets: outletsList.length,
                totalSubscriptions: subsList.length,
                pendingVerification: devicesList.filter(d => d.status === 'PENDING').length,
                activeAdmins: adminsList.filter(a => a.status === 'ACTIVE' || a.status === true).length,
                verifiedDevices: devicesList.filter(d => d.status === 'VERIFIED' || d.status === 'APPROVED').length,
                expiredPlans: subsList.filter(s => s.status === 'EXPIRED').length
            });

            // Prepare recent admins
            const recent = adminsList.slice(-3).reverse().map(admin => ({
                id: admin.id || admin._id,
                name: admin.username || 'Unnamed Admin',
                outlet: outletsList.find(o => o.id === admin.outletId)?.name || 'Main Outlet',
                status: (admin.status === 'ACTIVE' || admin.status === true) ? 'Active' : 'Pending'
            }));
            setRecentAdmins(recent);

        } catch (error) {
            console.error("Master Dashboard: Global fetch error", error);
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => {
        fetchMasterData();
    }, [fetchMasterData]);

    const statCards = [
        {
            title: 'Total Admins',
            value: stats.totalAdmins,
            icon: '👨‍💼',
            bg: 'bg-blue-50 text-blue-500'
        },
        {
            title: 'Total Outlets',
            value: stats.totalOutlets,
            icon: '🏪',
            bg: 'bg-emerald-50 text-emerald-500'
        },
        {
            title: 'Subscriptions',
            value: stats.totalSubscriptions,
            icon: '📦',
            bg: 'bg-amber-50 text-amber-500'
        },
        {
            title: 'Pending Verification',
            value: stats.pendingVerification,
            icon: '🛡️',
            bg: 'bg-rose-50 text-rose-500'
        }
    ];

    return (
        <div className="animate-fade-in min-h-screen bg-slate-50/50 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Master Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">
                        System-wide overview and administrative control.
                    </p>
                </div>

                <button 
                    onClick={() => navigate('/master/admins/add')}
                    className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-blue-600/20"
                >
                    + Create Admin
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {statCards.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">
                                    {item.title}
                                </p>
                                <h2 className="text-3xl font-bold text-slate-800 mt-3">
                                    {loading ? '...' : item.value}
                                </h2>
                            </div>
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${item.bg} group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Admins */}
                <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-800">
                            Recent Admins
                        </h2>
                        <button 
                            onClick={() => navigate('/master/admins')}
                            className="text-blue-600 font-semibold text-sm hover:underline"
                        >
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                             <div className="text-center py-12 text-slate-400 font-medium">Loading system data...</div>
                        ) : recentAdmins.length > 0 ? (
                            recentAdmins.map((admin) => (
                                <div key={admin.id} className="flex items-center justify-between border border-slate-100 rounded-2xl p-4 hover:bg-slate-50 transition-all group border-l-4 border-l-transparent hover:border-l-blue-500">
                                    <div>
                                        <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                            {admin.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {admin.outlet}
                                        </p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                        admin.status === 'Active' 
                                            ? 'bg-green-50 text-green-600' 
                                            : 'bg-amber-50 text-amber-600'
                                    }`}>
                                        {admin.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 italic">
                                No recent administrators found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions & System Status */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">
                            Quick Actions
                        </h2>
                        <div className="space-y-4">
                            <button 
                                onClick={() => navigate('/master/admins/add')}
                                className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-4 rounded-2xl font-semibold shadow-lg shadow-blue-600/20"
                            >
                                + Create Admin
                            </button>
                            <button 
                                onClick={() => navigate('/master/outlets/add')}
                                className="w-full bg-slate-50 hover:bg-slate-100 transition-all text-slate-700 py-4 rounded-2xl font-semibold"
                            >
                                + Add Outlet
                            </button>
                            <button 
                                onClick={() => navigate('/master/subscriptions')}
                                className="w-full bg-slate-50 hover:bg-slate-100 transition-all text-slate-700 py-4 rounded-2xl font-semibold"
                            >
                                + Management Plans
                            </button>
                        </div>

                        <div className="mt-8 border-t border-slate-100 pt-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">
                                System Health
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <span className="text-emerald-800 text-sm font-medium">Active Admins</span>
                                    <span className="font-bold text-emerald-700">{loading ? '...' : stats.activeAdmins}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <span className="text-blue-800 text-sm font-medium">Verified Devices</span>
                                    <span className="font-bold text-blue-700">{loading ? '...' : stats.verifiedDevices}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
                                    <span className="text-rose-800 text-sm font-medium">Expired Plans</span>
                                    <span className="font-bold text-rose-700">{loading ? '...' : stats.expiredPlans}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterDashboard;