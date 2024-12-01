import { NextResponse } from "next/server";

let users = [
    {
        "id": 1,
        "name": "Venkat",
        "role": "Admin",
        "status": "active"
    },
    {
        "id": 2,
        "name": "Sam Doe",
        "role": "Instructor",
        "status": "active"
    },
    {
        "id": 3,
        "name": "Alex Smith",
        "role": "Student",
        "status": "active"
    }
]

export async function GET() {
    return NextResponse.json(users);
}

export async function POST(req: Request) {
    const newUser = await req.json();

    if (!newUser.name || !newUser.role || !newUser.status) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    newUser.id = users.length + 1;
    users.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
}

export async function PUT(req: Request) {
    const updatedUser = await req.json();

    if (!updatedUser.id || !updatedUser.name || !updatedUser.role || !updatedUser.status) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userIndex = users.findIndex((user) => user.id === updatedUser.id);
    if (userIndex === -1) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    users[userIndex] = { ...users[userIndex], ...updatedUser };
    return NextResponse.json(users[userIndex]);
}

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get("id"));

    if (!id) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const userExists = users.some((user) => user.id === id);
    if (!userExists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    users = users.filter((user) => user.id !== id);
    return NextResponse.json({ message: "User deleted successfully" });
}