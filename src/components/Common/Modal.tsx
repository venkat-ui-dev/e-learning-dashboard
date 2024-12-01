"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 m-0"
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] max-w-2xl p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    aria-label="Close modal"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Modal Title */}
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                    {title}
                </h2>

                {/* Modal Content */}
                <div>{children}</div>
            </div>
        </div>
    );
}
