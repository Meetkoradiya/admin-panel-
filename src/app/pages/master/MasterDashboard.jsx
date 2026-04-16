import React from "react";
import { useSelector } from "react-redux";

const MasterDashboard = () => {
  const user = useSelector((state) => state.auth.userData);

  const cards = [
    { title: "Create Admin", icon: "pi pi-user-plus", color: "bg-teal-500", url: "/master/admins/create" },
    { title: "Admin List", icon: "pi pi-users", color: "bg-blue-500", url: "/master/admins/list" },
    { title: "Subscriptions", icon: "pi pi-calendar", color: "bg-indigo-500", url: "/master/subscriptions" },
    { title: "Device Verification", icon: "pi pi-mobile", color: "bg-cyan-500", url: "/master/devices" },
    { title: "Contact Support", icon: "pi pi-envelope", color: "bg-sky-500", url: "/master/support" },
  ];

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Welcome to the Master Admin Panel, {user?.username}
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Here&apos;s an overview of your central management panel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="rounded-xl shadow-md bg-white p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-slate-100"
            onClick={() => console.log(`Navigating to ${card.url}`)}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl mb-4 ${card.color} shadow-sm`}>
              <i className={card.icon}></i>
            </div>
            <h3 className="text-lg font-bold text-slate-700 text-center">{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasterDashboard;
