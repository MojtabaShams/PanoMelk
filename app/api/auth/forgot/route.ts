import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

import prisma from "@/lib/db";
import {
  createVerificationToken,
  sendSms,
  verifyVerificationToken,
} from "@/lib/verification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const newPassword =
      typeof body.newPassword === "string" ? body.newPassword : "";

    if (!email) {
      return NextResponse.json({ error: "ایمیل الزامی است." }, { status: 400 });
    }

    if (!code) {
      const user = await prisma.tb_users.findUnique({ where: { email } });
      if (!user || user.is_deleted) {
        return NextResponse.json(
          { error: "کاربری با این ایمیل یافت نشد." },
          { status: 404 },
        );
      }

      const verificationCode = String(
        Math.floor(100000 + Math.random() * 900000),
      );
      const token = createVerificationToken({
        type: "password_reset",
        userId: user.id,
        code: verificationCode,
      });
      await sendSms(user.phone, verificationCode);
      (await cookies()).set("password_reset", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 120,
        path: "/",
      });

      return NextResponse.json({ message: "کد بازیابی ارسال شد." });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "رمز عبور جدید باید حداقل ۸ کاراکتر باشد." },
        { status: 400 },
      );
    }

    const token = (await cookies()).get("password_reset")?.value;
    const payload = token ? verifyVerificationToken(token) : null;
    if (
      !payload ||
      payload.type !== "password_reset" ||
      payload.code !== code
    ) {
      return NextResponse.json({ error: "کد بازیابی نامعتبر یا منقضی شده است." }, { status: 400 });
    }

    const password = await bcrypt.hash(newPassword, 10);
    const result = await prisma.tb_users.updateMany({
      where: { id: payload.userId, email },
      data: { password, updated_at: new Date() },
    });
    if (!result.count) {
      return NextResponse.json({ error: "درخواست بازیابی معتبر نیست." }, { status: 400 });
    }
    (await cookies()).delete("password_reset");
    return NextResponse.json({ message: "رمز عبور با موفقیت تغییر کرد." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطای داخلی سرور." },
      { status: 500 },
    );
  }
}
