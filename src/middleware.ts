import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // If visiting `/dashboard` or root `/`, redirect to `/dashboard/student`
    if (pathname === "/" || pathname === "/dashboard") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard/student";
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard"], // Match root `/` and `/dashboard`
};
