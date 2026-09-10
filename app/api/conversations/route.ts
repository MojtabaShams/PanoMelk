import prisma from "@/lib/db";
import { errorResponse, json, readJson, requireUserId, serialize, serverError } from "@/lib/api";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return errorResponse("برای مشاهده گفتگوها وارد شوید.", 401);
  try {
    const conversations = await prisma.tb_conversations.findMany({
      where: { user_id: userId },
      include: { tb_messages: { orderBy: { created_at: "asc" } } },
      orderBy: { updated_at: "desc" },
    });
    return json(serialize(conversations));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) return errorResponse("برای ساخت گفتگو وارد شوید.", 401);
  const body = await readJson(request);
  if (!body || typeof body !== "object") return errorResponse("بدنه درخواست نامعتبر است.", 400);
  const input = body as Record<string, unknown>;
  if (typeof input.subject !== "string" || typeof input.category !== "string" || typeof input.category_label !== "string") {
    return errorResponse("موضوع، دسته‌بندی و عنوان دسته‌بندی الزامی است.", 400);
  }
  try {
    const conversation = await prisma.tb_conversations.create({
      data: {
        user_id: userId,
        subject: input.subject,
        category: input.category,
        category_label: input.category_label,
        status: typeof input.status === "string" ? input.status : "active",
      },
    });
    return json(serialize(conversation), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
