import React from "react";
import styles from "./CourseManagement.module.css";

interface CourseFormProps {
    defaultValues?: { name: string; progress: number };
    onSubmit: (name: string, progress: number) => void;
    errorMessage?: string | null;
    setErrorMessage: (message: string | null) => void;
    buttonLabel: string;
    buttonClasses: string;
}

const CourseForm: React.FC<CourseFormProps> = ({
    defaultValues = { name: "", progress: 0 },
    onSubmit,
    errorMessage,
    setErrorMessage,
    buttonLabel,
    buttonClasses,
}) => {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
        const progressValue = (form.elements.namedItem("progress") as HTMLInputElement).value;
        const progress = parseInt(progressValue, 10);

        if (!name || progressValue === "" || isNaN(progress)) {
            setErrorMessage("All fields are required.");
            return;
        }

        if (progress < 0 || progress > 100) {
            setErrorMessage("Progress must be between 0 and 100.");
            return;
        }

        setErrorMessage(null);
        onSubmit(name, progress);
    };

    return (
        <form onSubmit={handleSubmit}>
            {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
            <label className="block mb-2">
                <span className="text-gray-700 dark:text-gray-300">Course Name</span>
                <input
                    type="text"
                    name="name"
                    defaultValue={defaultValues.name}
                    placeholder="Course Name"
                    className={styles.input + ' dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600'}
                    required
                />
            </label>
            <label className="block mb-4">
                <span className="text-gray-700 dark:text-gray-300">Completion (%)</span>
                <input
                    type="number"
                    name="progress"
                    defaultValue={defaultValues.progress}
                    min={0}
                    max={100}
                    className={styles.input + ' dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600'}
                    required
                />
            </label>
            <button type="submit" className={buttonClasses}>
                {buttonLabel}
            </button>
        </form>
    );
};

export default CourseForm;
