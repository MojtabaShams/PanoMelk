// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

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
        await prisma.tb_users.create({
            data: {
                full_name,
                username,
                phone,
                email,
                password: hashedPassword,
                confirm_rules: true,
                confirm_phone: true,
                confirm_email: true,
            },
        });

        // ارسال پیامک و ایمیل تا زمان فعال‌سازی سرویس‌های مربوطه غیرفعال است.
        return NextResponse.json({ message: "ثبت‌نام با موفقیت انجام شد." }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "خطایی رخ داد." }, { status: 500 });
    }
}