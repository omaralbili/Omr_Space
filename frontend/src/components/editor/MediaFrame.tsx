import { Suspense, Component, ReactNode } from "react";
import { useTexture } from "@react-three/drei";
import { MediaObject } from "../../types";

interface Props {
  object: MediaObject;
  room: { width: number; depth: number };
  selected?: boolean;
  onClick?: () => void;
}

// يحوّل موضع العنصر (وفق الجدار) إلى إحداثيات ثلاثية الأبعاد فعلية
function computeTransform(obj: MediaObject, room: { width: number; depth: number }) {
  const w = room.width / 2;
  const d = room.depth / 2;
  switch (obj.wallSide) {
    case "north":
      return { position: [obj.posX, obj.posY, -d + 0.08] as const, rotation: [0, 0, 0] as const };
    case "south":
      return { position: [obj.posX, obj.posY, d - 0.08] as const, rotation: [0, Math.PI, 0] as const };
    case "east":
      return { position: [w - 0.08, obj.posY, obj.posZ] as const, rotation: [0, -Math.PI / 2, 0] as const };
    case "west":
    default:
      return { position: [-w + 0.08, obj.posY, obj.posZ] as const, rotation: [0, Math.PI / 2, 0] as const };
  }
}

class MediaErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: any) {
    console.warn("Failed to load artwork texture:", err);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function ArtworkTextureMesh({
  url,
  scale,
  selected,
}: {
  url: string;
  scale: number;
  selected?: boolean;
}) {
  const texture = useTexture(url);

  // احتساب نسبة العرض للارتفاع الأصلية للصورة
  const img = texture?.image as HTMLImageElement | undefined;
  let w = 1.2 * scale;
  let h = 0.9 * scale;
  if (img && img.width && img.height) {
    const aspect = img.width / img.height;
    if (aspect >= 1) {
      w = 1.3 * scale;
      h = (1.3 / aspect) * scale;
    } else {
      h = 1.1 * scale;
      w = 1.1 * aspect * scale;
    }
  }

  return (
    <>
      {/* إطار اللوحة */}
      <mesh position={[0, 0, -0.015]}>
        <boxGeometry args={[w + 0.08, h + 0.08, 0.03]} />
        <meshStandardMaterial
          color={selected ? "#8b3fff" : "#1e1e24"}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* سطح الصورة */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={texture} roughness={0.3} />
      </mesh>
    </>
  );
}

function FallbackArtworkMesh({
  scale,
  selected,
}: {
  scale: number;
  selected?: boolean;
  title?: string;
}) {
  return (
    <>
      <mesh position={[0, 0, -0.015]}>
        <boxGeometry args={[1.2 * scale + 0.08, 0.9 * scale + 0.08, 0.03]} />
        <meshStandardMaterial color={selected ? "#8b3fff" : "#2a2a3a"} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[1.2 * scale, 0.9 * scale]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
    </>
  );
}

export default function MediaFrame({ object, room, selected, onClick }: Props) {
  const { position, rotation } = computeTransform(object, room);

  return (
    <group
      position={position as any}
      rotation={rotation as any}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <MediaErrorBoundary
        fallback={<FallbackArtworkMesh scale={object.scale} selected={selected} title={object.title} />}
      >
        <Suspense
          fallback={<FallbackArtworkMesh scale={object.scale} selected={selected} title={object.title} />}
        >
          <ArtworkTextureMesh url={object.url} scale={object.scale} selected={selected} />
        </Suspense>
      </MediaErrorBoundary>
    </group>
  );
}
