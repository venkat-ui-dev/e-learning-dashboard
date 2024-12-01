import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Exclude API routes from middleware
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // Redirect root to student dashboard
    if (pathname === "/" || pathname === "/dashboard") {
        if (!pathname.startsWith("/dashboard/student")) {
            return NextResponse.redirect(new URL("/dashboard/student", request.url));
        }
    }

    // Allow other paths to proceed without alteration
    return NextResponse.next();
}
