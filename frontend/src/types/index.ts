export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Wall {
  id: string;
  startX: number;
  startZ: number;
  endX: number;
  endZ: number;
  height: number;
  hasDoor: boolean;
  hasWindow: boolean;
}

export interface MediaObject {
  id: string;
  type: "image" | "video" | "pdf" | "model" | "text" | "audio";
  url: string;
  title?: string;
  wallSide: "north" | "south" | "east" | "west";
  posX: number;
  posY: number;
  posZ: number;
  rotationY: number;
  scale: number;
}

export interface Room {
  id: string;
  name: string;
  width: number;
  depth: number;
  height: number;
  floorColor: string;
  wallColor: string;
  walls: Wall[];
  objects: MediaObject[];
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  coverImage?: string;
  rooms: Room[];
  createdAt: string;
  updatedAt: string;
}
