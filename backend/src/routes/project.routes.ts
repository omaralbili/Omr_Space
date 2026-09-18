import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
  updateRoom,
  addMediaObject,
  updateMediaObject,
  deleteMediaObject,
  shareProject,
  getPublicProject,
} from "../controllers/project.controller";

const router = Router();

// رابط عام - يجب أن يسبق requireAuth العام
router.get("/public/:slug", getPublicProject);

router.use(requireAuth);
router.post("/", createProject);
router.get("/", listProjects);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.post("/:id/share", shareProject);

router.put("/rooms/:roomId", updateRoom);
router.post("/rooms/:roomId/objects", addMediaObject);
router.put("/objects/:objectId", updateMediaObject);
router.delete("/objects/:objectId", deleteMediaObject);

export default router;
