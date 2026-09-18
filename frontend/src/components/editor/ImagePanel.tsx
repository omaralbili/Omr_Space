import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../lib/api";
import { useEditorStore } from "../../store/useEditorStore";
import { Room } from "../../types";

const walls = ["north", "south", "east", "west"] as const;

export default function ImagePanel({ room }: { room: Room }) {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const addObject = useEditorStore((s) => s.addObject);
  const updateObject = useEditorStore((s) => s.updateObject);
  const removeObject = useEditorStore((s) => s.removeObject);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const selectObject = useEditorStore((s) => s.selectObject);
  const saveStatus = useEditorStore((s) => s.saveStatus);

  const [wallSide, setWallSide] = useState<(typeof walls)[number]>("north");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/upload", formData);
      await addObject({
        type: "image",
        url: data.url,
        title: file.name.replace(/\.[^/.]+$/, ""),
        wallSide,
        posX: 0,
        posY: 1.6,
        posZ: 0,
        rotationY: 0,
        scale: 1,
      });
    } catch (err: any) {
      setUploadError(err?.response?.data?.error || "فشل رفع الصورة");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const selected = (room.objects || []).find((o) => o.id === selectedObjectId);

  // حدود الموضع على الجدار وفق أبعاد الغرفة الفعلية
  const isNorthSouth = selected?.wallSide === "north" || selected?.wallSide === "south";
  const posLimit = isNorthSouth
    ? Math.max(0.5, room.width / 2 - 0.8)
    : Math.max(0.5, room.depth / 2 - 0.8);
  const currentPos = isNorthSouth ? (selected?.posX ?? 0) : (selected?.posZ ?? 0);

  function handlePositionChange(val: number) {
    if (!selected) return;
    if (isNorthSouth) {
      updateObject(selected.id, { posX: val });
    } else {
      updateObject(selected.id, { posZ: val });
    }
  }

  function handleWallSideChange(newWall: (typeof walls)[number]) {
    if (!selected) return;
    updateObject(selected.id, { wallSide: newWall, posX: 0, posZ: 0 });
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{t("editor.objectsPanel")}</h3>
        {saveStatus === "saving" && <span className="text-xs text-brand-600 animate-pulse">جاري الحفظ...</span>}
        {saveStatus === "saved" && <span className="text-xs text-green-600 font-semibold">تم الحفظ ✓</span>}
      </div>

      <div>
        <label className="text-sm text-gray-500 block mb-1">{t("editor.wallSide")}</label>
        <select
          className="input-field"
          value={wallSide}
          onChange={(e) => setWallSide(e.target.value as any)}
        >
          {walls.map((w) => (
            <option key={w} value={w}>
              {t(`editor.${w}`)}
            </option>
          ))}
        </select>
      </div>

      <button
        className="btn-primary w-full"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? "...جاري الرفع" : `+ ${t("editor.addImage")}`}
      </button>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleUpload} />

      {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}

      {/* قائمة الأعمال */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {(room.objects || []).length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-2">لا توجد أعمال معلقة بعد</p>
        ) : (
          (room.objects || []).map((obj) => (
            <div
              key={obj.id}
              onClick={() => selectObject(obj.id)}
              className={`flex items-center justify-between text-sm p-2.5 rounded-xl cursor-pointer transition-colors ${
                obj.id === selectedObjectId
                  ? "bg-brand-50 border border-brand-300 text-brand-700 font-semibold"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <span className="truncate max-w-[160px]">{obj.title || obj.type}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("هل أنت متأكد من حذف هذا العمل؟")) {
                    removeObject(obj.id);
                  }
                }}
                className="text-gray-400 hover:text-red-500 p-1"
                title="حذف"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* لوحة تعديل العمل المحدّد */}
      {selected && (
        <div className="border-t border-gray-100 pt-3 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
            <span>تعديل العمل المحدد</span>
            <span className="text-brand-600 capitalize">{t(`editor.${selected.wallSide}`)}</span>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">اسم اللوحة</label>
            <input
              className="input-field text-sm py-1.5"
              value={selected.title || ""}
              placeholder="اسم اللوحة..."
              onChange={(e) => updateObject(selected.id, { title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">{t("editor.wallSide")}</label>
            <select
              className="input-field text-sm py-1.5"
              value={selected.wallSide}
              onChange={(e) => handleWallSideChange(e.target.value as any)}
            >
              {walls.map((w) => (
                <option key={w} value={w}>
                  {t(`editor.${w}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 flex justify-between mb-1">
              <span>الموضع على الجدار ({isNorthSouth ? "X" : "Z"})</span>
              <span className="font-mono font-semibold">{currentPos.toFixed(1)} m</span>
            </label>
            <input
              type="range"
              min={-posLimit}
              max={posLimit}
              step={0.1}
              value={currentPos}
              onChange={(e) => handlePositionChange(parseFloat(e.target.value))}
              className="w-full accent-brand-600"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 flex justify-between mb-1">
              <span>الارتفاع عن الأرض (Y)</span>
              <span className="font-mono font-semibold">{(selected.posY ?? 1.6).toFixed(1)} m</span>
            </label>
            <input
              type="range"
              min={0.6}
              max={Math.max(1, room.height - 0.6)}
              step={0.1}
              value={selected.posY ?? 1.6}
              onChange={(e) => updateObject(selected.id, { posY: parseFloat(e.target.value) })}
              className="w-full accent-brand-600"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 flex justify-between mb-1">
              <span>الحجم (Scale)</span>
              <span className="font-mono font-semibold">{(selected.scale ?? 1).toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min={0.4}
              max={2.5}
              step={0.1}
              value={selected.scale ?? 1}
              onChange={(e) => updateObject(selected.id, { scale: parseFloat(e.target.value) })}
              className="w-full accent-brand-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
