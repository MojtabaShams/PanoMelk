// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { createVerificationToken, sendEmail, sendSms } from "@/lib/verification";

export async function POST(req: Request) {
    try {
        const { full_name, username, phone, email, password } = await req.json();
        if (
            typeof full_name !== "string" ||
            typeof username !== "string" ||
            typeof phone !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            password.length < 8
        ) {
            return NextResponse.json({ error: "اطلاعات ثبت‌نام نامعتبر است و رمز عبور باید حداقل ۸ کاراکتر باشد." }, { status: 400 });
        }

        const existingUser = await prisma.tb_users.findFirst({
            where: { OR: [{ email }, { username }, { phone }] },
        });

        if (existingUser) {
            return NextResponse.json({ error: "کاربری با این مشخصات از قبل وجود دارد." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const phoneCode = String(Math.floor(100000 + Math.random() * 900000));
        const emailCode = String(Math.floor(100000 + Math.random() * 900000));
        const token = createVerificationToken({
            type: "registration",
            full_name,
            username,
            phone,
            email,
            password: hashedPassword,
            phoneCode,
            emailCode,
        });
        await sendSms(phone, phoneCode);
        await sendEmail(email, emailCode);
        (await cookies()).set("registration_verification", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 120,
            path: "/",
        });

        return NextResponse.json({ message: "کدهای تایید موبایل و ایمیل ارسال شدند." }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "خطایی رخ داد." }, { status: 500 });
    }
}