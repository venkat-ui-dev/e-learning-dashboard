import { NextResponse } from "next/server";

const upcomingSessions = [
    {
        "id": 1,
        "title": "React Fundamentals Live Session",
        "date": "2024-12-01",
        "time": "10:00 AM"
    },
    {
        "id": 2,
        "title": "Advanced JS Q&A",
        "date": "2024-12-02",
        "time": "2:00 PM"
    },
    {
        "id": 3,
        "title": "UI/UX Basics Demo",
        "date": "2024-12-03",
        "time": "5:00 PM"
    },
    {
        "id": 4,
        "title": "Full-Stack Development Overview",
        "date": "2024-12-04",
        "time": "11:00 AM"
    },
    {
        "id": 5,
        "title": "Database Optimization Techniques",
        "date": "2024-12-05",
        "time": "3:00 PM"
    },
    {
        "id": 6,
        "title": "Modern JavaScript Frameworks",
        "date": "2024-12-06",
        "time": "1:00 PM"
    },
    {
        "id": 7,
        "title": "Next.js Server-Side Rendering Workshop",
        "date": "2024-12-07",
        "time": "9:00 AM"
    },
    {
        "id": 8,
        "title": "Accessibility in Web Development",
        "date": "2024-12-08",
        "time": "4:00 PM"
    },
    {
        "id": 9,
        "title": "Advanced CSS Animations",
        "date": "2024-12-09",
        "time": "10:30 AM"
    },
    {
        "id": 10,
        "title": "Building Scalable Applications",
        "date": "2024-12-10",
        "time": "6:00 PM"
    }
];

export async function GET() {
    return NextResponse.json(upcomingSessions);
}