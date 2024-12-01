import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (pathname === "/" || pathname === "/dashboard") {
        console.log(request.url);

        return NextResponse.redirect(new URL("/dashboard/student", request.url));
    }
}
