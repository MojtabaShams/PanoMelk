import prisma from "@/lib/db";
import { json, serialize, serverError } from "@/lib/api";

export async function GET() {
  try {
    const plans = await prisma.tb_plans.findMany({
      where: { is_active: true },
      orderBy: { price_monthly: "asc" },
    });
    return json(serialize(plans));
  } catch (error) {
    return serverError(error);
  }
}
