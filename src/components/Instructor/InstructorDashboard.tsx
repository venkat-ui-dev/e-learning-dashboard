import { notFound } from "next/navigation";
import CourseManagement from "@/components/Instructor/CourseManagement";
import PieChart from "@/components/Common/PieChart";

export default async function InstructorDashboard() {
    try {
        const courses = await fetch(`${process.env.API_URL}/api/instructor`, { cache: "no-store" }).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch courses.");
            return res.json();
        });

        const chartConfig = {
            labels: courses?.courses.map((course: any) => course.name) || [],
            title: "Student Distribution by Course",
            colors: [
                "rgba(34, 197, 94, 0.8)", // Green
                "rgba(59, 130, 246, 0.8)", // Blue
                "rgba(234, 179, 8, 0.8)", // Yellow
            ],
        };

        const chartData = courses?.courses.map((course: any) => course.students) || [];

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
                    <section
                        aria-labelledby="course-management-section"
                        tabIndex={0}
                    >
                        <CourseManagement initialCourses={courses?.courses} />
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
    } catch (error) {
        return notFound()
    }
}
