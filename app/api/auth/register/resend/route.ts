import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { sendEmail, sendSms, verifyVerificationToken, createVerificationToken } from "@/lib/verification";

export async function POST() {
  try {
    const current = (await cookies()).get("registration_verification")?.value;
    const payload = current ? verifyVerificationToken(current) : null;
    if (!payload || payload.type !== "registration") {
      return NextResponse.json({ error: "فرآیند ثبت‌نام منقضی شده است." }, { status: 400 });
    }
    const token = createVerificationToken(payload);
    if (typeof payload.phone !== "string" || typeof payload.email !== "string") {
      return NextResponse.json({ error: "اطلاعات ثبت‌نام موقت یافت نشد." }, { status: 400 });
    }
    await sendSms(payload.phone, String(payload.phoneCode));
    await sendEmail(payload.email, String(payload.emailCode));
    (await cookies()).set("registration_verification", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 120,
      path: "/",
    });
    return NextResponse.json({ message: "کد تایید مجدداً ارسال شد." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "ارسال پیامک ناموفق بود." }, { status: 500 });
  }
}
