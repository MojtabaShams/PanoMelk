import prisma from "@/lib/db";
import type { tb_projectsUpdateInput } from "@/app/generated/prisma/models/tb_projects";
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

async function ownedProject(id: number, userId: number) {
  return prisma.tb_projects.findFirst({
    where: { id, user_id: userId, is_deleted: false },
  });
}

export async function GET(_: Request, { params }: Context) {
  const userId = await requireUserId();
  const id = parseId((await params).id);
  if (!userId) return errorResponse("برای مشاهده پروژه وارد شوید.", 401);
  if (!id) return errorResponse("شناسه پروژه نامعتبر است.", 400);

  try {
    const project = await prisma.tb_projects.findFirst({
      where: { id, user_id: userId, is_deleted: false },
      include: { tb_project_hotspots: true, tb_project_analytics: true },
    });
    return project ? json(serialize(project)) : errorResponse("پروژه یافت نشد.", 404);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: Request, { params }: Context) {
  const userId = await requireUserId();
  const id = parseId((await params).id);
  if (!userId) return errorResponse("برای ویرایش پروژه وارد شوید.", 401);
  if (!id) return errorResponse("شناسه پروژه نامعتبر است.", 400);

  const body = await readJson(request);
  if (!body || typeof body !== "object") return errorResponse("بدنه درخواست نامعتبر است.", 400);
  const input = body as Record<string, unknown>;
  const data: tb_projectsUpdateInput = {};
  for (const key of ["project_name", "category", "description", "map_image_url", "preview_link", "iframe_code"]) {
    if (key in input) data[key] = input[key] === null ? null : String(input[key]);
  }
  if (Object.keys(data).length === 0) return errorResponse("هیچ فیلدی برای ویرایش ارسال نشده است.", 400);

  try {
    if (!(await ownedProject(id, userId))) return errorResponse("پروژه یافت نشد.", 404);
    const project = await prisma.tb_projects.update({ where: { id }, data });
    return json(serialize(project));
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_: Request, { params }: Context) {
  const userId = await requireUserId();
  const id = parseId((await params).id);
  if (!userId) return errorResponse("برای حذف پروژه وارد شوید.", 401);
  if (!id) return errorResponse("شناسه پروژه نامعتبر است.", 400);

  try {
    if (!(await ownedProject(id, userId))) return errorResponse("پروژه یافت نشد.", 404);
    await prisma.tb_projects.update({ where: { id }, data: { is_deleted: true } });
    return json({ message: "پروژه حذف شد." });
  } catch (error) {
    return serverError(error);
  }
}
