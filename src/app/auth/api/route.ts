import { validateRequest } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const data = await validateRequest(req);
  return Response.json({ data });
}
