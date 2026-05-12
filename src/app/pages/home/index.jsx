import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';

export default function Dashboard() {
  const navigate = useNavigate();
  const { apiGet } = useApi();

  const [stats, setStats] = useState({
    drivers: 0,
    routes: 0,
    customers: 0,
    pendingOrders: 0,
    onlineDrivers: 0,
    activeDeliveries: 0,
    pendingComplaints: 0
  });

  const [recentRoutes, setRecentRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    console.log("Dashboard: Starting data fetch...");
    
    try {
      // Fetch Drivers
      let driversList = [];
      try {
        const driversRes = await apiGet('/admin/drivers');
        driversList = driversRes?.data?.drivers || driversRes?.drivers || driversRes?.data || driversRes || [];
        if (!Array.isArray(driversList)) driversList = [];
        console.log("Dashboard: Drivers fetched", driversList.length);
      } catch (e) { console.error("Dashboard: Drivers fetch failed", e); }

      // Fetch Routes
      let routesList = [];
      try {
        const routesRes = await apiGet('/admin/routes');
        console.log("Dashboard: Routes raw response", routesRes);
        routesList = routesRes?.data?.routes || routesRes?.routes || routesRes?.data || routesRes || [];
        if (!Array.isArray(routesList)) routesList = [];
        console.log("Dashboard: Routes extracted", routesList.length);
      } catch (e) { console.error("Dashboard: Routes fetch failed", e); }

      // Fetch Customers
      let customersList = [];
      try {
        const customersRes = await apiGet('/admin/customers');
        customersList = customersRes?.data?.customers || customersRes?.customers || customersRes?.data || customersRes || [];
        if (!Array.isArray(customersList)) customersList = [];
      } catch (e) { console.warn("Dashboard: Customers fetch failed (might be expected)"); }

      // Fetch Complaints
      let complaintsList = [];
      try {
        const complaintsRes = await apiGet('/customer/admin/complaints');
        complaintsList = complaintsRes?.data?.complaints || complaintsRes?.complaints || complaintsRes?.data || complaintsRes || [];
        if (!Array.isArray(complaintsList)) complaintsList = [];
      } catch (e) { console.warn("Dashboard: Complaints fetch failed (might be expected)"); }

      // Calculate stats
      setStats({
        drivers: driversList.length,
        routes: routesList.length,
        customers: customersList.length,
        pendingOrders: 0,
        onlineDrivers: driversList.filter(d => d.status === 'ACTIVE' || d.status === true).length,
        activeDeliveries: routesList.filter(r => r.status === 'Active' || r.status === 'ACTIVE').length,
        pendingComplaints: complaintsList.filter(c => c.status === 'PENDING' || c.status === 'Open').length
      });

      // Prepare recent routes with driver names
      const recent = routesList.slice(-3).reverse().map(route => {
        const routeId = route.id || route._id;
        const driver = driversList.find(d => d.routeId === routeId || d.id === route.driverId);
        return {
          id: routeId,
          name: route.routeName || route.name || 'Unnamed Route',
          driver: driver ? (driver.username || driver.name) : 'Not Assigned',
          status: route.status || 'Active'
        };
      });
      
      console.log("Dashboard: Recent routes prepared", recent);
      setRecentRoutes(recent);

    } catch (globalError) {
      console.error("Dashboard: Global fetch error", globalError);
    } finally {
      setLoading(false);
    }
  }, [apiGet]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const cards = [
    {
      title: 'Total Drivers',
      value: stats.drivers,
      icon: '🚚'
    },
    {
      title: 'Total Routes',
      value: stats.routes,
      icon: '🛣️'
    },
    {
      title: 'Customers',
      value: stats.customers,
      icon: '👥'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: '📦'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome to Amrut Water
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all group"
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
              <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Routes */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Recent Routes
            </h2>
            <button 
              onClick={() => navigate('/admin/routes')}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                 <i className="pi pi-spin pi-spinner text-blue-500 text-3xl mb-3" />
                 <p className="text-slate-400 font-medium">Fetching live data...</p>
              </div>
            ) : recentRoutes.length > 0 ? (
              recentRoutes.map((route, i) => (
                <div key={route.id || i} className="flex items-center justify-between border border-slate-200 rounded-2xl p-4 hover:bg-slate-50 transition-all cursor-default group border-l-4 border-l-transparent hover:border-l-blue-500">
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {route.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Driver: {route.driver}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    route.status === 'Active' || route.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-700' 
                      : route.status === 'Pending' || route.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {route.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">No recent routes found in the system.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/admin/routes/add')}
                className="w-full bg-blue-500 hover:bg-blue-600 transition-all text-white py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/20"
              >
                + Create Route
              </button>
              <button 
                onClick={() => navigate('/admin/drivers/add')}
                className="w-full bg-slate-100 hover:bg-slate-200 transition-all text-slate-700 py-4 rounded-2xl font-semibold"
              >
                + Add Driver
              </button>
              <button 
                onClick={() => navigate('/admin/customers/add')}
                className="w-full bg-slate-100 hover:bg-slate-200 transition-all text-slate-700 py-4 rounded-2xl font-semibold"
              >
                + Add Customer
              </button>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                  <span className="text-green-800 text-sm font-medium">Drivers Online</span>
                  <span className="text-green-700 font-bold">{loading ? '...' : stats.onlineDrivers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="text-blue-800 text-sm font-medium">Active Deliveries</span>
                  <span className="text-blue-700 font-bold">{loading ? '...' : stats.activeDeliveries}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                  <span className="text-red-800 text-sm font-medium">Pending Complaints</span>
                  <span className="text-red-700 font-bold">{loading ? '...' : stats.pendingComplaints}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

