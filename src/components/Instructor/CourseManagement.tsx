"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { RootState } from "@/store/store";
import Modal from "@/components/Common/Modal";
import { setCourses, addCourse, updateCourse, deleteCourse } from "@/store/features/courseManagementSlice";
import { toast } from "react-toastify";
import styles from "@/components/Instructor/CourseManagement.module.css"
import CourseForm from "@/components/Instructor/CourseForm";

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit">("add");
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Initialize Redux state with initialCourses
    useEffect(() => {
        dispatch(setCourses(initialCourses));
    }, [initialCourses, dispatch]);

    const handleModalOpen = (type: "add" | "edit", course: Course | null = null) => {
        setModalType(type);
        setSelectedCourse(course);
        setIsModalOpen(true);
        setErrorMessage(null);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCourse(null);
        setErrorMessage(null);
    };

    const handleSubmit = async (name: string, progress: number) => {
        try {
            if (modalType === "add") {
                // Add Course Logic
                const uniqueId = courses.length + 1;
                const newCourse = { id: uniqueId, name, progress, students: 0 };
                const response = await fetch(`${process.env.API_URL}/api/instructor`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCourse),
                });

                if (!response.ok) throw new Error("Failed to add course.");

                dispatch(addCourse(newCourse));
                toast.success("Course added successfully!");
            } else if (modalType === "edit" && selectedCourse) {
                // Edit Course Logic
                const updatedCourse = { ...selectedCourse, name, progress };
                const response = await fetch(`${process.env.API_URL}/api/instructor?id=${selectedCourse.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedCourse),
                });

                if (!response.ok) throw new Error("Failed to update course.");

                dispatch(updateCourse(updatedCourse));
                toast.success("Course updated successfully!");
            }
        } catch (error: any) {
            toast.error(error.message || "Error processing request.");
        }

        handleModalClose();
    };

    const handleDelete = async () => {
        if (!selectedCourse) return;

        try {
            const response = await fetch(`${process.env.API_URL}/api/instructor?id=${selectedCourse.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete course.");

            dispatch(deleteCourse(selectedCourse.id));
            toast.success("Course deleted successfully!");
        } catch (error: any) {
            toast.error(error.message || "Error deleting course.");
        }

        setSelectedCourse(null);
        setIsDeleteModalOpen(false);
    };

    return (
        <div id="courseManagement">
            <h2 className="text-lg font-semibold" tabIndex={0}>
                Course Management
            </h2>

            <div className="flex justify-end mb-4">
                <button
                    className={`${styles.btn} ${styles["btn-green"]}`}
                    onClick={() => handleModalOpen("add")}
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
                            className={styles.card + ' dark:bg-gray-800'}
                            tabIndex={0}
                            aria-label={`Course: ${course.name}, Progress: ${course.progress}%`}
                        >
                            <div>
                                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">{course.name}</h3>
                                <div
                                    className={`${styles["progress-bar"]} dark:bg-gray-700`}
                                    role="progressbar"
                                    aria-valuenow={course.progress}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={`${course.progress}% completed`}
                                >
                                    <div
                                        className={`${styles["progress-fill"]}`}
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{course.progress}% completed</p>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    className={`${styles.btn} ${styles["btn-blue"]}`}
                                    onClick={() => handleModalOpen("edit", course)}
                                    aria-label={`Edit course ${course.name}`}
                                >
                                    <PencilSquareIcon className="h-5 w-5" />
                                </button>
                                <button
                                    className={`${styles.btn} ${styles["btn-red"]}`}
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


            {/* Reused Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={modalType === "add" ? "Add Course" : "Edit Course"}>
                <CourseForm
                    defaultValues={modalType === "edit" ? selectedCourse || { name: "", progress: 0 } : { name: "", progress: 0 }}
                    onSubmit={handleSubmit}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    buttonLabel={modalType === "add" ? "Add Course" : "Save Changes"}
                    buttonClasses={`${styles.btn} ${modalType === "add" ? styles["btn-green"] : styles["btn-blue"]}`}
                />
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
                        className={`${styles['modal-footer-btn']} ${styles['btn-gray']}`}
                        onClick={() => setIsDeleteModalOpen(false)}
                        aria-label="Cancel Deleting Course">
                        Cancel
                    </button>
                    <button
                        className={`${styles['modal-footer-btn']} ${styles['btn-red']}`}
                        onClick={handleDelete}
                        aria-label="Delete Course"
                    >
                        Delete
                    </button>
                </div>
            </Modal>


        </div>
    );
}

