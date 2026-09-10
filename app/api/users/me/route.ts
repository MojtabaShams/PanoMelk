import prisma from "@/lib/db";
import type { tb_usersUpdateInput } from "@/app/generated/prisma/models/tb_users";
import { errorResponse, json, readJson, requireUserId, serialize, serverError } from "@/lib/api";

const publicUser = {
  id: true,
  full_name: true,
  username: true,
  phone: true,
  email: true,
  avatar_url: true,
  is_deleted: true,
  created_at: true,
  updated_at: true,
  confirm_rules: true,
  confirm_phone: true,
  confirm_email: true,
};

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return errorResponse("برای مشاهده پروفایل وارد شوید.", 401);
  try {
    const user = await prisma.tb_users.findUnique({ where: { id: userId }, select: publicUser });
    return user ? json(serialize(user)) : errorResponse("کاربر یافت نشد.", 404);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: Request) {
  const userId = await requireUserId();
  if (!userId) return errorResponse("برای ویرایش پروفایل وارد شوید.", 401);
  const body = await readJson(request);
  if (!body || typeof body !== "object") return errorResponse("بدنه درخواست نامعتبر است.", 400);
  const input = body as Record<string, unknown>;
  const data: tb_usersUpdateInput = {};
  for (const key of ["full_name", "username", "phone", "email", "avatar_url"]) {
    if (typeof input[key] === "string") data[key] = input[key];
  }
  if (!Object.keys(data).length) return errorResponse("هیچ فیلدی برای ویرایش ارسال نشده است.", 400);
  try {
    const user = await prisma.tb_users.update({ where: { id: userId }, data, select: publicUser });
    return json(serialize(user));
  } catch (error) {
    return serverError(error);
  }
}
