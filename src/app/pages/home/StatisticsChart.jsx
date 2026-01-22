import React from 'react';
import { Chart } from 'primereact/chart';

const StatisticsChart = () => {

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Sales',
                data: [45, 75, 50, 85, 60, 95],
                fill: true,
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                tension: 0.4,
                pointRadius: 0
            }
        ]
    };

    const pieData = {
        labels: ['Full', 'Empty', 'Refill'],
        datasets: [
            {
                data: [60, 25, 15],
                backgroundColor: ['#06b6d4', '#fbbf24', '#10b981'],
                borderWidth: 0
            }
        ]
    };

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 8,
                    font: { size: 10 },
                    usePointStyle: true
                }
            }
        },
        scales: {
            x: { display: false },
            y: { display: false }
        }
    };

    return (
        <div className="grid grid-cols-12 gap-3">

            {/* Revenue Overview */}
            <div className="col-span-12 md:col-span-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm overflow-hidden h-50">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Revenue Overview
                    </span>
                    <i className="pi pi-chart-line text-cyan-500 text-sm"></i>
                </div>

                <div className="relative h-35">
                    <Chart type="line" data={lineData} options={options} />
                </div>
            </div>

            {/* Inventory Status */}
            <div className="col-span-12 md:col-span-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm overflow-hidden h-50">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Inventory Status
                    </span>
                    <i className="pi pi-box text-amber-500 text-sm"></i>
                </div>

                <div className="relative h-35 flex justify-center">
                    <Chart type="pie" data={pieData} options={options} />
                </div>
            </div>

        </div>
    );
};

export default StatisticsChart;
