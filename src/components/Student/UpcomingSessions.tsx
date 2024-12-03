"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "@/store/store";
import { setSessions, setLoading } from "@/store/features/upcomingSessionsSlice";
import { Skelton } from "@/components/Common/Skelton";
import { formatDate, isNextWeek, isThisWeek } from "@/app/utilities/utilities";
import styles from '@/components/Student/Student.module.css';

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

    const [activeTab, setActiveTab] = useState<string>(
        () => localStorage.getItem("activeTab") || "This Week"
    );

    const filteredSessions = useMemo(() => {
        return initialSessions.filter((session) => {
            const sessionDate = new Date(session.date);
            if (activeTab === "This Week") return isThisWeek(sessionDate);
            if (activeTab === "Next Week") return isNextWeek(sessionDate);
            return true; // All Sessions
        });
    }, [sessions, activeTab]);

    useEffect(() => {
        dispatch(setLoading(true));

        if (initialSessions) {
            dispatch(setSessions(initialSessions));
        }

        dispatch(setLoading(false));
    }, [initialSessions, dispatch]);

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

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
                        className={`${styles.tab} ${activeTab === tab
                            ? styles['tab-active']
                            : 'dark:bg-gray-700 dark:text-gray-300'
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
                className={`${styles['session-grid']}`}
            >
                {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                        <div
                            key={session.id}
                            className={`${styles['session-card']} dark:bg-gray-800`}
                            role="listitem"
                            aria-labelledby={`session-title-${session.id}`}
                        >
                            <h4
                                id={`session-title-${session.id}`}
                                className={`${styles['session-title']} dark:text-white`}
                                tabIndex={0}
                            >
                                {session.title}
                            </h4>
                            <p
                                className={`${styles['session-text']}`}
                                aria-label={`Date: ${formatDate(session.date)}`}
                            >
                                {formatDate(session.date)}
                            </p>
                            <p
                                className={`${styles['session-text']}`}
                                aria-label={`Time: ${session.time}`}
                            >
                                {session.time}
                            </p>
                            <div className="mt-4 flex gap-2">
                                <button
                                    className={`${styles['button-primary']}`}
                                    aria-label={`Join session: ${session.title}`}
                                >
                                    Join
                                </button>
                                <button
                                    className={`${styles['button-secondary']} dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500`}
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
