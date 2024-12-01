"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";
import { Skelton } from "@/components/Common/Skelton";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: (number | string)[];
            backgroundColor: string | string[];
            borderColor?: string | string[];
            borderWidth?: number;
        }[];
    };
    title?: string;
    options?: ChartOptions<"bar">;
}

// Dynamically import Bar component for better performance
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
    ssr: false,
    loading: () => <Skelton />
});

export default function BarChart({ data, title, options }: BarChartProps) {
    const [isMobile, setIsMobile] = useState(false);

    // Determine if the user is on mobile
    useEffect(() => {
        const updateWindowSize = () => setIsMobile(window.innerWidth < 640);
        updateWindowSize();
        window.addEventListener("resize", updateWindowSize);
        return () => window.removeEventListener("resize", updateWindowSize);
    }, []);

    // Memoized chart data to avoid recalculation
    const chartData = useMemo(() => data, [data]);

    // Memoized chart options
    const defaultOptions: ChartOptions<"bar"> = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: !isMobile, // Adjust for mobile screens
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                },
                title: {
                    display: !!title,
                    text: title || "",
                },
            },
            scales: {
                x: {
                    ticks: {
                        maxRotation: isMobile ? 0 : 45,
                        autoSkip: true,
                    },
                    grid: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 10,
                    },
                    grid: {
                        color: "rgba(0,0,0,0.1)",
                    },
                },
            },
            ...options,
        }),
        [isMobile, title, options]
    );

    return (
        <div
            className="shadow-md rounded-lg p-4"
            role="region"
            aria-label={`Bar Chart: ${title || "Chart"}`}
        >
            <Bar data={chartData} options={defaultOptions} />
        </div>
    );
}
