import React from 'react';
import { useNavigate } from 'react-router-dom';

const MasterDashboard = () => {
    const navigate = useNavigate();
    const stats = [
        {
            title: 'Total Admins',
            value: '12',
            icon: '👨‍💼',
            bg: 'bg-blue-100'
        },
        {
            title: 'Total Outlets',
            value: '8',
            icon: '🏪',
            bg: 'bg-green-100'
        },
        {
            title: 'Subscriptions',
            value: '154',
            icon: '📦',
            bg: 'bg-orange-100'
        },
        {
            title: 'Pending Verification',
            value: '6',
            icon: '🛡️',
            bg: 'bg-red-100'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Master Dashboard
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Welcome back, manage your entire system here.
                    </p>
                </div>

                <button 
                    onClick={() => navigate('/master/admins/add')}
                    className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-6 py-3 rounded-2xl font-semibold shadow-sm"
                >
                    + Create Admin
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">
                                    {item.title}
                                </p>

                                <h2 className="text-3xl font-bold text-slate-800 mt-3">
                                    {item.value}
                                </h2>
                            </div>

                            <div
                                className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${item.bg}`}
                            >
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
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">
                            Recent Admins
                        </h2>

                        <button 
                            onClick={() => navigate('/master/admins')}
                            className="text-blue-600 font-semibold text-sm"
                        >
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-4">
                            <div>
                                <h3 className="font-semibold text-slate-800">
                                    Meet Patel
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    Ahmedabad Outlet
                                </p>
                            </div>

                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                                Active
                            </span>
                        </div>

                        <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-4">
                            <div>
                                <h3 className="font-semibold text-slate-800">
                                    Rohit Parmar
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    Satellite Outlet
                                </p>
                            </div>

                            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                                Pending
                            </span>
                        </div>

                        <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-4">
                            <div>
                                <h3 className="font-semibold text-slate-800">
                                    Hiral Ladumor
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    Naranpura Outlet
                                </p>
                            </div>

                            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                                Verified
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">
                        Quick Actions
                    </h2>

                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate('/master/admins/add')}
                            className="w-full bg-blue-500 hover:bg-blue-600 transition-all text-white py-4 rounded-2xl font-semibold"
                        >
                            + Create Admin
                        </button>

                        <button 
                            onClick={() => navigate('/master/outlets/add')}
                            className="w-full bg-slate-100 hover:bg-slate-200 transition-all text-slate-700 py-4 rounded-2xl font-semibold"
                        >
                            + Add Outlet
                        </button>

                        <button 
                            onClick={() => navigate('/master/subscriptions')}
                            className="w-full bg-slate-100 hover:bg-slate-200 transition-all text-slate-700 py-4 rounded-2xl font-semibold"
                        >
                            + Add Subscription
                        </button>
                    </div>

                    {/* Activity */}
                    <div className="mt-8 border-t border-slate-200 pt-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">
                            System Activity
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">
                                    Active Admins
                                </span>

                                <span className="font-bold text-green-600">
                                    9
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">
                                    Verified Devices
                                </span>

                                <span className="font-bold text-blue-600">
                                    84
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">
                                    Expired Plans
                                </span>

                                <span className="font-bold text-red-600">
                                    2
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">
                        Outlet Performance
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-600">
                                    Ahmedabad
                                </span>

                                <span className="text-sm font-semibold">
                                    90%
                                </span>
                            </div>

                            <div className="w-full h-3 bg-slate-200 rounded-full">
                                <div className="h-3 w-[90%] bg-blue-500 rounded-full"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-600">
                                    Surat
                                </span>

                                <span className="text-sm font-semibold">
                                    75%
                                </span>
                            </div>

                            <div className="w-full h-3 bg-slate-200 rounded-full">
                                <div className="h-3 w-[75%] bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">
                        Recent Activity
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="h-3 w-3 rounded-full bg-blue-500 mt-2"></div>

                            <div>
                                <p className="text-sm text-slate-700">
                                    New admin created successfully
                                </p>

                                <span className="text-xs text-slate-400">
                                    2 min ago
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="h-3 w-3 rounded-full bg-green-500 mt-2"></div>

                            <div>
                                <p className="text-sm text-slate-700">
                                    Outlet subscription renewed
                                </p>

                                <span className="text-xs text-slate-400">
                                    10 min ago
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="h-3 w-3 rounded-full bg-red-500 mt-2"></div>

                            <div>
                                <p className="text-sm text-slate-700">
                                    Device verification pending
                                </p>

                                <span className="text-xs text-slate-400">
                                    1 hour ago
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterDashboard;