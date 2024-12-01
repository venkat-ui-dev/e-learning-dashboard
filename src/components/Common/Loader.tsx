import { TrophyIcon } from '@heroicons/react/24/outline'
import React from 'react'

export const Loader = () => {
    return (
        <>
            {/* Loader */}
            <div className="flex justify-center items-center h-screen -mt-20">
                <div className="relative w-16 h-16 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin">
                    {/* Inner Icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                        <TrophyIcon className="w-8 h-8 text-indigo-500 animate-pulse" />
                    </div>
                </div>
            </div>


        </>
    )
}
