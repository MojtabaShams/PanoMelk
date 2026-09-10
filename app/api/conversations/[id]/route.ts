import prisma from "@/lib/db";
import type { tb_conversationsUpdateInput } from "@/app/generated/prisma/models/tb_conversations";
import { errorResponse, json, parseId, readJson, requireUserId, serialize, serverError } from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const userId = await requireUserId();
  const id = parseId((await params).id);
  if (!userId) return errorResponse("برای مشاهده گفتگو وارد شوید.", 401);
  if (!id) return errorResponse("شناسه گفتگو نامعتبر است.", 400);
  try {
    const conversation = await prisma.tb_conversations.findFirst({
      where: { id, user_id: userId },
      include: { tb_messages: { orderBy: { created_at: "asc" } } },
    });
    return conversation ? json(serialize(conversation)) : errorResponse("گفتگو یافت نشد.", 404);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: Request, { params }: Context) {
  const userId = await requireUserId();
  const id = parseId((await params).id);
  if (!userId) return errorResponse("برای ویرایش گفتگو وارد شوید.", 401);
  if (!id) return errorResponse("شناسه گفتگو نامعتبر است.", 400);
  const body = await readJson(request);
  if (!body || typeof body !== "object") return errorResponse("بدنه درخواست نامعتبر است.", 400);
  const input = body as Record<string, unknown>;
  const data: tb_conversationsUpdateInput = {};
  for (const key of ["subject", "category", "category_label", "status"]) {
    if (typeof input[key] === "string") data[key] = input[key];
  }
  if (typeof input.is_read === "boolean") data.is_read = input.is_read;
  if (!Object.keys(data).length) return errorResponse("هیچ فیلدی برای ویرایش ارسال نشده است.", 400);
  try {
    const result = await prisma.tb_conversations.updateMany({ where: { id, user_id: userId }, data });
    if (!result.count) return errorResponse("گفتگو یافت نشد.", 404);
    const conversation = await prisma.tb_conversations.findUnique({ where: { id } });
    return json(serialize(conversation));
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_: Request, { params }: Context) {
  const userId = await requireUserId();
  const id = parseId((await params).id);
  if (!userId) return errorResponse("برای حذف گفتگو وارد شوید.", 401);
  if (!id) return errorResponse("شناسه گفتگو نامعتبر است.", 400);
  try {
    const result = await prisma.tb_conversations.deleteMany({ where: { id, user_id: userId } });
    return result.count ? json({ message: "گفتگو حذف شد." }) : errorResponse("گفتگو یافت نشد.", 404);
  } catch (error) {
    return serverError(error);
  }
}
