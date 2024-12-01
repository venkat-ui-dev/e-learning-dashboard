"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "@/store/store";
import { setSessions, setLoading } from "@/store/features/upcomingSessionsSlice";
import { Skelton } from "../Common/Skelton";
import { formatDate, isNextWeek, isThisWeek } from "@/app/utilities/utilities";

interface Course {
    id: number;
    title: string;
    date: string;
    time: string;
}

interface UpcomingSessionsProps {
    initialSessions: Course[]; // Initial sessions passed as props
}

export default function UpcomingSessions({ initialSessions }: UpcomingSessionsProps) {
    const dispatch = useDispatch();

    // Access sessions and loading state from Redux store
    const sessions = useSelector((state: RootState) => state.upcomingSessions.sessions);
    const loading = useSelector((state: RootState) => state.upcomingSessions.loading);

    const [activeTab, setActiveTab] = useState<string>("This Week");

    const filteredSessions = useMemo(() => {
        return initialSessions.filter((session) => {
            const sessionDate = new Date(session.date);
            if (activeTab === "This Week") return isThisWeek(sessionDate);
            if (activeTab === "Next Week") return isNextWeek(sessionDate);
            return true; // All Sessions
        });
    }, [sessions, activeTab]);

    useEffect(() => {
        // Simulate loading for a smoother UI experience (optional)
        dispatch(setLoading(true));

        if (initialSessions) {
            dispatch(setSessions(initialSessions)); // Dispatch sessions to Redux
        }

        // Stop loading after setting sessions
        dispatch(setLoading(false));
    }, [initialSessions, dispatch]);

    if (loading) {
        return (
            <Skelton />
        );
    }

    return (
        <section
            className="space-y-4"
            id="upcoming-sessions-section"
            role="region"
            aria-labelledby="upcoming-sessions-title"
        >
            <h3
                id="upcoming-sessions-title"
                className="text-lg font-semibold mb-2"
                tabIndex={0}
            >
                Upcoming Sessions
            </h3>
            {/* Tabs */}
            <div className="flex space-x-4" role="tablist" aria-label="Session Filters">
                {["This Week", "Next Week", "All Sessions"].map((tab) => (
                    <button
                        key={tab}
                        role="tab"
                        aria-selected={activeTab === tab}
                        aria-controls={`${tab.replace(" ", "-").toLowerCase()}-sessions`}
                        id={`${tab.replace(" ", "-").toLowerCase()}-tab`}
                        className={`px-4 py-2 rounded ${activeTab === tab
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300"
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Sessions */}
            <div
                id={`${activeTab.replace(" ", "-").toLowerCase()}-sessions`}
                role="tabpanel"
                aria-labelledby={`${activeTab.replace(" ", "-").toLowerCase()}-tab`}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow transition-all"
                            role="listitem"
                            aria-labelledby={`session-title-${session.id}`}
                        >
                            <h4
                                id={`session-title-${session.id}`}
                                className="font-bold text-lg text-gray-900 dark:text-white"
                                tabIndex={0}
                            >
                                {session.title}
                            </h4>
                            <p
                                className="text-sm text-gray-600 dark:text-gray-400"
                                aria-label={`Date: ${formatDate(session.date)}`}
                            >
                                {formatDate(session.date)}
                            </p>
                            <p
                                className="text-sm text-gray-600 dark:text-gray-400"
                                aria-label={`Time: ${session.time}`}
                            >
                                {session.time}
                            </p>
                            <div className="mt-4 flex gap-2">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    aria-label={`Join session: ${session.title}`}
                                >
                                    Join
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                                    aria-label={`Reschedule session: ${session.title}`}
                                >
                                    Reschedule
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p
                        className="text-gray-500 dark:text-gray-300"
                        role="alert"
                    >
                        No sessions available for {activeTab}.
                    </p>
                )}
            </div>
        </section>
    );
}
