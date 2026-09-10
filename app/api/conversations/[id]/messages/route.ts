import prisma from "@/lib/db";
import { errorResponse, json, parseId, readJson, requireUserId, serialize, serverError } from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

async function ownedConversation(id: number, userId: number) {
  return prisma.tb_conversations.findFirst({ where: { id, user_id: userId }, select: { id: true } });
}

export async function GET(_: Request, { params }: Context) {
  const userId = await requireUserId();
  const conversationId = parseId((await params).id);
  if (!userId) return errorResponse("برای مشاهده پیام‌ها وارد شوید.", 401);
  if (!conversationId) return errorResponse("شناسه گفتگو نامعتبر است.", 400);
  try {
    if (!(await ownedConversation(conversationId, userId))) return errorResponse("گفتگو یافت نشد.", 404);
    const messages = await prisma.tb_messages.findMany({
      where: { conversation_id: conversationId },
      orderBy: { created_at: "asc" },
    });
    return json(serialize(messages));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request, { params }: Context) {
  const userId = await requireUserId();
  const conversationId = parseId((await params).id);
  if (!userId) return errorResponse("برای ارسال پیام وارد شوید.", 401);
  if (!conversationId) return errorResponse("شناسه گفتگو نامعتبر است.", 400);
  const body = await readJson(request);
  if (!body || typeof body !== "object") return errorResponse("بدنه درخواست نامعتبر است.", 400);
  const input = body as Record<string, unknown>;
  if (typeof input.text !== "string" || !input.text.trim()) return errorResponse("متن پیام الزامی است.", 400);
  try {
    if (!(await ownedConversation(conversationId, userId))) return errorResponse("گفتگو یافت نشد.", 404);
    const message = await prisma.tb_messages.create({
      data: {
        conversation_id: conversationId,
        sender_type: typeof input.sender_type === "string" ? input.sender_type : "user",
        sender_name: typeof input.sender_name === "string" ? input.sender_name : "کاربر",
        text: input.text.trim(),
      },
    });
    await prisma.tb_conversations.update({ where: { id: conversationId }, data: { updated_at: new Date() } });
    return json(serialize(message), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
