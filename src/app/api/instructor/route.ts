import { NextResponse } from "next/server";

const instructorData = {
    courses: [
        { id: 1, name: "React Basics", progress: 80, students: 30 },
        { id: 2, name: "Advanced JavaScript", progress: 50, students: 25 },
        { id: 3, name: "UI/UX Fundamentals", progress: 100, students: 40 },
    ],
};

// GET - Fetch all courses
export async function GET() {
    return NextResponse.json(instructorData);
}

// POST - Add a new course
export async function POST(req: Request) {
    const newCourse = await req.json();

    if (!newCourse.name || newCourse.progress === undefined || newCourse.students === undefined) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a unique ID for the new course
    newCourse.id = instructorData.courses.length
        ? Math.max(...instructorData.courses.map((course) => course.id)) + 1
        : 1;

    instructorData.courses.push(newCourse);
    return NextResponse.json(newCourse, { status: 201 });
}

// PUT - Update an existing course
export async function PUT(req: Request) {
    const updatedCourse = await req.json();

    if (
        !updatedCourse.id ||
        !updatedCourse.name ||
        updatedCourse.progress === undefined ||
        updatedCourse.students === undefined
    ) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const courseIndex = instructorData.courses.findIndex((course) => course.id === updatedCourse.id);
    if (courseIndex === -1) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    instructorData.courses[courseIndex] = { ...instructorData.courses[courseIndex], ...updatedCourse };
    return NextResponse.json(instructorData.courses[courseIndex]);
}

// DELETE - Remove a course by ID
export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get("id"));

    if (!id) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const courseExists = instructorData.courses.some((course) => course.id === id);
    if (!courseExists) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    instructorData.courses = instructorData.courses.filter((course) => course.id !== id);
    return NextResponse.json({ message: "Course deleted successfully" });
}
