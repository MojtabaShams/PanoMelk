import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireUserId() {
  const session = await getServerSession(authOptions);
  const userId = Number((session?.user as { id?: string } | undefined)?.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}

export function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function json(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");

  return NextResponse.json(data, {
    ...init,
    headers,
  });
}

export function errorResponse(message: string, status: number) {
  return json({ error: message }, { status });
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function serialize<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_, item) =>
      typeof item === "bigint" ? item.toString() : item,
    ),
  ) as T;
}

export function serverError(error: unknown) {
  console.error(error);
  return errorResponse("خطای داخلی سرور.", 500);
}
