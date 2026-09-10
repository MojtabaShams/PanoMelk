import prisma from "@/lib/db";
import type { tb_project_hotspotsUpdateInput } from "@/app/generated/prisma/models/tb_project_hotspots";
import { errorResponse, json, parseId, readJson, requireUserId, serialize, serverError } from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const userId = await requireUserId();
  const id = parseId((await params).id);
  if (!userId) return errorResponse("برای ویرایش هات‌اسپات وارد شوید.", 401);
  if (!id) return errorResponse("شناسه هات‌اسپات نامعتبر است.", 400);
  const body = await readJson(request);
  if (!body || typeof body !== "object") return errorResponse("بدنه درخواست نامعتبر است.", 400);
  const input = body as Record<string, unknown>;
  const data: tb_project_hotspotsUpdateInput = {};
  for (const key of ["title", "pano_image_url", "audio_url", "description"]) {
    if (key in input) data[key] = input[key] === null ? null : String(input[key]);
  }
  for (const key of ["coord_x", "coord_y"]) {
    if (typeof input[key] === "number") data[key] = input[key];
  }
  if (!Object.keys(data).length) return errorResponse("هیچ فیلدی برای ویرایش ارسال نشده است.", 400);

  try {
    const hotspot = await prisma.tb_project_hotspots.findFirst({
      where: { id, tb_projects: { user_id: userId, is_deleted: false } },
      select: { id: true },
    });
    if (!hotspot) return errorResponse("هات‌اسپات یافت نشد.", 404);
    const updated = await prisma.tb_project_hotspots.update({ where: { id }, data });
    return json(serialize(updated));
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_: Request, { params }: Context) {
  const userId = await requireUserId();
  const id = parseId((await params).id);
  if (!userId) return errorResponse("برای حذف هات‌اسپات وارد شوید.", 401);
  if (!id) return errorResponse("شناسه هات‌اسپات نامعتبر است.", 400);

  try {
    const hotspot = await prisma.tb_project_hotspots.findFirst({
      where: { id, tb_projects: { user_id: userId, is_deleted: false } },
      select: { id: true },
    });
    if (!hotspot) return errorResponse("هات‌اسپات یافت نشد.", 404);
    await prisma.tb_project_hotspots.delete({ where: { id } });
    return json({ message: "هات‌اسپات حذف شد." });
  } catch (error) {
    return serverError(error);
  }
}
