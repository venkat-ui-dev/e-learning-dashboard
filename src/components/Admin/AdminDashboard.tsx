import { notFound } from "next/navigation";
import UserManagement from "@/components/Admin/UserManagement";
import BarChart from "@/components/Common/BarChart";
import Card from "@/components/Common/Cards";
import { ChartPieIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/solid";

export default async function AdminDashboard() {
    try {
        const [adminDashboardData, userManagementData] = await Promise.all([
            fetch(`${process.env.API_URL}/api/admin`, { cache: "no-store" }).then((res) => {
                if (!res.ok) throw new Error("Failed to fetch student data");
                return res.json();
            }),
            fetch(`${process.env.API_URL}/api/users`, { cache: "no-store" }).then((res) => {
                if (!res.ok) throw new Error("Failed to fetch user Management Data");
                return res.json();
            })
        ])

        const chartData = {
            labels: ["React Fundamentals", "Advanced JS", "UI/UX Basics"],
            datasets: [
                {
                    label: "Engagement (%)",
                    data: adminDashboardData.engagementMetrics || [70, 85, 60],
                    backgroundColor: [
                        "rgba(34, 197, 94, 0.8)",
                        "rgba(59, 130, 246, 0.8)",
                        "rgba(234, 179, 8, 0.8)",
                    ],
                },
            ],
        };

        return (
            <div className="p-4 space-y-6">
                <h2 className="text-2xl font-bold mb-4" id="dashboard-title">Admin Dashboard</h2>
                <div className="space-y-6">
                    {/* Insights Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-labelledby="dashboard-title" role="region">
                        <Card
                            icon={<UsersIcon className="h-6 w-6" aria-label="Total Users Icon" />}
                            title="Total Users"
                            value={adminDashboardData.totalUsers || 87}
                            gradientClasses="bg-gradient-to-r from-pink-50 via-rose-100 to-white dark:from-pink-800 dark:via-rose-700 dark:to-gray-800 shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
                            iconClasses="bg-pink-500 text-white"
                        />
                        <Card
                            icon={<ChartPieIcon className="h-6 w-6" aria-label="Engagement Rate Icon" />} // Engagement Rate icon
                            title="Engagement Rate"
                            value={`${adminDashboardData.engagementRate || 87}`}
                            gradientClasses="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-800 dark:via-blue-700 dark:to-blue-800 shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
                            iconClasses="bg-blue-600 text-white"
                        />

                        <Card
                            icon={<UserPlusIcon className="h-6 w-6" aria-label="New Registrations Icon" />} // New Registrations icon
                            title="New Registrations"
                            value={adminDashboardData.newRegistrations || 87}
                            gradientClasses="bg-gradient-to-r from-green-100 via-green-200 to-green-100 dark:from-green-800 dark:via-green-700 dark:to-green-800 shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
                            iconClasses="bg-green-600 text-white"
                        />
                    </div>
                    {/* Engagement Metrics Chart */}
                    <section aria-labelledby="engagement-metrics-title" role="region">
                        <h3 className="text-lg font-semibold mb-2" id="engagement-metrics-title">Engagement Metrics</h3>
                        <div className="w-full max-w-screen-sm p-4">
                            <div className="relative w-full h-64 sm:h-80 lg:h-96">
                                <BarChart data={chartData || [0, 0, 0, 0]} title="User Engagement Metrics" />
                            </div>
                        </div>
                    </section>
                    {/* User Management */}
                    <section
                        aria-labelledby="user-management-title"
                        role="region"
                    >
                        <UserManagement initialUserData={userManagementData} />
                    </section>
                </div>
            </div>
        );


    } catch (error) {
        return notFound()
    }
}
