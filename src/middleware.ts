import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith("/auth/api")) {
    return NextResponse.next();
  }

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

  if (data.session?.userId) {
    if (req.nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL(`http://${req.nextUrl.host}/dashboard`, req.url)
      );
    }
  } else {
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(
        new URL(`http://${req.nextUrl.host}/auth/signin`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
