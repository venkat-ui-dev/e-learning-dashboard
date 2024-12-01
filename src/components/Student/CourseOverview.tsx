"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { RootState } from "@/store/store";
import { setCourses, setLoading } from "@/store/features/courseOverviewSlice";
import { Skelton } from "@/components/Common/Skelton";

interface Course {
    id: number;
    name: string;
    progress: number;
    status: string;
}

interface UpcomingSessionsProps {
    initialCourses: Course[];
}

export default function CourseOverview({ initialCourses }: UpcomingSessionsProps) {
    const dispatch = useDispatch();

    // Access state from Redux store
    const courses = useSelector((state: RootState) => state.courseOverview.courses);
    const loading = useSelector((state: RootState) => state.courseOverview.loading);

    useEffect(() => {
        // Set loading to true before updating courses
        dispatch(setLoading(true));

        // Dispatch initial courses to Redux store
        if (initialCourses) {
            dispatch(setCourses(initialCourses));
        }

        // Stop loading
        dispatch(setLoading(false));
    }, [initialCourses, dispatch]);

    // Pre-calculate progress details for courses
    const coursesWithProgress = useMemo(() => {
        return courses.map((course) => {
            const progressColor =
                course.progress === 100
                    ? "bg-green-500"
                    : course.progress >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500";

            const statusText =
                course.progress === 100
                    ? "Completed"
                    : course.progress > 0
                        ? "In Progress"
                        : "Not Started";

            return { ...course, progressColor, statusText };
        });
    }, [courses]);

    if (loading) {
        return (
            <Skelton />
        );
    }

    return (
        <section className="space-y-4" aria-labelledby="course-overview-heading">
            <h3
                id="course-overview-heading"
                className="text-lg font-semibold mb-2"
                tabIndex={0}
            >
                Course Overview
            </h3>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                role="list"
            >
                {coursesWithProgress.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-light dark:shadow-dark transition-all"
                        role="listitem"
                        aria-labelledby={`course-name-${course.id}`}
                    >
                        <div>
                            <h4
                                id={`course-name-${course.id}`}
                                className="font-bold text-lg text-gray-900 dark:text-white"
                                tabIndex={0}
                            >
                                {course.name}
                            </h4>
                            <p
                                className="text-gray-600 dark:text-gray-400"
                                aria-label={`Status: ${course.statusText}`}
                            >
                                {course.statusText}
                            </p>
                        </div>
                        <div className="mt-4">
                            <div
                                className="relative w-full h-2 bg-gray-300 text-gray-600 rounded-full"
                                aria-label={`Progress: ${course.progress}%`}
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={course.progress}
                            >
                                <div
                                    className={`absolute top-0 left-0 h-full ${course.progressColor} rounded-full`}
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {course.progress}% completed
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
