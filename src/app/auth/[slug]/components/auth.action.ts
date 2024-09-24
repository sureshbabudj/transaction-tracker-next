"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  hashPassword,
  validateEmail,
  validateFirstName,
  validatePassword,
  verifyPassword,
} from "./utils";
import { lucia, validateRequest } from "@/lib/auth";

export interface ActionResult {
  error: string | null;
}

export async function login(_: any, formData: FormData): Promise<ActionResult> {
  try {
    const email = formData.get("email");
    if (!validateEmail(email)) {
      throw new Error("Invalid username");
    }

    const password = formData.get("password");
    if (!validatePassword(password)) {
      throw new Error("Invalid password");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser || !existingUser.password || !existingUser.passwordSalt) {
      throw new Error("Incorrect username or password");
    }

    const validPassword = await verifyPassword(
      password,
      existingUser.passwordSalt,
      existingUser.password
    );
    if (!validPassword) {
      throw new Error("Incorrect username or password");
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    console.error(error);
    return { error: (error as Error).message };
  }

  return redirect("/dashboard");
}

export async function signup(
  _: any,
  formData: FormData
): Promise<ActionResult> {
  try {
    const email = formData.get("email");
    if (!validateEmail(email)) {
      throw new Error("Invalid email");
    }

    const passwordInput = formData.get("password");
    if (!validatePassword(passwordInput)) {
      throw new Error("Invalid password");
    }

    const firstName = formData.get("firstName");
    if (!validateFirstName(firstName)) {
      throw new Error("Invalid First Name");
    }

    const lastName = formData.get("firstName");
    if (!validateFirstName(lastName)) {
      throw new Error("Invalid Last Name");
    }

    const { hash, salt } = hashPassword(passwordInput);

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        passwordSalt: salt,
        firstName,
        lastName,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    console.error(error);
    return { error: (error as Error).message };
  }

  return redirect("/dashboard");
}

export async function logout(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/auth/signin");
}
