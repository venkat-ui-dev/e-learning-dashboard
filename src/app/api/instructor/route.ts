import { NextResponse } from "next/server";

let instructorData = {
    courses: [
        { id: 1, name: "React Basics", progress: 80, students: 30 },
        { id: 2, name: "Advanced JavaScript", progress: 50, students: 25 },
        { id: 3, name: "UI/UX Fundamentals", progress: 100, students: 40 },
    ],
};

export async function GET() {
    return NextResponse.json(instructorData);
}

export async function POST(req: Request) {
    try {
        let uniqueId = Math.max(...instructorData.courses.map(course => course.id), 0) + 1;
        const newCourse = await req.json();

        if (!newCourse.name || newCourse.progress < 0 || newCourse.students < 0) {
            return NextResponse.json({ error: "Invalid or missing fields" }, { status: 400 });
        }
        const courseWithId = {
            id: uniqueId,
            ...newCourse,
        };

        instructorData.courses.push(courseWithId);

        return NextResponse.json(courseWithId, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add course" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const updatedCourse = await req.json();

        if (!updatedCourse.name || updatedCourse.progress < 0 || updatedCourse.students < 0) {
            return NextResponse.json({ error: "Invalid or missing fields" }, { status: 400 });
        }

        const courseIndex = instructorData.courses.findIndex((course) => course.id === updatedCourse.id);
        if (courseIndex === -1) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        instructorData.courses[courseIndex] = { ...instructorData.courses[courseIndex], ...updatedCourse };

        return NextResponse.json(instructorData.courses[courseIndex]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = Number(url.searchParams.get("id"));

        if (!id || isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const courseIndex = instructorData.courses.findIndex((course) => course.id === id);
        if (courseIndex === -1) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        instructorData.courses = instructorData.courses.filter((course) => course.id !== id);

        return NextResponse.json({ message: "Course deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
    }
}
