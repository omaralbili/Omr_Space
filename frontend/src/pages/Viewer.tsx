import { useEffect, useState, Suspense, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { useTranslation } from "react-i18next";
import * as THREE from "three";
import { api } from "../lib/api";
import { Project } from "../types";
import Wall from "../components/editor/Wall";
import MediaFrame from "../components/editor/MediaFrame";
import AssetRenderer from "../components/assets/AssetRenderer";
import FirstPersonController from "../components/viewer/FirstPersonController";
import MiniMap from "../components/viewer/MiniMap";

export default function Viewer({ isPublic = false }: { isPublic?: boolean }) {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState({ x: 0, z: 0 });
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const url = isPublic ? `/projects/public/${params.slug}` : `/projects/${params.id}`;
        const { data } = await api.get(url);
        setProject(data);
      } catch (err: any) {
        setError(err?.response?.data?.error || "فشل تحميل المعرض");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id, params.slug, isPublic]);

  const handlePlayerMove = useCallback((pos: THREE.Vector3) => {
    setPlayer({ x: pos.x, z: pos.z });
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-950 text-white">
        <div className="animate-spin text-4xl mb-4">🏛️</div>
        <p className="text-gray-400">...جاري تحميل المعرض</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">{error || "المشروع غير موجود"}</h2>
        <p className="text-gray-400 mb-6">الرابط غير صحيح أو انتهت صلاحية المشاركة.</p>
        <button
          className="btn-primary"
          onClick={() => (isPublic ? navigate("/") : navigate("/dashboard"))}
        >
          {t("viewer.back")}
        </button>
      </div>
    );
  }

  const room = project.rooms?.[0];
  if (!room) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6 text-center">
        <p className="text-gray-400 mb-4">لا توجد قاعة في هذا المعرض.</p>
        <button className="btn-primary" onClick={() => navigate(-1)}>
          {t("viewer.back")}
        </button>
      </div>
    );
  }

  const w = room.width / 2;
  const d = room.depth / 2;

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden select-none">
      <Canvas shadows camera={{ fov: 70 }}>
        <ambientLight intensity={0.7} />
        <hemisphereLight args={["#ffffff", "#475569", 0.6]} />
        <directionalLight position={[w, room.height + 4, d]} intensity={1.2} castShadow />
        <directionalLight position={[-w, room.height + 2, -d]} intensity={0.5} />
        <pointLight
          position={[0, room.height - 0.3, 0]}
          intensity={0.8}
          distance={Math.max(room.width, room.depth) * 2}
        />

        <Suspense fallback={null}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[room.width, room.depth]} />
            <meshStandardMaterial color={room.floorColor} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>

          <Wall from={[-w, -d]} to={[w, -d]} height={room.height} color={room.wallColor} />
          <Wall from={[w, -d]} to={[w, d]} height={room.height} color={room.wallColor} />
          <Wall from={[w, d]} to={[-w, d]} height={room.height} color={room.wallColor} />
          <Wall from={[-w, d]} to={[-w, -d]} height={room.height} color={room.wallColor} />

          {/* اللوحات الفنية */}
          {(room.objects || [])
            .filter((o) => o.type === "image")
            .map((obj) => (
              <MediaFrame key={obj.id} object={obj} room={room} />
            ))}

          {/* مجسمات الأثاث والشخصيات المتحركة */}
          {(room.objects || [])
            .filter((o) => o.type === "model")
            .map((obj) => (
              <AssetRenderer key={obj.id} object={obj} />
            ))}
        </Suspense>

        <FirstPersonController
          bounds={{ width: room.width, depth: room.depth }}
          onMove={handlePlayerMove}
          onLockChange={setIsLocked}
        />
      </Canvas>

      {/* شريط الأزرار العلوي */}
      <div className="absolute top-4 start-4 flex gap-2 z-10">
        <button
          onClick={() => (isPublic ? navigate("/") : navigate(-1))}
          className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold shadow transition-colors"
        >
          {t("viewer.back")}
        </button>
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold shadow transition-colors"
        >
          {t("viewer.fullscreen")}
        </button>
      </div>

      {/* نافذة تنبيه بدء التحكم وقفل المؤشر */}
      {!isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
          <div className="bg-white/95 backdrop-blur text-gray-800 px-6 py-5 rounded-2xl shadow-2xl text-center max-w-sm pointer-events-auto cursor-pointer border border-gray-100">
            <div className="text-4xl mb-2">🖱️</div>
            <h3 className="font-bold text-lg mb-1">انقر للبدء والتجول بالماوس</h3>
            <p className="text-xs text-gray-500 mb-3">{t("viewer.controls")}</p>
            <span className="inline-block bg-brand-600 text-white text-xs px-4 py-2 rounded-xl font-bold">
              انقر داخل الشاشة
            </span>
          </div>
        </div>
      )}

      {/* تعليمات الحركة أثناء القفل */}
      {isLocked && (
        <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none z-10">
          <span className="bg-black/60 text-white text-xs px-4 py-2 rounded-full backdrop-blur">
            {t("viewer.controls")} | اضغط Esc لتحرير الماوس
          </span>
        </div>
      )}

      <MiniMap width={room.width} depth={room.depth} playerX={player.x} playerZ={player.z} />
    </div>
  );
}
