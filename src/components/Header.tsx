"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { Loader } from "@/components/Common/Loader";

interface HeaderProps {
    theme: string;
    onThemeChange: (newTheme: string) => void;
    className?: string;
}

export default function Header({ theme, onThemeChange, className }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname(); // Get the current pathname
    const [role, setRole] = useState<string>("student");
    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for role change
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentRole = pathname.split("/")[2] || "student";
        setRole(currentRole);

        // Close the profile dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [pathname]);

    const handleRoleChange = async (newRole: string) => {
        try {
            setIsLoading(true); // Start loading
            await router.push(`/dashboard/${newRole}`);
            setRole(newRole);
        } catch (error) {
            toast.error("Error while navigating:");
            setIsProfileOpen(false);
        } finally {
            setIsLoading(false);
            setIsProfileOpen(false);
        }
    };

    return (
        <header
            className={`bg-white dark:bg-gray-800 p-4 flex items-center transition-colors duration-300 shadow-md ${className}`}
            aria-label="Header"
        >
            {/* Right Section: Profile and Theme Toggle */}
            <div
                className="flex items-center ml-auto space-x-4 relative"
                ref={profileRef}
            >
                {/* Theme Toggle */}
                <button
                    aria-label={`Toggle to ${theme === "light" ? "dark" : "light"} mode`}
                    className={`relative flex items-center w-16 h-8 bg-gradient-to-r ${theme === "dark"
                        ? "from-gray-800 to-black"
                        : "from-blue-300 to-blue-500"
                        } rounded-full cursor-pointer overflow-hidden shadow-md transition-all duration-500`}
                    onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
                >
                    {/* Toggle Knob */}
                    <div
                        className={`absolute ${theme === "dark" ? "right-1 bg-white" : "left-1 bg-yellow-300"
                            } w-6 h-6 rounded-full shadow-sm transition-all duration-500`}
                        aria-hidden="true"
                    ></div>
                </button>

                {/* Profile Icon */}
                <button
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                    aria-label="Open profile options"
                    className="h-8 w-8 text-gray-700 dark:text-gray-300 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                    <UserCircleIcon />
                </button>

                {/* Dropdown */}
                {isProfileOpen && (
                    <div
                        className="absolute top-14 right-4 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg text-gray-700 dark:text-gray-300 z-50 transition-colors"
                        role="menu"
                        aria-label="Profile menu"
                    >
                        <ul>
                            <li
                                className="px-4 py-2 text-sm font-bold text-gray-800 dark:text-gray-300"
                                role="menuitem"
                                tabIndex={0}
                            >
                                Role: {role.charAt(0).toUpperCase() + role.slice(1)}
                            </li>
                            <hr
                                className="my-2 border-gray-200 dark:border-gray-600"
                                aria-hidden="true"
                            />
                            {["student", "admin", "instructor"].map((r) => (
                                <li
                                    key={r}
                                    role="menuitem"
                                    tabIndex={0}
                                    onClick={() => handleRoleChange(r)}
                                    className={`px-4 py-2 text-sm cursor-pointer rounded-md ${role === r
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                                        }`}
                                >
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </li>
                            ))}
                            <hr
                                className="my-2 border-gray-200 dark:border-gray-600"
                                aria-hidden="true"
                            />
                            <li
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => alert("Profile clicked")}
                            >
                                Profile
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => alert("Logout clicked")}
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                )}

                {/* Loader */}
                {isLoading && (
                    <Loader />
                )}
            </div>
        </header>
    );
}
