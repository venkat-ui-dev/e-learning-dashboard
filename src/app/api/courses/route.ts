import { NextResponse } from "next/server";

const courseData = {
    courses: [
        { id: 1, name: "React Fundamentals", progress: 70, status: "In Progress" },
        { id: 2, name: "Advanced JS", progress: 100, status: "Completed" },
        { id: 3, name: "UI/UX Basics", progress: 50, status: "In Progress" },
    ],
};

// GET - Fetch all courses
export async function GET() {
    return NextResponse.json(courseData);
}

// POST - Add a new course
export async function POST(req: Request) {
    const newCourse = await req.json();

    if (!newCourse.name || newCourse.progress === undefined || !newCourse.status) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a unique ID for the new course
    newCourse.id = courseData.courses.length
        ? Math.max(...courseData.courses.map((course) => course.id)) + 1
        : 1;

    courseData.courses.push(newCourse);
    return NextResponse.json(newCourse, { status: 201 });
}

// PUT - Update an existing course
export async function PUT(req: Request) {
    const updatedCourse = await req.json();

    if (
        !updatedCourse.id ||
        !updatedCourse.name ||
        updatedCourse.progress === undefined ||
        !updatedCourse.status
    ) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const courseIndex = courseData.courses.findIndex((course) => course.id === updatedCourse.id);
    if (courseIndex === -1) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    courseData.courses[courseIndex] = { ...courseData.courses[courseIndex], ...updatedCourse };
    return NextResponse.json(courseData.courses[courseIndex]);
}

// DELETE - Remove a course by ID
export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get("id"));

    if (!id) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const courseExists = courseData.courses.some((course) => course.id === id);
    if (!courseExists) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    courseData.courses = courseData.courses.filter((course) => course.id !== id);
    return NextResponse.json({ message: "Course deleted successfully" });
}
