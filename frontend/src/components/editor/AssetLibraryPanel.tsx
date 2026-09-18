import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ASSET_LIBRARY, AssetDefinition } from "../assets/assetLibrary";
import { useEditorStore } from "../../store/useEditorStore";
import { Room } from "../../types";

interface Props {
  room: Room;
}

export default function AssetLibraryPanel({ room }: Props) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const addObject = useEditorStore((s) => s.addObject);
  const updateObject = useEditorStore((s) => s.updateObject);
  const removeObject = useEditorStore((s) => s.removeObject);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const selectObject = useEditorStore((s) => s.selectObject);
  const saveStatus = useEditorStore((s) => s.saveStatus);

  const [category, setCategory] = useState<"all" | "furniture" | "character">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssets = ASSET_LIBRARY.filter((a) => {
    const matchesCategory = category === "all" || a.category === category;
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // التحقق مما إذا كان العنصر المحدد حاليًا هو مجسم 3D
  const selectedModel = (room.objects || []).find(
    (o) => o.id === selectedObjectId && o.type === "model"
  );

  const halfW = Math.max(1, room.width / 2 - 0.5);
  const halfD = Math.max(1, room.depth / 2 - 0.5);

  // إضافة مباشرة إلى وسط القاعة (Direct Placement)
  async function handleDirectPlacement(asset: AssetDefinition) {
    // وضع المجسم قرب مركز الغرفة مع إزاحة طفيفة عشوائية لمنع تداخل المجسمات
    const jitterX = (Math.random() - 0.5) * 1.5;
    const jitterZ = (Math.random() - 0.5) * 1.5;

    await addObject({
      type: "model",
      url: `asset:${asset.id}`,
      title: isAr ? asset.name : asset.nameEn,
      wallSide: "north",
      posX: jitterX,
      posY: 0,
      posZ: jitterZ,
      rotationY: 0,
      scale: asset.defaultScale,
    });
  }

  // تكرار العنصر المحدد
  async function handleDuplicate(obj: typeof selectedModel) {
    if (!obj) return;
    await addObject({
      type: "model",
      url: obj.url,
      title: `${obj.title || "مجسم"} (نسخة)`,
      wallSide: obj.wallSide,
      posX: Math.min(halfW, obj.posX + 0.6),
      posY: obj.posY,
      posZ: Math.min(halfD, obj.posZ + 0.6),
      rotationY: obj.rotationY,
      scale: obj.scale,
    });
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span>🏛️</span>
          <span>{isAr ? "مكتبة المجسمات والأثاث" : "3D Asset Library"}</span>
        </h3>
        {saveStatus === "saving" && (
          <span className="text-xs text-brand-600 animate-pulse font-medium">
            {isAr ? "جاري الحفظ..." : "Saving..."}
          </span>
        )}
        {saveStatus === "saved" && (
          <span className="text-xs text-green-600 font-semibold">
            {isAr ? "تم الحفظ ✓" : "Saved ✓"}
          </span>
        )}
      </div>

      {/* تصنيفات المكتبة */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setCategory("all")}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            category === "all" ? "bg-white text-brand-700 shadow-sm font-bold" : "text-gray-600 hover:text-black"
          }`}
        >
          {isAr ? "الكل" : "All"}
        </button>
        <button
          onClick={() => setCategory("furniture")}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            category === "furniture" ? "bg-white text-brand-700 shadow-sm font-bold" : "text-gray-600 hover:text-black"
          }`}
        >
          {isAr ? "🪑 أثاث" : "🪑 Furniture"}
        </button>
        <button
          onClick={() => setCategory("character")}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            category === "character" ? "bg-white text-brand-700 shadow-sm font-bold" : "text-gray-600 hover:text-black"
          }`}
        >
          {isAr ? "🚶 شخصيات" : "🚶 Avatars"}
        </button>
      </div>

      {/* شريط البحث */}
      <input
        type="text"
        className="input-field text-xs py-2"
        placeholder={isAr ? "ابحث عن مجسم (كرسي، مرشد، مكتب)..." : "Search assets..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* تنبيه تعليمي للسحب والإفلات والإضافة */}
      <div className="p-2.5 bg-brand-50 border border-brand-100 rounded-xl text-xs text-brand-800 flex items-start gap-2 leading-relaxed">
        <span className="text-base">💡</span>
        <span>
          {isAr
            ? "اسحب المجسم وأفلته داخل القاعة ثلاثية الأبعاد، أو اضغط (+ وضع) لإضافته فوراً."
            : "Drag and drop any asset into the 3D room, or click (+ Add) for direct placement."}
        </span>
      </div>

      {/* شبكة المجسمات */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto pe-1">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "application/json",
                JSON.stringify({
                  assetId: asset.id,
                  title: isAr ? asset.name : asset.nameEn,
                  defaultScale: asset.defaultScale,
                })
              );
              e.dataTransfer.effectAllowed = "copy";
            }}
            className="p-3 bg-gray-50 hover:bg-brand-50/50 hover:border-brand-200 border border-gray-200/70 rounded-xl cursor-grab active:cursor-grabbing transition-all group flex flex-col gap-2 shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl p-1.5 bg-white rounded-lg border border-gray-100 shadow-2xs">
                  {asset.icon}
                </span>
                <div>
                  <h4 className="font-bold text-xs text-gray-800 group-hover:text-brand-700 transition-colors">
                    {isAr ? asset.name : asset.nameEn}
                  </h4>
                  <span className="text-[10px] text-gray-500 line-clamp-1">
                    {isAr ? asset.description : asset.descriptionEn}
                  </span>
                </div>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold shrink-0 ${
                  asset.category === "character"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {asset.category === "character" ? (isAr ? "متحرك" : "Animated") : (isAr ? "أثاث" : "Furniture")}
              </span>
            </div>

            <button
              onClick={() => handleDirectPlacement(asset)}
              className="w-full text-xs font-semibold py-1.5 px-3 rounded-lg bg-white border border-gray-200 text-gray-700 group-hover:bg-brand-600 group-hover:text-white group-hover:border-transparent transition-all flex items-center justify-center gap-1.5"
            >
              <span>+</span>
              <span>{isAr ? "وضع في المعرض" : "Add to Gallery"}</span>
            </button>
          </div>
        ))}
      </div>

      {/* قائمة المجسمات الموجودة في المعرض حالياً */}
      <div className="border-t border-gray-100 pt-3">
        <label className="text-xs font-semibold text-gray-500 block mb-2">
          {isAr ? "المجسمات بالقاعة" : "Assets in Room"} (
          {(room.objects || []).filter((o) => o.type === "model").length})
        </label>
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {(room.objects || [])
            .filter((o) => o.type === "model")
            .map((obj) => (
              <div
                key={obj.id}
                onClick={() => selectObject(obj.id)}
                className={`flex items-center justify-between text-xs p-2 rounded-lg cursor-pointer transition-colors ${
                  obj.id === selectedObjectId
                    ? "bg-brand-50 border border-brand-300 text-brand-700 font-semibold"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span className="truncate max-w-[150px]">{obj.title || obj.url.replace("asset:", "")}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(isAr ? "هل أنت متأكد من حذف هذا المجسم؟" : "Delete this 3D asset?")) {
                      removeObject(obj.id);
                    }
                  }}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title={isAr ? "حذف" : "Delete"}
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* لوحة تحكم وتعديل المجسم المحدّد (Inspector) */}
      {selectedModel && (
        <div className="border-t border-gray-200 pt-3 space-y-3 bg-brand-50/40 -mx-5 -mb-5 p-4 rounded-b-2xl border-t border-brand-100">
          <div className="flex items-center justify-between text-xs font-bold text-brand-800">
            <span>⚙️ {isAr ? "خصائص المجسم المحدد" : "Selected Asset Controls"}</span>
            <button
              onClick={() => handleDuplicate(selectedModel)}
              className="text-[10px] bg-white border border-brand-200 text-brand-700 hover:bg-brand-100 px-2 py-0.5 rounded-md font-semibold transition-colors"
            >
              📋 {isAr ? "تكرار" : "Duplicate"}
            </button>
          </div>

          <div>
            <label className="text-[11px] text-gray-500 block mb-1">
              {isAr ? "اسم المجسم" : "Asset Name"}
            </label>
            <input
              className="input-field text-xs py-1.5"
              value={selectedModel.title || ""}
              onChange={(e) => updateObject(selectedModel.id, { title: e.target.value })}
            />
          </div>

          {/* الموضع X على الأرضية */}
          <div>
            <label className="text-[11px] text-gray-600 flex justify-between mb-1">
              <span>{isAr ? "الموضع الأفقي (X)" : "Position (X)"}</span>
              <span className="font-mono font-semibold">{selectedModel.posX.toFixed(1)} m</span>
            </label>
            <input
              type="range"
              min={-halfW}
              max={halfW}
              step={0.1}
              value={selectedModel.posX}
              onChange={(e) => updateObject(selectedModel.id, { posX: parseFloat(e.target.value) })}
              className="w-full accent-brand-600"
            />
          </div>

          {/* الموضع Z على الأرضية */}
          <div>
            <label className="text-[11px] text-gray-600 flex justify-between mb-1">
              <span>{isAr ? "الموضع العمقي (Z)" : "Position (Z)"}</span>
              <span className="font-mono font-semibold">{selectedModel.posZ.toFixed(1)} m</span>
            </label>
            <input
              type="range"
              min={-halfD}
              max={halfD}
              step={0.1}
              value={selectedModel.posZ}
              onChange={(e) => updateObject(selectedModel.id, { posZ: parseFloat(e.target.value) })}
              className="w-full accent-brand-600"
            />
          </div>

          {/* زاوية التدوير Y (Rotation) */}
          <div>
            <label className="text-[11px] text-gray-600 flex justify-between mb-1">
              <span>{isAr ? "التدوير (درجة)" : "Rotation"}</span>
              <span className="font-mono font-semibold">
                {Math.round(((selectedModel.rotationY || 0) * 180) / Math.PI)}°
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={Math.PI * 2}
              step={0.05}
              value={selectedModel.rotationY || 0}
              onChange={(e) => updateObject(selectedModel.id, { rotationY: parseFloat(e.target.value) })}
              className="w-full accent-brand-600"
            />
          </div>

          {/* الحجم (Scale) */}
          <div>
            <label className="text-[11px] text-gray-600 flex justify-between mb-1">
              <span>{isAr ? "الحجم (Scale)" : "Scale"}</span>
              <span className="font-mono font-semibold">{(selectedModel.scale || 1).toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min={0.4}
              max={2.5}
              step={0.05}
              value={selectedModel.scale || 1}
              onChange={(e) => updateObject(selectedModel.id, { scale: parseFloat(e.target.value) })}
              className="w-full accent-brand-600"
            />
          </div>

          <button
            onClick={() => {
              if (window.confirm(isAr ? "هل أنت متأكد من حذف هذا المجسم؟" : "Delete this 3D asset?")) {
                removeObject(selectedModel.id);
              }
            }}
            className="w-full text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-1.5 rounded-lg font-semibold transition-colors"
          >
            🗑️ {isAr ? "حذف المجسم من القاعة" : "Remove Asset from Room"}
          </button>
        </div>
      )}
    </div>
  );
}

