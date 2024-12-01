// store/features/courseManagementSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Course {
    id: number;
    name: string;
    progress: number;
    students: number;
}

interface CourseManagementState {
    courses: Course[];
}

const initialState: CourseManagementState = {
    courses: [],
};

const courseManagementSlice = createSlice({
    name: "courseManagement",
    initialState,
    reducers: {
        setCourses(state, action: PayloadAction<Course[]>) {
            state.courses = action.payload;
        },
        addCourse(state, action: PayloadAction<Course>) {
            state.courses.push(action.payload);
        },
        updateCourse(state, action: PayloadAction<Course>) {
            state.courses = state.courses.map((course) =>
                course.id === action.payload.id ? action.payload : course
            );
        },
        deleteCourse(state, action: PayloadAction<number>) {
            state.courses = state.courses.filter((course) => course.id !== action.payload);
        },
    },
});

export const { setCourses, addCourse, updateCourse, deleteCourse } = courseManagementSlice.actions;
export default courseManagementSlice.reducer;
