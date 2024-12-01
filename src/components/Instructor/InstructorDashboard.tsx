"use client";

import { useEffect, useState } from "react";
import CourseManagement from "@/components/Instructor/CourseManagement";
import PieChart from "@/components/Common/PieChart";
import { Loader } from "../Common/Loader";
import { toast } from "react-toastify";

export default function InstructorDashboard() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${process.env.API_URL}/api/instructor`);
                if (!response.ok) {
                    toast.error("Failed to fetch courses.");
                }
                const data = await response.json();
                setCourses(data.courses || []);
            } catch (err: any) {
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return toast.error(error);
    }

    const chartConfig = {
        labels: courses.map((course) => course.name),
        title: "Student Distribution by Course",
        colors: [
            "rgba(34, 197, 94, 0.8)", // Green
            "rgba(59, 130, 246, 0.8)", // Blue
            "rgba(234, 179, 8, 0.8)", // Yellow
        ],
    };

    const chartData = courses.map((course) => course.students);

    return (
        <div className="p-4 space-y-2 overflow-hidden">
            <h2
                className="text-2xl font-bold mb-4"
                tabIndex={0}
                aria-label="Instructor Dashboard"
            >
                Instructor Dashboard
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Course Management */}
                <section aria-labelledby="course-management-section" tabIndex={0}>
                    <CourseManagement initialCourses={courses} />
                </section>

                {/* Student Distribution */}
                <section
                    className="relative w-full h-[20rem] sm:h-[24rem] lg:h-[28rem]"
                    aria-labelledby="student-distribution-section"
                    tabIndex={0}
                >
                    <h3
                        id="student-distribution-section"
                        className="text-lg font-semibold mb-2"
                        tabIndex={0}
                        aria-label="Student distribution chart"
                    >
                        Student Distribution
                    </h3>
                    <div
                        className="w-full h-full"
                        role="region"
                        aria-labelledby="student-distribution-section"
                        tabIndex={0}
                    >
                        <PieChart data={chartData} config={chartConfig} />
                    </div>
                </section>
            </div>
        </div>
    );
}
