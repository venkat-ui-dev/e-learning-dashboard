import { NextResponse } from "next/server"

const adminData = {
    totalUsers: 2450,
    engagementRate: "78%",
    newRegistrations: 32,
    engagementTrends: [
        { date: "2024-11-01", value: 60 },
        { date: "2024-11-05", value: 75 },
        { date: "2024-11-10", value: 78 },
        { date: "2024-11-15", value: 80 },
    ],
}

export async function GET() {
    return NextResponse.json(adminData)
}