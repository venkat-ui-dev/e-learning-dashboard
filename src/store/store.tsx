import { configureStore } from "@reduxjs/toolkit";
import upcomingSessionsReducer from "@/store/features/upcomingSessionsSlice";
import courseOverviewReducer from "@/store/features/courseOverviewSlice";
import userManagementReducer from "@/store/features/userManagementSlice";
import courseManagementReducer from "@/store/features/courseManagementSlice";

export const store = configureStore({
    reducer: {
        upcomingSessions: upcomingSessionsReducer,
        courseOverview: courseOverviewReducer,
        userManagement: userManagementReducer,
        courseManagement: courseManagementReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
