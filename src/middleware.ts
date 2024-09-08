import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchInitialState } from "./app/utils/actions";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/dashboard/:path*",
};
