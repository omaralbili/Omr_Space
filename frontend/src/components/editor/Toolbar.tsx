import { useTranslation } from "react-i18next";
import { Room } from "../../types";
import { useEditorStore } from "../../store/useEditorStore";

export default function Toolbar({ room }: { room: Room }) {
  const { t } = useTranslation();
  const updateRoomSettings = useEditorStore((s) => s.updateRoomSettings);

  return (
    <div className="card space-y-4">
      <h3 className="font-bold">{t("editor.roomSettings")}</h3>

      {(["width", "depth", "height"] as const).map((dim) => (
        <div key={dim}>
          <label className="text-sm text-gray-500 flex justify-between">
            <span>{t(`editor.${dim}`)}</span>
            <span>{room[dim]} m</span>
          </label>
          <input
            type="range"
            min={4}
            max={30}
            step={0.5}
            value={room[dim]}
            onChange={(e) => updateRoomSettings({ [dim]: parseFloat(e.target.value) })}
            className="w-full accent-brand-600"
          />
        </div>
      ))}

      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-500">{t("editor.floorColor")}</label>
        <input
          type="color"
          value={room.floorColor}
          onChange={(e) => updateRoomSettings({ floorColor: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-500">{t("editor.wallColor")}</label>
        <input
          type="color"
          value={room.wallColor}
          onChange={(e) => updateRoomSettings({ wallColor: e.target.value })}
        />
      </div>
    </div>
  );
}
