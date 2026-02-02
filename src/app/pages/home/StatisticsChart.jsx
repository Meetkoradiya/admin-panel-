import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { SelectButton } from "primereact/selectbutton";
import { Card } from "primereact/card";
import AnimatedCounter from "@/components/template/AnimatedCounter";
import { Chart as ChartJS } from "chart.js/auto";

const AnalyticsDashboard = () => {
    const [view, setView] = useState("Daily");
    const options = ["Daily", "Monthly", "Yearly"];

    useEffect(() => {
        ChartJS.defaults.color = "#64748b";
        ChartJS.defaults.font.family = "Inter, sans-serif";
    }, []);

    const chartConfig = {
        Daily: {
            title: "Daily Water Sales",
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
                borderColor: "#0ea5e9",
                backgroundColor: "rgba(14, 165, 233, 0.1)",
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#0ea5e9"
            }
        ]
    };

    const lineOptions = {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "#f1f5f9" }, border: { display: false } }
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6 bg-slate-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Analytics Dashboard
                    </h2>
                    <p className="text-sm text-slate-500">
                        Amrut Water Performance Overview
                    </p>
                </div>
                <SelectButton
                    value={view}
                    options={options}
                    onChange={(e) => e.value && setView(e.value)}
                />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard title="Orders" value={active.stats.orders} color="blue" />
                <SummaryCard
                    title="Revenue"
                    value={active.stats.revenue}
                    prefix="₹ "
                    color="cyan"
                />
                <SummaryCard
                    title="Growth"
                    value={active.stats.growth}
                    suffix="%"
                    color="emerald"
                />
            </div>

            {/* Chart Card */}
            <Card className="shadow-sm border-round-2xl border-none overflow-hidden">
                <div className="flex flex-col">
                    {/* Card Header */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                            <h3 className="text-lg font-bold text-slate-700 m-0">
                                {active.title}
                            </h3>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-600">
                            Live
                        </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-4" style={{ height: "350px" }}>
                        <Chart
                            type="line"
                            data={lineData}
                            options={lineOptions}
                            className="h-full w-full"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

/* Tailwind-safe color map */
const colorMap = {
    blue: "bg-blue-500",
    cyan: "bg-cyan-500",
    emerald: "bg-emerald-500"
};

const SummaryCard = ({ title, value, prefix = "", suffix = "", color }) => (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {title}
        </p>
        <div className="text-2xl font-black text-slate-800 mt-1 flex items-baseline gap-1">
            {prefix && <span className="text-slate-400 font-bold">{prefix}</span>}
            <AnimatedCounter to={value} />
            {suffix && <span className="text-slate-400 font-bold">{suffix}</span>}
        </div>
        <div
            className={`mt-3 h-1 w-12 rounded-full ${
                colorMap[color] || "bg-blue-500"
            }`}
        ></div>
    </div>
);

export default AnalyticsDashboard;
