import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { SelectButton } from "primereact/selectbutton";
import AnimatedCounter from "@/components/template/AnimatedCounter";
import { Chart as ChartJS } from 'chart.js/auto';

const AnalyticsDashboard = () => {
    const [view, setView] = useState("Daily");
    const options = ["Daily", "Monthly", "Yearly"];

    // This runs once when the component mounts
    useEffect(() => {
        ChartJS.defaults.backgroundColor = '#9BD0F5';
        ChartJS.defaults.borderColor = '#36A2EB';
        ChartJS.defaults.color = '#000';
        ChartJS.defaults.font.size = 16;
    }, []);

    const chartConfig = {
        Daily: {
            title: "Daily Sales",
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            data: [120, 180, 150, 220, 300, 250, 200],
            stats: { orders: 154, revenue: 12500, growth: 5 }
        },
        Monthly: {
            title: "Monthly Revenue",
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            data: [4500, 6000, 5200, 7000, 6800, 8500],
            stats: { orders: 1240, revenue: 850000, growth: 18 }
        },
        Yearly: {
            title: "Yearly Growth",
            labels: ["2021", "2022", "2023", "2024", "2025"],
            data: [55000, 68000, 82000, 95000, 110000],
            stats: { orders: 14850, revenue: 9200000, growth: 24 }
        }
    };

    const active = chartConfig[view];

    const lineData = {
        labels: active.labels,
        datasets: [
            {
                label: active.title,
                data: active.data,
                fill: true,
                borderColor: "#06b6d4",
                backgroundColor: "rgba(6, 182, 212, 0.15)",
                tension: 0.4,
                pointRadius: 4
            }
        ]
    };

    //Specific Chart Options (Overrides)
    const lineOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                labels: {
                    // This specific font property overrides the global ChartJS.defaults.font.size
                    font: {
                        size: 14 
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "#f1f5f9" } }
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Analytics Dashboard
                    </h2>
                    <p className="text-sm text-slate-500">
                        Performance overview for {view.toLowerCase()} activity
                    </p>
                </div>

                <SelectButton
                    value={view}
                    options={options}
                    onChange={(e) => e.value && setView(e.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard title="Orders" value={active.stats.orders} />
                <SummaryCard title="Revenue" value={active.stats.revenue} prefix="₹ " />
                <SummaryCard title="Growth" value={active.stats.growth} suffix="%" />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-96">
                <h3 className="text-lg font-semibold mb-4 text-slate-700">
                    {active.title}
                </h3>
                <div className="h-64">
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ title, value, prefix = "", suffix = "" }) => (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all hover:shadow-md">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <div className="text-2xl font-black text-slate-800 mt-1 flex items-baseline gap-1">
            {prefix && <span className="text-lg font-bold text-slate-400">{prefix}</span>}
            <AnimatedCounter to={value} />
            {suffix && <span className="text-lg font-bold text-slate-400">{suffix}</span>}
        </div>
    </div>
);

export default AnalyticsDashboard;