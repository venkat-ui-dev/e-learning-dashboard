"use client";

import dynamic from "next/dynamic";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";
import { Skelton } from "@/components/Common/Skelton";

ChartJS.register(ArcElement, Tooltip, Legend);

// Dynamically import Pie chart with Skeleton loader
const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
    ssr: false,
    loading: () => <Skelton />,
});

interface ChartConfig {
    labels: string[];
    title: string;
    colors: string[];
}

interface PieChartProps {
    data: number[];
    config: ChartConfig;
}

export default function PieChart({ data, config }: PieChartProps) {
    const { labels, title, colors } = config;

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: title,
                data: data,
                backgroundColor: colors,
            },
        ],
    };

    const options: ChartOptions<"pie"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: !!title,
                text: title,
            },
        },
    };

    return (
        <div
            className="shadow-md rounded-lg p-4 bg-white dark:bg-gray-800"
            role="region"
            aria-labelledby="pie-chart-title"
        >
            <div
                className="relative w-full h-64 sm:h-80 md:h-96"
                role="img"
                aria-label={`Pie chart showing ${title}`}
            >
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
}
