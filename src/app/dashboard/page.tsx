// src/app/dashboard/page.ts
import { redirect } from "next/navigation";

export default function Dashboard() {
    redirect("/dashboard/student"); // Redirect to the student page
    return null; // Prevent rendering anything
}
