import { NextResponse } from "next/server"

const adminData = {
    totalUsers: 2450,
    engagementRate: "78%",
    newRegistrations: 32,
    engagementTrends: [
        { name: "React Fundamentals", date: "2024-11-01", progressValue: 60 },
        { name: "Advanced JS", date: "2024-11-05", progressValue: 75 },
        { name: "Node JS Advanced", date: "2024-11-10", progressValue: 78 },
        { name: "UI/UX Basics", date: "2024-11-15", progressValue: 80 },
    ],
}

export async function GET() {
    return NextResponse.json(adminData)
}