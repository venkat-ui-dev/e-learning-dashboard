"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { RootState } from "@/store/store";
import Modal from "@/components/Common/Modal";
import { setCourses, addCourse, updateCourse, deleteCourse } from "@/store/features/courseManagementSlice";
import { toast } from "react-toastify";

interface Course {
    id: number;
    name: string;
    progress: number;
    students: number;
}

interface CompleteCourses {
    initialCourses: Course[];
}

export default function CourseManagement({ initialCourses }: CompleteCourses) {
    const dispatch = useDispatch();
    const courses = useSelector((state: RootState) => state.courseManagement.courses);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Initialize Redux state with initialCourses
    useEffect(() => {
        dispatch(setCourses(initialCourses));
    }, [initialCourses, dispatch]);

    const handleEdit = (course: Course) => {
        setSelectedCourse(course);
        setIsEditModalOpen(true);
        setErrorMessage(null);
    };

    const handleEditSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedCourse) return;

        const form = event.target as HTMLFormElement;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
        const progressValue = (form.elements.namedItem("progress") as HTMLInputElement).value;
        const progress = parseInt(progressValue, 10);

        if (!name || progressValue === "" || isNaN(progress)) {
            setErrorMessage("All fields are required.");
            return;
        }

        try {
            const updatedCourse = { ...selectedCourse, name, progress };
            const response = await fetch(`/api/instructor`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCourse),
            });

            if (!response.ok) {
                throw new Error("Failed to update course.");
            }

            dispatch(updateCourse(updatedCourse));
            toast.success("Course updated successfully!");
        } catch (error: any) {
            toast.error(error.message || "Error updating course.");
        }

        setIsEditModalOpen(false);
        setSelectedCourse(null);
        setErrorMessage(null);
    };

    const handleDelete = async () => {
        if (!selectedCourse) return;

        try {
            const response = await fetch(`/api/instructor?id=${selectedCourse.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete course.");
            }

            dispatch(deleteCourse(selectedCourse.id));
            toast.success("Course deleted successfully!");
        } catch (error: any) {
            toast.error(error.message || "Error deleting course.");
        }

        setIsDeleteModalOpen(false);
        setSelectedCourse(null);
    };

    const handleAddSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
        const progressValue = (form.elements.namedItem("progress") as HTMLInputElement).value;
        const progress = parseInt(progressValue, 10);

        if (!name || progressValue === "" || isNaN(progress)) {
            setErrorMessage("All fields are required.");
            return;
        }

        try {
            const newCourse = { id: Date.now(), name, progress, students: 0 };
            const response = await fetch(`/api/instructor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCourse),
            });

            if (!response.ok) {
                throw new Error("Failed to add course.");
            }

            dispatch(addCourse(newCourse));
            toast.success("Course added successfully!");
        } catch (error: any) {
            toast.error(error.message || "Error adding course.");
        }

        setIsAddModalOpen(false);
        setErrorMessage(null);
    };

    const handleAddNewCourse = () => {
        setIsAddModalOpen(true);
    };

    return (
        <div id="courseManagement">
            <h2 className="text-lg font-semibold" tabIndex={0}>
                Course Management
            </h2>

            <div className="flex justify-end mb-4">
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                    onClick={handleAddNewCourse}
                    aria-label="Add new course"
                >
                    <PlusCircleIcon className="h-5 w-5 inline-block mr-2" />
                    Add Course
                </button>
            </div>

            <section className="max-h-80 overflow-y-auto">
                {courses.length === 0 ? (
                    <p className="text-gray-500" role="alert">
                        No courses available.
                    </p>
                ) : (
                    courses.map((course) => (
                        <div
                            key={course.id}
                            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center mb-2"
                            tabIndex={0}
                            aria-label={`Course: ${course.name}, Progress: ${course.progress}%`}
                        >
                            <div>
                                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {course.name}
                                </h3>
                                <div
                                    className="relative w-32 h-2 bg-gray-300 dark:bg-gray-700 rounded-full mt-2"
                                    role="progressbar"
                                    aria-valuenow={course.progress}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={`${course.progress}% completed`}
                                >
                                    <div
                                        className="absolute h-2 bg-blue-500 rounded-full"
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {course.progress}% completed
                                </p>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    className="px-2 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                                    onClick={() => handleEdit(course)}
                                    aria-label={`Edit course ${course.name}`}
                                >
                                    <PencilSquareIcon className="h-5 w-5" />
                                </button>
                                <button
                                    className="px-2 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                                    onClick={() => {
                                        setSelectedCourse(course);
                                        setIsDeleteModalOpen(true);
                                    }}
                                    aria-label={`Delete course ${course.name}`}
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* Modals */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setErrorMessage(null);
                }}
                title="Edit Course"
            >
                <form onSubmit={handleEditSubmit}>
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
                    )}
                    <label className="block mb-2">
                        <span className="text-gray-700 dark:text-gray-300">Course Name</span>
                        <input
                            type="text"
                            name="name"
                            defaultValue={selectedCourse?.name}
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700 dark:text-gray-300">Completion (%)</span>
                        <input
                            type="number"
                            name="progress"
                            defaultValue={selectedCourse?.progress}
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                    </label>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                        aria-label="Save course changes"
                    >
                        Save Changes
                    </button>
                </form>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
                aria-label="Delete Modal"
            >
                <p>Are you sure you want to delete the course "<b>{selectedCourse?.name}</b>"?</p>
                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        onClick={() => setIsDeleteModalOpen(false)}
                        aria-label="Cancel Deleting Course"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={handleDelete}
                        aria-label="Delete Course"
                    >
                        Delete
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setErrorMessage(null);
                }}
                title="Add Course"
            >
                <form onSubmit={handleAddSubmit}>
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
                    )}
                    <label className="block mb-2">
                        <span className="text-gray-700 dark:text-gray-300">Course Name</span>
                        <input
                            type="text"
                            name="name"
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700 dark:text-gray-300">Completion (%)</span>
                        <input
                            type="number"
                            name="progress"
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                    </label>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                        aria-label="Add New Course"
                    >
                        Add Course
                    </button>
                </form>
            </Modal>
        </div>
    );
}
