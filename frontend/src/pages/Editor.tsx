import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEditorStore } from "../store/useEditorStore";
import RoomCanvas from "../components/editor/RoomCanvas";
import Toolbar from "../components/editor/Toolbar";
import ImagePanel from "../components/editor/ImagePanel";
import AssetLibraryPanel from "../components/editor/AssetLibraryPanel";

type SidebarTab = "assets" | "images" | "room";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const {
    project,
    loading,
    error,
    loadProject,
    selectedObjectId,
    selectObject,
    addObject,
    saveStatus,
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState<SidebarTab>("assets");

  useEffect(() => {
    if (id) loadProject(id);
  }, [id, loadProject]);

  // عندما يحدد المستخدم عنصراً من المشهد، يتم تحويل التبويب المناسب تلقائياً
  useEffect(() => {
    if (!selectedObjectId || !project?.rooms?.[0]) return;
    const selected = project.rooms[0].objects?.find((o) => o.id === selectedObjectId);
    if (selected) {
      if (selected.type === "model") {
        setActiveTab("assets");
      } else if (selected.type === "image") {
        setActiveTab("images");
      }
    }
  }, [selectedObjectId, project]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-65px)] flex flex-col items-center justify-center text-gray-400">
        <div className="animate-spin text-4xl mb-3">🏛️</div>
        <p>...جاري تحميل المشروع</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-10 text-center text-gray-500">
        <p className="mb-4 text-red-500">{error || "لم يتم العثور على المشروع"}</p>
        <button className="btn-primary" onClick={() => navigate("/dashboard")}>
          العودة للوحة التحكم
        </button>
      </div>
    );
  }

  const room = project.rooms?.[0];
  if (!room) {
    return (
      <div className="p-10 text-center text-gray-500">
        <p className="mb-4">لا توجد قاعة في هذا المشروع.</p>
        <button className="btn-primary" onClick={() => navigate("/dashboard")}>
          العودة للوحة التحكم
        </button>
      </div>
    );
  }

  // معالجة إفلات المجسم عند السحب والإفلات على أرضية القاعة ثلاثية الأبعاد
  async function handleDropAsset(
    assetId: string,
    title: string,
    defaultScale: number,
    x: number,
    z: number
  ) {
    setActiveTab("assets");
    await addObject({
      type: "model",
      url: `asset:${assetId}`,
      title,
      wallSide: "north",
      posX: x,
      posY: 0,
      posZ: z,
      rotationY: 0,
      scale: defaultScale,
    });
  }

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* الشريط الجانبي الذكي مع تبويبات منظمة */}
      <aside className="w-84 shrink-0 flex flex-col border-e border-gray-100 bg-white">
        {/* أزرار التبويبات العلوية */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-2 gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab("assets")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "assets"
                ? "bg-white text-brand-700 shadow-sm border border-gray-200/80"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>🏛️</span>
            <span>{isAr ? "المجسمات والأثاث" : "3D Assets"}</span>
          </button>

          <button
            onClick={() => setActiveTab("images")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "images"
                ? "bg-white text-brand-700 shadow-sm border border-gray-200/80"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>🖼️</span>
            <span>{isAr ? "اللوحات الفنية" : "Artworks"}</span>
          </button>

          <button
            onClick={() => setActiveTab("room")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "room"
                ? "bg-white text-brand-700 shadow-sm border border-gray-200/80"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>⚙️</span>
            <span>{isAr ? "الغرفة" : "Room"}</span>
          </button>
        </div>

        {/* محتوى التبويب النشط مع شريط تمرير سلس */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {activeTab === "assets" && <AssetLibraryPanel room={room} />}
          {activeTab === "images" && <ImagePanel room={room} />}
          {activeTab === "room" && <Toolbar room={room} />}
        </div>
      </aside>

      {/* لوحة العرض والتحكم ثلاثية الأبعاد */}
      <main className="flex-1 relative">
        <RoomCanvas
          room={room}
          selectedObjectId={selectedObjectId}
          onSelectObject={selectObject}
          onDropAsset={handleDropAsset}
        />

        {/* شارة اسم المعرض وحالة الحفظ */}
        <div className="absolute top-4 start-4 flex items-center gap-2 pointer-events-none">
          <span className="bg-white/95 backdrop-blur px-3.5 py-2 rounded-xl text-sm font-bold shadow-sm border border-gray-100 text-gray-800 pointer-events-auto">
            {project.title}
          </span>
          {saveStatus === "saving" && (
            <span className="bg-white/95 backdrop-blur text-brand-600 text-xs px-3 py-2 rounded-xl shadow-sm border border-gray-100 animate-pulse font-medium">
              {isAr ? "جاري الحفظ..." : "Saving..."}
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="bg-white/95 backdrop-blur text-green-600 text-xs px-3 py-2 rounded-xl shadow-sm border border-gray-100 font-semibold">
              {isAr ? "تم الحفظ تلقائياً ✓" : "Saved ✓"}
            </span>
          )}
        </div>

        {/* زر معاينة المتحف بملء الشاشة */}
        <button
          className="absolute top-4 end-4 btn-primary shadow-lg flex items-center gap-2"
          onClick={() => navigate(`/gallery/${project.id}`)}
        >
          <span>👁️</span>
          <span>{t("editor.preview")}</span>
        </button>
      </main>
    </div>
  );
}
