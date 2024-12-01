import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Course {
    id: number;
    name: string;
    progress: number;
    status: string;
}

interface CourseOverviewState {
    courses: Course[];
    loading: boolean;
}

const initialState: CourseOverviewState = {
    courses: [],
    loading: true,
};

const courseOverviewSlice = createSlice({
    name: "courseOverview",
    initialState,
    reducers: {
        setCourses(state, action: PayloadAction<Course[]>) {
            state.courses = action.payload;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const { setCourses, setLoading } = courseOverviewSlice.actions;
export default courseOverviewSlice.reducer;
