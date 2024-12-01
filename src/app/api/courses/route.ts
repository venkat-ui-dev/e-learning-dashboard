import { NextResponse } from "next/server";

const courses = [
    { id: 1, name: "React Fundamentals", progress: 70, status: "In Progress" },
    { id: 2, name: "Advanced JS", progress: 100, status: "Completed" },
    { id: 3, name: "UI/UX Basics", progress: 50, status: "In Progress" },
];

export async function GET() {
    return NextResponse.json(courses)
}