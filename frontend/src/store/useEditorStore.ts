import { create } from "zustand";
import { api } from "../lib/api";
import { Project, Room, MediaObject } from "../types";

interface EditorState {
  project: Project | null;
  loading: boolean;
  error: string | null;
  saveStatus: "idle" | "saving" | "saved";
  selectedObjectId: string | null;
  loadProject: (id: string) => Promise<void>;
  updateRoomSettings: (patch: Partial<Room>) => void;
  addObject: (obj: Omit<MediaObject, "id">) => Promise<void>;
  updateObject: (objectId: string, patch: Partial<MediaObject>) => void;
  removeObject: (objectId: string) => Promise<void>;
  selectObject: (id: string | null) => void;
}

let roomTimer: any = null;
const objectTimers: Record<string, any> = {};

export const useEditorStore = create<EditorState>((set, get) => ({
  project: null,
  loading: false,
  error: null,
  saveStatus: "idle",
  selectedObjectId: null,

  loadProject: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/projects/${id}`);
      set({ project: data, loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || "فشل تحميل المشروع", loading: false });
    }
  },

  updateRoomSettings: (patch) => {
    const project = get().project;
    if (!project || !project.rooms?.[0]) return;
    const room = project.rooms[0];
    const updatedRoom = { ...room, ...patch };

    // Update locally immediately for instant 60fps response
    set({
      project: {
        ...project,
        rooms: [updatedRoom],
      },
      saveStatus: "saving",
    });

    // Debounce API update to SQLite
    if (roomTimer) clearTimeout(roomTimer);
    roomTimer = setTimeout(async () => {
      try {
        await api.put(`/projects/rooms/${room.id}`, patch);
        set({ saveStatus: "saved" });
        setTimeout(() => set({ saveStatus: "idle" }), 2000);
      } catch (err) {
        console.error("Failed to save room settings:", err);
        set({ saveStatus: "idle" });
      }
    }, 250);
  },

  addObject: async (obj) => {
    const project = get().project;
    if (!project || !project.rooms?.[0]) return;
    const room = project.rooms[0];
    set({ saveStatus: "saving" });
    try {
      const { data } = await api.post(`/projects/rooms/${room.id}/objects`, obj);
      set({
        project: {
          ...project,
          rooms: [{ ...room, objects: [...(room.objects || []), data] }],
        },
        selectedObjectId: data.id,
        saveStatus: "saved",
      });
      setTimeout(() => set({ saveStatus: "idle" }), 2000);
    } catch (err) {
      console.error("Failed to add media object:", err);
      set({ saveStatus: "idle" });
      throw err;
    }
  },

  updateObject: (objectId, patch) => {
    const project = get().project;
    if (!project || !project.rooms?.[0]) return;
    const room = project.rooms[0];

    const updatedObjects = (room.objects || []).map((o) =>
      o.id === objectId ? { ...o, ...patch } : o
    );

    set({
      project: {
        ...project,
        rooms: [{ ...room, objects: updatedObjects }],
      },
      saveStatus: "saving",
    });

    if (objectTimers[objectId]) clearTimeout(objectTimers[objectId]);
    objectTimers[objectId] = setTimeout(async () => {
      try {
        await api.put(`/projects/objects/${objectId}`, patch);
        set({ saveStatus: "saved" });
        setTimeout(() => set({ saveStatus: "idle" }), 2000);
      } catch (err) {
        console.error("Failed to update media object:", err);
        set({ saveStatus: "idle" });
      }
    }, 250);
  },

  removeObject: async (objectId) => {
    const project = get().project;
    if (!project || !project.rooms?.[0]) return;
    const room = project.rooms[0];
    try {
      await api.delete(`/projects/objects/${objectId}`);
      set({
        project: {
          ...project,
          rooms: [{ ...room, objects: (room.objects || []).filter((o) => o.id !== objectId) }],
        },
        selectedObjectId: null,
      });
    } catch (err) {
      console.error("Failed to delete media object:", err);
    }
  },

  selectObject: (id) => set({ selectedObjectId: id }),
}));
