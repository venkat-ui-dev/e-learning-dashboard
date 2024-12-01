"use client";

import React from "react";
import { ReactNode } from "react";

interface CardProps {
    icon: ReactNode;
    title: string;
    value: string | number;
    gradientClasses: string;
    iconClasses: string;
}

const Card = React.memo(function Card({
    icon,
    title,
    value,
    gradientClasses,
    iconClasses,
}: CardProps) {
    return (
        <div
            className={`p-4 rounded-lg flex items-center space-x-4 shadow-lg ${gradientClasses}`}
            role="region"
            aria-labelledby={`${title}-card-title`}
            aria-describedby={`${title}-card-value`}
        >
            {/* Icon */}
            <div className={`${iconClasses} p-3 rounded-full`} aria-hidden="true">
                {icon}
            </div>
            {/* Content */}
            <div>
                <p
                    id={`${title}-card-title`}
                    className="text-gray-600 dark:text-gray-400 text-sm font-medium"
                >
                    {title}
                </p>
                <h3
                    id={`${title}-card-value`}
                    className="text-2xl font-bold text-gray-800 dark:text-white"
                >
                    {value}
                </h3>
            </div>
        </div>
    );
});

export default Card;
