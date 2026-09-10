import prisma from "@/lib/db";
import { errorResponse, json, parseId, requireUserId, serialize, serverError } from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const userId = await requireUserId();
  const id = parseId((await params).id);
  if (!userId) return errorResponse("برای مشاهده تراکنش وارد شوید.", 401);
  if (!id) return errorResponse("شناسه تراکنش نامعتبر است.", 400);
  try {
    const transaction = await prisma.tb_transactions.findFirst({
      where: { id, user_id: userId },
      include: { tb_plans: true },
    });
    return transaction ? json(serialize(transaction)) : errorResponse("تراکنش یافت نشد.", 404);
  } catch (error) {
    return serverError(error);
  }
}
