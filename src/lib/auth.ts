import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { cookies } from "next/headers";
import { cache } from "react";

import prismaClient from "./prisma";
import { Session, User } from "@prisma/client";
import { NextRequest } from "next/server";

const adapter = new PrismaAdapter(prismaClient.session, prismaClient.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes: any) => {
    return {
      email: attributes.email,
    };
  },
});

export const validateRequest = cache(
  async (
    req: NextRequest
  ): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = req.cookies?.get(lucia.sessionCookieName)?.value || null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }
    return validateSession(sessionId) as any;
  }
);

export const validateAuth = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value || null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }
    return validateSession(sessionId) as any;
  }
);

export const validateSession = cache(
  async (
    sessionId: string
  ): Promise<{ user: User; session: Session } | null> => {
    const result = await lucia.validateSession(sessionId);
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch (err) {
      console.error(err);
    }
    return result as any;
  }
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
