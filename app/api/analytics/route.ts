import prisma from "@/lib/db";
import { errorResponse, json, parseId, readJson, requireUserId, serialize, serverError } from "@/lib/api";

export async function GET(request: Request) {
  const userId = await requireUserId();
  if (!userId) return errorResponse("برای مشاهده گزارش‌ها وارد شوید.", 401);
  const projectIdValue = new URL(request.url).searchParams.get("projectId");
  const projectId = projectIdValue ? parseId(projectIdValue) : null;
  if (projectIdValue && !projectId) return errorResponse("شناسه پروژه نامعتبر است.", 400);
  try {
    const analytics = await prisma.tb_project_analytics.findMany({
      where: { project_id: projectId ?? undefined, tb_projects: { user_id: userId, is_deleted: false } },
      orderBy: { created_at: "desc" },
    });
    return json(serialize(analytics));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) return errorResponse("برای ثبت گزارش وارد شوید.", 401);
  const body = await readJson(request);
  if (!body || typeof body !== "object") return errorResponse("بدنه درخواست نامعتبر است.", 400);
  const input = body as Record<string, unknown>;
  const projectId = typeof input.project_id === "number" ? input.project_id : null;
  if (!projectId || typeof input.event_type !== "string") return errorResponse("پروژه و نوع رویداد الزامی است.", 400);
  try {
    const project = await prisma.tb_projects.findFirst({ where: { id: projectId, user_id: userId, is_deleted: false }, select: { id: true } });
    if (!project) return errorResponse("پروژه یافت نشد.", 404);
    const event = await prisma.tb_project_analytics.create({
      data: {
        project_id: projectId,
        event_type: input.event_type,
        client_site: typeof input.client_site === "string" ? input.client_site : null,
        ip_address: typeof input.ip_address === "string" ? input.ip_address : null,
      },
    });
    return json(serialize(event), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
