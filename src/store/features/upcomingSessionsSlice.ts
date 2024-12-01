import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Course {
    id: number;
    title: string;
    date: string;
    time: string;
}

interface UpcomingSessionsState {
    sessions: Course[];
    loading: boolean;
}

const initialState: UpcomingSessionsState = {
    sessions: [],
    loading: true,
};

const upcomingSessionsSlice = createSlice({
    name: "upcomingSessions",
    initialState,
    reducers: {
        setSessions(state, action: PayloadAction<Course[]>) {
            state.sessions = action.payload;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const { setSessions, setLoading } = upcomingSessionsSlice.actions;
export default upcomingSessionsSlice.reducer;
