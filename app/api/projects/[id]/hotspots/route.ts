import prisma from "@/lib/db";
import {
  errorResponse,
  json,
  parseId,
  readJson,
  requireUserId,
  serialize,
  serverError,
} from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const userId = await requireUserId();
  const projectId = parseId((await params).id);
  if (!userId) return errorResponse("برای مشاهده هات‌اسپات‌ها وارد شوید.", 401);
  if (!projectId) return errorResponse("شناسه پروژه نامعتبر است.", 400);

  try {
    const hotspots = await prisma.tb_project_hotspots.findMany({
      where: { project_id: projectId, tb_projects: { user_id: userId, is_deleted: false } },
      orderBy: { created_at: "asc" },
    });
    return json(serialize(hotspots));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request, { params }: Context) {
  const userId = await requireUserId();
  const projectId = parseId((await params).id);
  if (!userId) return errorResponse("برای ساخت هات‌اسپات وارد شوید.", 401);
  if (!projectId) return errorResponse("شناسه پروژه نامعتبر است.", 400);

  const body = await readJson(request);
  if (!body || typeof body !== "object") return errorResponse("بدنه درخواست نامعتبر است.", 400);
  const input = body as Record<string, unknown>;
  if (typeof input.title !== "string" || typeof input.coord_x !== "number" || typeof input.coord_y !== "number") {
    return errorResponse("عنوان و مختصات هات‌اسپات الزامی است.", 400);
  }

  try {
    const project = await prisma.tb_projects.findFirst({
      where: { id: projectId, user_id: userId, is_deleted: false },
      select: { id: true },
    });
    if (!project) return errorResponse("پروژه یافت نشد.", 404);
    const hotspot = await prisma.tb_project_hotspots.create({
      data: {
        project_id: projectId,
        title: input.title,
        coord_x: input.coord_x,
        coord_y: input.coord_y,
        pano_image_url: typeof input.pano_image_url === "string" ? input.pano_image_url : null,
        audio_url: typeof input.audio_url === "string" ? input.audio_url : null,
        description: typeof input.description === "string" ? input.description : null,
      },
    });
    return json(serialize(hotspot), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
