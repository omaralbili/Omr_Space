import React from "react";
import { MediaObject } from "../../types";
import {
  MuseumDesk,
  GalleryChair,
  MuseumBench,
  DisplayPedestal,
  GlassShowcase,
  IndoorPlant,
  BarrierStanchion,
} from "./FurnitureModels";
import {
  StandingVisitor,
  WalkingVisitor,
  MuseumGuide,
  SecurityGuard,
} from "./AnimatedCharacterModels";

interface Props {
  object: MediaObject;
  selected?: boolean;
  onClick?: () => void;
}

export function parseAssetId(url: string): string {
  if (url.startsWith("asset:")) {
    return url.replace("asset:", "");
  }
  return url;
}

function renderSpecificAsset(assetId: string) {
  switch (assetId) {
    case "desk":
      return <MuseumDesk />;
    case "chair":
      return <GalleryChair />;
    case "bench":
      return <MuseumBench />;
    case "pedestal":
      return <DisplayPedestal />;
    case "showcase":
      return <GlassShowcase />;
    case "plant":
      return <IndoorPlant />;
    case "stanchion":
      return <BarrierStanchion />;
    case "visitor_standing":
      return <StandingVisitor />;
    case "visitor_walking":
      return <WalkingVisitor />;
    case "museum_guide":
      return <MuseumGuide />;
    case "security_guard":
      return <SecurityGuard />;
    default:
      // عنصر افتراضي بديل في حال عدم التعرف على المعرف
      return <DisplayPedestal />;
  }
}

export default function AssetRenderer({ object, selected, onClick }: Props) {
  const assetId = parseAssetId(object.url);
  const scale = object.scale ?? 1;

  return (
    <group
      position={[object.posX, object.posY ?? 0, object.posZ]}
      rotation={[0, object.rotationY ?? 0, 0]}
      scale={[scale, scale, scale]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* حلقة تحديد مرئية عند اختيار العنصر في المحرر */}
      {selected && (
        <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.7, 0.78, 32]} />
            <meshBasicMaterial color="#8b3fff" side={2} />
          </mesh>
          <mesh>
            <circleGeometry args={[0.7, 32]} />
            <meshBasicMaterial color="#8b3fff" transparent opacity={0.15} side={2} />
          </mesh>
        </group>
      )}

      {/* المجسم ثلاثي الأبعاد الفعلي */}
      {renderSpecificAsset(assetId)}
    </group>
  );
}

