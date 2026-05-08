import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const cards = [
    {
      title: 'Total Drivers',
      value: '24',
      icon: '🚚'
    },
    {
      title: 'Total Routes',
      value: '12',
      icon: '🛣️'
    },
    {
      title: 'Customers',
      value: '320',
      icon: '👥'
    },
    {
      title: 'Pending Orders',
      value: '18',
      icon: '📦'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome to Amrut Water Admin Panel
          </p>
        </div>

        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-slate-600 font-medium">
            Admin Panel
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all"
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

              <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Recent Routes
            </h2>

            <button 
              onClick={() => navigate('/admin/routes')}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-4">
              <div>
                <h3 className="font-semibold text-slate-800">
                  Naranpura to Navrangpura
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Driver: Rohit Parmar
                </p>
              </div>

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-4">
              <div>
                <h3 className="font-semibold text-slate-800">
                  Satellite to CG Road
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Driver: Meet Koradiya
                </p>
              </div>

              <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                Pending
              </span>
            </div>

            <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-4">
              <div>
                <h3 className="font-semibold text-slate-800">
                  Chandkheda to Motera
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Driver: Hiral Ladumor
                </p>
              </div>

              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                Completed
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Quick Actions
          </h2>

          <div className="space-y-4">
            <button 
              onClick={() => navigate('/admin/routes/add')}
              className="w-full bg-blue-500 hover:bg-blue-600 transition-all text-white py-4 rounded-2xl font-semibold"
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

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              System Status
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Drivers Online
                </span>

                <span className="text-green-600 font-bold">
                  18
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Active Deliveries
                </span>

                <span className="text-blue-600 font-bold">
                  42
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Pending Complaints
                </span>

                <span className="text-red-600 font-bold">
                  3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
