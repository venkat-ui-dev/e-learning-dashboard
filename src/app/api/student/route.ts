import { NextResponse } from "next/server";

const studentData = {
    sessionsCompleted: 15,
    upcomingSessions: 10,
    averageScore: 87,
    performance: [75, 80, 85, 90],
};

export async function GET() {
    try {
        return NextResponse.json(studentData);
    } catch {
        return NextResponse.error();
    }
}
