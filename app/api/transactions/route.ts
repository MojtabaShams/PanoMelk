import prisma from "@/lib/db";
import { errorResponse, json, readJson, requireUserId, serialize, serverError } from "@/lib/api";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return errorResponse("برای مشاهده تراکنش‌ها وارد شوید.", 401);
  try {
    const transactions = await prisma.tb_transactions.findMany({
      where: { user_id: userId },
      include: { tb_plans: true },
      orderBy: { created_at: "desc" },
    });
    return json(serialize(transactions));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) return errorResponse("برای ثبت تراکنش وارد شوید.", 401);
  const body = await readJson(request);
  if (!body || typeof body !== "object") return errorResponse("بدنه درخواست نامعتبر است.", 400);
  const input = body as Record<string, unknown>;
  if (
    typeof input.plan_id !== "number" ||
    typeof input.invoice_number !== "string" ||
    typeof input.billing_cycle !== "string" ||
    typeof input.amount !== "number" ||
    typeof input.status !== "string"
  ) {
    return errorResponse("اطلاعات تراکنش کامل نیست.", 400);
  }
  try {
    const transaction = await prisma.tb_transactions.create({
      data: {
        user_id: userId,
        plan_id: input.plan_id,
        invoice_number: input.invoice_number,
        billing_cycle: input.billing_cycle,
        amount: input.amount,
        status: input.status,
        gateway_ref_id: typeof input.gateway_ref_id === "string" ? input.gateway_ref_id : null,
      },
      include: { tb_plans: true },
    });
    return json(serialize(transaction), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
