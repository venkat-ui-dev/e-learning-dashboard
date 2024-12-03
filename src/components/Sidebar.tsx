"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

interface SidebarProps {
    theme: string;
    className?: string;
}

export default function Sidebar({ theme, className }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("Dashboard");

    const buttonColor = theme === "dark" ? "bg-sidebarBgDark text-sidebarTextDark" : "bg-sidebarBgLight text-sidebarTextLight";

    return (
        <div className="relative">
            {/* Hamburger Menu */}
            {!isOpen && (
                <button
                    aria-label="Open sidebar"
                    className={`fixed top-4 left-4 z-50 md:hidden p-2 rounded-full shadow-md ${buttonColor}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 h-full w-60 transform transition-transform duration-300 shadow-md z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 md:static ${className} ${theme === "dark" ? "bg-sidebarBgDark text-sidebarTextDark" : "bg-sidebarBgLight text-sidebarTextLight"}`}
                aria-label="Sidebar navigation"
            >
                {/* Header */}
                <div
                    className={`${theme === "dark" ? "border-sidebarHoverDark" : "border-sidebarHoverLight"} relative p-4 border-b`}
                >
                    <h1
                        className="text-lg font-bold"
                        tabIndex={0}
                    >
                        E-Learning
                    </h1>
                    {/* Close Button */}
                    <button
                        aria-label="Close sidebar"
                        className={`absolute top-1/2 right-4 transform -translate-y-1/2 p-1 rounded-full md:hidden shadow-md ${buttonColor}`}
                        onClick={() => setIsOpen(false)}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Menu */}
                <ul className="p-2 space-y-4" role="menu">
                    <li role="none">
                        <a
                            href="#"
                            role="menuitem"
                            aria-current={activeMenu === "Dashboard" ? "page" : undefined}
                            onClick={() => setActiveMenu("Dashboard")}
                            className={`block p-2 pl-4 rounded-md transition-colors duration-200 relative ${theme === "dark"
                                ? "hover:bg-sidebarHoverDark text-sidebarTextDark"
                                : "hover:bg-sidebarHoverLight text-sidebarTextLight"
                                }`}
                        >
                            {activeMenu === "Dashboard" && (
                                <span
                                    className={`absolute left-0 top-0 h-full w-1 rounded-r-md ${theme === "dark" ? "bg-activeIndicatorDark" : "bg-activeIndicatorLight"}`}
                                ></span>
                            )}
                            Dashboard
                        </a>
                    </li>
                </ul>
            </aside>

            {/* Overlay */}
            {isOpen && (
                <div
                    aria-hidden="true"
                    className={`fixed inset-0 z-30 md:hidden ${theme === "dark" ? "overlayDark" : "overlayLight"}`}
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
}
