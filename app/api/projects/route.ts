import prisma from "@/lib/db";
import {
  errorResponse,
  json,
  readJson,
  requireUserId,
  serialize,
  serverError,
} from "@/lib/api";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return errorResponse("برای مشاهده پروژه‌ها وارد شوید.", 401);

  try {
    const projects = await prisma.tb_projects.findMany({
      where: { user_id: userId, is_deleted: false },
      include: { tb_project_hotspots: true },
      orderBy: { created_at: "desc" },
    });
    return json(serialize(projects));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) return errorResponse("برای ساخت پروژه وارد شوید.", 401);

  const body = await readJson(request);
  if (!body || typeof body !== "object") {
    return errorResponse("بدنه درخواست نامعتبر است.", 400);
  }

  const input = body as Record<string, unknown>;
  if (typeof input.project_name !== "string" || typeof input.category !== "string") {
    return errorResponse("نام پروژه و دسته‌بندی الزامی است.", 400);
  }

  try {
    const project = await prisma.tb_projects.create({
      data: {
        user_id: userId,
        project_name: input.project_name,
        category: input.category,
        description: typeof input.description === "string" ? input.description : null,
        map_image_url: typeof input.map_image_url === "string" ? input.map_image_url : null,
        preview_link: typeof input.preview_link === "string" ? input.preview_link : null,
        iframe_code: typeof input.iframe_code === "string" ? input.iframe_code : null,
      },
    });
    return json(serialize(project), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
