import { Response } from "express";
import { v4 as uuid } from "uuid";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

// إنشاء مشروع جديد مع غرفة افتراضية وجدران محيطية أوتوماتيكية (مستطيل)
export async function createProject(req: AuthRequest, res: Response) {
  try {
    const { title, description } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: "عنوان المشروع مطلوب" });

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        ownerId: req.userId!,
        rooms: {
          create: {
            name: "القاعة الرئيسية",
            width: 10,
            depth: 10,
            height: 4,
            walls: {
              create: [
                { startX: -5, startZ: -5, endX: 5, endZ: -5, height: 4 }, // شمال
                { startX: 5, startZ: -5, endX: 5, endZ: 5, height: 4 },   // شرق
                { startX: 5, startZ: 5, endX: -5, endZ: 5, height: 4 },   // جنوب
                { startX: -5, startZ: 5, endX: -5, endZ: -5, height: 4 }, // غرب
              ],
            },
          },
        },
      },
      include: { rooms: { include: { walls: true, objects: true } } },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "حدث خطأ أثناء إنشاء المشروع" });
  }
}

export async function listProjects(req: AuthRequest, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: req.userId },
      orderBy: { updatedAt: "desc" },
      include: { rooms: { include: { objects: true } } },
    });
    res.json(projects);
  } catch (error) {
    console.error("Error listing projects:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب المشاريع" });
  }
}

export async function getProject(req: AuthRequest, res: Response) {
  try {
    let project = await prisma.project.findFirst({
      where: { id: req.params.id, ownerId: req.userId },
      include: { rooms: { include: { walls: true, objects: true } } },
    });
    if (!project) return res.status(404).json({ error: "المشروع غير موجود" });

    // إذا كانت الغرف فارغة، أنشئ غرفة افتراضية لمنع توقف الواجهة
    if (!project.rooms || project.rooms.length === 0) {
      const room = await prisma.room.create({
        data: {
          projectId: project.id,
          name: "القاعة الرئيسية",
          width: 10,
          depth: 10,
          height: 4,
        },
        include: { walls: true, objects: true },
      });
      project = { ...project, rooms: [room] };
    }

    res.json(project);
  } catch (error) {
    console.error("Error getting project:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب تفاصيل المشروع" });
  }
}

export async function updateProject(req: AuthRequest, res: Response) {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, ownerId: req.userId },
    });
    if (!project) return res.status(404).json({ error: "المشروع غير موجود" });
    const { title, description, isPublic, coverImage } = req.body;
    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(isPublic !== undefined && { isPublic: Boolean(isPublic) }),
        ...(coverImage !== undefined && { coverImage }),
      },
    });
    res.json(updated);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تحديث المشروع" });
  }
}

export async function deleteProject(req: AuthRequest, res: Response) {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, ownerId: req.userId },
    });
    if (!project) return res.status(404).json({ error: "المشروع غير موجود" });
    await prisma.project.delete({ where: { id: project.id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "حدث خطأ أثناء حذف المشروع" });
  }
}

// تحديث أبعاد وألوان الغرفة
export async function updateRoom(req: AuthRequest, res: Response) {
  try {
    const { roomId } = req.params;
    const room = await prisma.room.findFirst({
      where: { id: roomId, project: { ownerId: req.userId } },
    });
    if (!room) return res.status(404).json({ error: "الغرفة غير موجودة" });
    const { width, depth, height, floorColor, wallColor } = req.body;
    const updated = await prisma.room.update({
      where: { id: roomId },
      data: {
        ...(width !== undefined && { width: Number(width) }),
        ...(depth !== undefined && { depth: Number(depth) }),
        ...(height !== undefined && { height: Number(height) }),
        ...(floorColor !== undefined && { floorColor }),
        ...(wallColor !== undefined && { wallColor }),
      },
      include: { walls: true, objects: true },
    });
    res.json(updated);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تحديث الغرفة" });
  }
}

// إضافة عنصر وسائط (صورة/فيديو/PDF/نموذج/نص/صوت) على جدار
export async function addMediaObject(req: AuthRequest, res: Response) {
  try {
    const { roomId } = req.params;
    const room = await prisma.room.findFirst({
      where: { id: roomId, project: { ownerId: req.userId } },
    });
    if (!room) return res.status(404).json({ error: "الغرفة غير موجودة" });

    const { type, url, title, wallSide, posX, posY, posZ, rotationY, scale } = req.body;
    if (!url) return res.status(400).json({ error: "رابط الملف مطلوب" });

    const obj = await prisma.mediaObject.create({
      data: {
        roomId,
        type: type || "image",
        url,
        title: title || null,
        wallSide: wallSide || "north",
        posX: Number(posX ?? 0),
        posY: Number(posY ?? 1.6),
        posZ: Number(posZ ?? 0),
        rotationY: Number(rotationY ?? 0),
        scale: Number(scale ?? 1),
      },
    });
    res.status(201).json(obj);
  } catch (error) {
    console.error("Error adding media object:", error);
    res.status(500).json({ error: "حدث خطأ أثناء إضافة العنصر" });
  }
}

// تحديث عنصر وسائط (موضعه، أبعاده، الجدار، العنوان)
export async function updateMediaObject(req: AuthRequest, res: Response) {
  try {
    const { objectId } = req.params;
    const obj = await prisma.mediaObject.findFirst({
      where: { id: objectId, room: { project: { ownerId: req.userId } } },
    });
    if (!obj) return res.status(404).json({ error: "العنصر غير موجود" });

    const { title, wallSide, posX, posY, posZ, rotationY, scale } = req.body;
    const updated = await prisma.mediaObject.update({
      where: { id: objectId },
      data: {
        ...(title !== undefined && { title }),
        ...(wallSide !== undefined && { wallSide }),
        ...(posX !== undefined && { posX: Number(posX) }),
        ...(posY !== undefined && { posY: Number(posY) }),
        ...(posZ !== undefined && { posZ: Number(posZ) }),
        ...(rotationY !== undefined && { rotationY: Number(rotationY) }),
        ...(scale !== undefined && { scale: Number(scale) }),
      },
    });
    res.json(updated);
  } catch (error) {
    console.error("Error updating media object:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تحديث العنصر" });
  }
}

export async function deleteMediaObject(req: AuthRequest, res: Response) {
  try {
    const { objectId } = req.params;
    const obj = await prisma.mediaObject.findFirst({
      where: { id: objectId, room: { project: { ownerId: req.userId } } },
    });
    if (!obj) return res.status(404).json({ error: "العنصر غير موجود" });
    await prisma.mediaObject.delete({ where: { id: objectId } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting media object:", error);
    res.status(500).json({ error: "حدث خطأ أثناء حذف العنصر" });
  }
}

// إنشاء رابط مشاركة عام
export async function shareProject(req: AuthRequest, res: Response) {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, ownerId: req.userId },
    });
    if (!project) return res.status(404).json({ error: "المشروع غير موجود" });

    await prisma.project.update({ where: { id: project.id }, data: { isPublic: true } });

    // إعادة استخدام رابط مشاركة سابق إن وُجد لتفادي التكرار
    let share = await prisma.share.findFirst({ where: { projectId: project.id } });
    if (!share) {
      const slug = uuid().slice(0, 8);
      share = await prisma.share.create({ data: { projectId: project.id, slug } });
    }
    res.status(200).json({ slug: share.slug, url: `/view/${share.slug}` });
  } catch (error) {
    console.error("Error sharing project:", error);
    res.status(500).json({ error: "حدث خطأ أثناء إنشاء رابط المشاركة" });
  }
}

// عرض عام للمتحف عبر رابط المشاركة (بدون تسجيل دخول)
export async function getPublicProject(req: AuthRequest, res: Response) {
  try {
    const share = await prisma.share.findUnique({
      where: { slug: req.params.slug },
      include: {
        project: { include: { rooms: { include: { walls: true, objects: true } } } },
      },
    });
    if (!share || !share.project) return res.status(404).json({ error: "الرابط غير صحيح أو منتهي" });
    res.json(share.project);
  } catch (error) {
    console.error("Error getting public project:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب المعرض" });
  }
}
