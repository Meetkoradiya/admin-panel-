import React, { useEffect } from "react";
import { Chart } from "primereact/chart";
import { Chart as ChartJS } from "chart.js/auto";

const StatisticsChart = () => {
    useEffect(() => {
        ChartJS.defaults.color = "#94a3b8";
        ChartJS.defaults.font.family = "Inter, sans-serif";
    }, []);

    const lineData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                label: "Daily Sales",
                data: [120, 180, 150, 220, 300, 250, 200],
                fill: true,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.05)",
                tension: 0.45,
                pointRadius: 6,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#3b82f6",
                pointBorderWidth: 3,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: "#3b82f6",
                pointHoverBorderColor: "#fff",
                pointHoverBorderWidth: 4
            }
        ]
    };

    const lineOptions = {
        maintainAspectRatio: false,
        plugins: { 
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 12, weight: 'bold' },
                bodyFont: { size: 13 },
                borderRadius: 12,
                displayColors: false
            }
        },
        scales: {
            x: { 
                grid: { display: false },
                ticks: { font: { size: 10, weight: 'bold' } }
            },
            y: { 
                grid: { color: "#f8fafc", drawBorder: false },
                border: { display: false },
                ticks: { 
                    font: { size: 10, weight: 'bold' },
                    callback: (value) => '₹' + value 
                }
            }
        }
    };

    return (
        <div className="w-full h-full">
            <Chart
                type="line"
                data={lineData}
                options={lineOptions}
                className="h-full w-full"
            />
        </div>
    );
};

export default StatisticsChart;
