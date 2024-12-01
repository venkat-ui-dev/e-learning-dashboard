"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";
import { Skelton } from "@/components/Common/Skelton";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartConfig {
    labels: string[];
    title: string;
    color: string;
}

interface LineChartProps {
    data: number[];
    chartConfig: ChartConfig;
}

// Dynamically import Line component for code splitting
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), { ssr: false, loading: () => <Skelton /> });

export default function LineChart({ data, chartConfig }: LineChartProps) {
    const { labels, title, color } = chartConfig;

    const useIsClient = () => {
        const [isClient, setIsClient] = useState(false);

        useEffect(() => {
            setIsClient(true);
        }, []);

        return isClient;
    }

    const isClient = useIsClient();
    const maintainAspectRatio = isClient && window.innerWidth < 640 ? false : true;

    // Memoize chart data to avoid re-computation on re-renders
    const chartData = useMemo(
        () => ({
            labels: labels || ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [
                {
                    label: "Performance",
                    data: data || [70, 75, 80, 85],
                    borderColor: color,
                    backgroundColor: color.replace("1)", "0.2)"), // Gradient fill
                    tension: 0.4, // Smooth curve
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: color,
                },
            ],
        }),
        [data, labels, color]
    );

    // Memoize chart options
    const options: ChartOptions<"line"> = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: maintainAspectRatio,
            plugins: {
                tooltip: { enabled: true },
                legend: { position: "top" },
                title: { display: !!title, text: title },
            },
        }),
        [title]
    );

    return (
        <div
            className="shadow-md rounded-lg p-4"
            role="img"
            aria-label={title}
            aria-live="polite"
        >
            {chartData && <Line data={chartData} options={options} />}
        </div>
    );
}
