import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const cookies = req.cookies.getAll();
  const cookieString = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const { data } = await (
    await fetch(`http://${req.nextUrl.host}/auth/api`, {
      credentials: "include",
      headers: {
        Cookie: cookieString,
      },
    })
  ).json();
  if (!data.session?.userId) {
    return NextResponse.redirect(
      new URL(`http://${req.nextUrl.host}/auth/signin`, req.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
