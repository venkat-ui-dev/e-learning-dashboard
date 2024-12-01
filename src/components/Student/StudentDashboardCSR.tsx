"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Common/Cards";
import BarChart from "@/components/Common/BarChart";
import LineChart from "@/components/Common/LineChart";
import UpcomingSessions from "@/components/Student/UpcomingSessions";
import CourseOverview from "@/components/Student/CourseOverview";
import { CalendarDaysIcon, ChartBarIcon, TrophyIcon } from "@heroicons/react/24/solid";

export default function StudentDashboard() {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [initialSessions, setInitialSessions] = useState<any[]>([]);
    const [initialCourses, setInitialCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashboardRes, sessionsRes, coursesRes] = await Promise.all([
                    fetch(`${process.env.API_URL}/api/student`).then((res) => res.json()),
                    fetch(`${process.env.API_URL}/api/upcomingSessions`).then((res) => res.json()),
                    fetch(`${process.env.API_URL}/api/courses`).then((res) => res.json()),
                ]);

                setDashboardData(dashboardRes);
                setInitialSessions(sessionsRes);
                setInitialCourses(coursesRes);
            } catch (err: any) {
                console.log("Error fetching data:", err);
                setError("Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateImprovement = (performance: number[]) => {
        return performance.map((value, index, arr) => {
            if (index === 0) return 0;
            return ((value - arr[index - 1]) / arr[index - 1]) * 100;
        });
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    const improvementData = calculateImprovement(dashboardData.performance || [0, 0, 0, 0]);

    const barChartData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                label: "Improvement (%)",
                data: improvementData.map((val) => val.toFixed(2)),
                backgroundColor: "rgba(126, 58, 242, 0.8)",
                borderColor: "rgba(126, 58, 242, 1)",
                borderWidth: 1,
            },
        ],
    };

    const lineChartData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        title: "Weekly Performance Trends",
        color: "rgba(59, 130, 246, 1)",
    };

    return (
        <div className="p-4 space-y-6" role="main" aria-labelledby="student-dashboard-title">
            <h2 id="student-dashboard-title" className="text-2xl font-bold mb-4 pb-2" tabIndex={0}>
                Student Dashboard
            </h2>
            <div className="space-y-6">
                {/* Top Analytics Cards */}
                <section
                    aria-labelledby="analytics-section-title"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <h3 id="analytics-section-title" className="sr-only">
                        Analytics Overview
                    </h3>
                    <Card
                        icon={<TrophyIcon className="h-6 w-6" />}
                        title="Sessions Completed"
                        value={dashboardData.sessionsCompleted || 0}
                        gradientClasses="bg-gradient-to-r from-gray-50 via-indigo-100 to-indigo-50 dark:from-gray-800 dark:via-indigo-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
                        iconClasses="bg-indigo-600 text-white"
                        aria-label={`Sessions Completed: ${dashboardData.sessionsCompleted || 0}`}
                    />
                    <Card
                        icon={<CalendarDaysIcon className="h-6 w-6" />}
                        title="Upcoming Sessions"
                        value={dashboardData.upcomingSessions || 0}
                        gradientClasses="bg-gradient-to-r from-indigo-50 via-purple-100 to-purple-50 dark:from-indigo-800 dark:via-purple-900 dark:to-indigo-800 shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
                        iconClasses="bg-purple-600 text-white"
                        aria-label={`Upcoming Sessions: ${dashboardData.upcomingSessions || 0}`}
                    />
                    <Card
                        icon={<ChartBarIcon className="h-6 w-6" />}
                        title="Average Scores"
                        value={dashboardData.averageScore || 0}
                        gradientClasses="bg-gradient-to-r from-gray-50 via-teal-100 to-teal-50 dark:from-gray-800 dark:via-teal-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
                        iconClasses="bg-teal-600 text-white"
                        aria-label={`Average Scores: ${dashboardData.averageScore || 0}`}
                    />
                </section>

                {/* Performance Charts */}
                <section
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    aria-labelledby="charts-section-title"
                >
                    <h3 id="charts-section-title" className="sr-only">
                        Performance Charts
                    </h3>
                    <div>
                        <h3 className="text-lg font-semibold mb-2" tabIndex={0}>
                            Weekly Improvements Chart
                        </h3>
                        <BarChart
                            data={barChartData || [0, 0, 0, 0]}
                            title="Weekly Improvement (%)"
                            aria-label="Bar chart displaying weekly improvement percentage"
                            aria-describedby="Bar chart displaying weekly improvement percentage for the students"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2" tabIndex={0}>
                            Performance Chart
                        </h3>
                        <LineChart
                            data={dashboardData.performance || [0, 0, 0, 0]}
                            chartConfig={lineChartData}
                            aria-label="Line chart displaying weekly performance trends"
                            aria-describedby="Line chart displaying weekly performance trends for the students"
                        />
                    </div>
                </section>

                {/* Upcoming Sessions */}
                <UpcomingSessions initialSessions={initialSessions} />

                {/* Course Overview */}
                <CourseOverview initialCourses={initialCourses} />
            </div>
        </div>
    );
}
