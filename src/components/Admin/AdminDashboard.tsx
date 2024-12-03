"use client";

import { useEffect, useState } from "react";
import UserManagement from "@/components/Admin/UserManagement";
import BarChart from "@/components/Common/BarChart";
import Card from "@/components/Common/Cards";
import { ChartPieIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/solid";
import { Loader } from "@/components/Common/Loader";
import { toast } from "react-toastify";
import styles from "./AdminDashboard.module.css"


const chartColors = {
    green: "rgba(34, 197, 94, 0.8)",
    blue: "rgba(59, 130, 246, 0.8)",
    yellow: "rgba(234, 179, 8, 0.8)",
    red: "rgba(255, 99, 71, 0.8)",
};

interface EngagementTrend {
    name: string;
    date: string;
    progressValue: number;
}

interface AdminDashboardData {
    totalUsers: number;
    engagementRate: string;
    newRegistrations: number;
    engagementTrends: EngagementTrend[];
}

interface UserManagementData {
    id: number;
    name: string;
    role: string;
    status: string;
}

export default function AdminDashboard() {
    const [adminDashboardData, setAdminDashboardData] = useState<AdminDashboardData | null>(null);
    const [userManagementData, setUserManagementData] = useState<UserManagementData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [dashboardResponse, userManagementResponse] = await Promise.all([
                    fetch(`${process.env.API_URL}/api/admin`).then((res) => {
                        if (!res.ok) toast.error("Failed to fetch admin dashboard data");
                        return res.json();
                    }),
                    fetch(`${process.env.API_URL}/api/users`).then((res) => {
                        if (!res.ok) toast.error("Failed to fetch user management data");
                        return res.json();
                    }),
                ]);

                setAdminDashboardData(dashboardResponse);
                setUserManagementData(userManagementResponse);
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return toast.error(error);
    }

    const chartData = {
        labels: adminDashboardData?.engagementTrends.map((engagementData) => engagementData.name) || [],
        datasets: [
            {
                label: "Engagement Trends(%)",
                data: adminDashboardData?.engagementTrends.map((engagementData) => engagementData.progressValue) || [0, 0, 0],
                backgroundColor: [chartColors.green, chartColors.blue, chartColors.red, chartColors.yellow]
            },
        ],
    };

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold mb-4" id="dashboard-title">
                Admin Dashboard
            </h2>
            <div>
                {/* Insights Cards */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    aria-labelledby="dashboard-title"
                    role="region"
                >
                    <Card
                        icon={<UsersIcon className="h-6 w-6" aria-label="Total Users Icon" />}
                        title="Total Users"
                        value={adminDashboardData?.totalUsers || 87}
                        gradientClasses={`${styles.card} ${styles['card-gradient-pink']} dark:from-pink-800 dark:via-rose-700 dark:to-gray-800`}
                        iconClasses="bg-pink-500 text-white"
                    />
                    <Card
                        icon={<ChartPieIcon className="h-6 w-6" aria-label="Engagement Rate Icon" />}
                        title="Engagement Rate"
                        value={`${adminDashboardData?.engagementRate || 87}`}
                        gradientClasses={`${styles.card} ${styles['card-gradient-blue']} dark:from-blue-800 dark:via-blue-700 dark:to-blue-800`}
                        iconClasses="bg-blue-600 text-white"
                    />
                    <Card
                        icon={<UserPlusIcon className="h-6 w-6" aria-label="New Registrations Icon" />}
                        title="New Registrations"
                        value={adminDashboardData?.newRegistrations || 87}
                        gradientClasses={`${styles.card} ${styles['card-gradient-green']} dark:from-green-800 dark:via-green-700 dark:to-green-800`}
                        iconClasses="bg-green-600 text-white"
                    />
                </div>
                {/* Engagement Metrics Chart */}
                <section className="mt-10" aria-labelledby="engagement-metrics-title" role="region">
                    <h3 className="text-lg font-semibold mb-2" id="engagement-metrics-title">
                        Engagement Metrics
                    </h3>
                    <div className="w-full max-w-screen-sm p-4">
                        <div className="relative w-full h-64 sm:h-80 lg:h-96">
                            <BarChart
                                data={chartData || [0, 0, 0, 0]}
                                title="User Engagement Metrics"
                            />
                        </div>
                    </div>
                </section>
                {/* User Management */}
                <section aria-labelledby="user-management-title" role="region">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold" id="user-management-heading">User Management</h2>
                    </div>
                    <UserManagement initialUserData={userManagementData || []} />
                </section>
            </div>
        </div>
    );
}
