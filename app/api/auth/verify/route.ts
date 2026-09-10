import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import prisma from "@/lib/db";
import { createVerificationToken, verifyVerificationToken } from "@/lib/verification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const stage = body.stage === "email" ? "email" : "phone";
    const token = (await cookies()).get("registration_verification")?.value;
    const payload = token ? verifyVerificationToken(token) : null;

    if (
      !payload || payload.type !== "registration" ||
      (stage === "phone" ? payload.phoneCode !== code : payload.emailCode !== code)
    ) {
      return NextResponse.json({ error: "کد تایید نامعتبر یا منقضی شده است." }, { status: 400 });
    }

    if (stage === "phone") {
      const nextToken = createVerificationToken({ ...payload, phoneVerified: true });
      (await cookies()).set("registration_verification", nextToken, {
        httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
        maxAge: 120, path: "/",
      });
    } else {
      if (payload.phoneVerified !== true) {
        return NextResponse.json({ error: "ابتدا شماره موبایل را تایید کنید." }, { status: 400 });
      }
      const requiredFields = ["full_name", "username", "phone", "email", "password"];
      if (!requiredFields.every((field) => typeof payload[field] === "string")) {
        return NextResponse.json({ error: "اطلاعات ثبت‌نام موقت ناقص است." }, { status: 400 });
      }
      await prisma.tb_users.create({
        data: {
          full_name: payload.full_name as string,
          username: payload.username as string,
          phone: payload.phone as string,
          email: payload.email as string,
          password: payload.password as string,
          confirm_rules: true,
          confirm_phone: true,
          confirm_email: true,
        },
      });
      (await cookies()).delete("registration_verification");
    }
    return NextResponse.json({ message: "کد تایید شد." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطای داخلی سرور." }, { status: 500 });
  }
}
