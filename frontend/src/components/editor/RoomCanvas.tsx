import { Suspense, useRef, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";
import Wall from "./Wall";
import MediaFrame from "./MediaFrame";
import AssetRenderer from "../assets/AssetRenderer";
import { Room } from "../../types";

interface Props {
  room: Room;
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  onDropAsset?: (assetId: string, title: string, defaultScale: number, x: number, z: number) => void;
}

// مكون لمزامنة كاميرا المشهد لحساب إحداثيات السحب والإفلات بدقة
function CameraTracker({ onCameraReady }: { onCameraReady: (cam: THREE.Camera) => void }) {
  const { camera } = useThree();
  onCameraReady(camera);
  return null;
}

export default function RoomCanvas({
  room,
  selectedObjectId,
  onSelectObject,
  onDropAsset,
}: Props) {
  const w = room.width / 2;
  const d = room.depth / 2;
  const cameraRef = useRef<THREE.Camera | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCameraReady = useCallback((cam: THREE.Camera) => {
    cameraRef.current = cam;
  }, []);

  // معالجة إفلات العنصر بالسحب على الأرضية ثلاثية الأبعاد
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (!containerRef.current || !cameraRef.current) return;

    try {
      const rawData = e.dataTransfer.getData("application/json");
      if (!rawData) return;
      const data = JSON.parse(rawData);
      if (!data.assetId) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 - 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = new THREE.Vector3();
      const intersected = raycaster.ray.intersectPlane(floorPlane, hit);

      const halfW = Math.max(1, room.width / 2 - 0.5);
      const halfD = Math.max(1, room.depth / 2 - 0.5);

      const finalX = intersected
        ? THREE.MathUtils.clamp(hit.x, -halfW, halfW)
        : 0;
      const finalZ = intersected
        ? THREE.MathUtils.clamp(hit.z, -halfD, halfD)
        : 0;

      onDropAsset?.(
        data.assetId,
        data.title || "مجسم",
        data.defaultScale || 1,
        finalX,
        finalZ
      );
    } catch (err) {
      console.error("Drop calculation error:", err);
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDrop={handleDrop}
    >
      <Canvas
        shadows
        camera={{ position: [0, 6, 12], fov: 50 }}
        onPointerMissed={() => onSelectObject(null)}
      >
        <CameraTracker onCameraReady={handleCameraReady} />

        {/* إضاءة استوديو متوازنة وموثوقة محليًا */}
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
          {/* الأرضية */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[room.width, room.depth]} />
            <meshStandardMaterial color={room.floorColor} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>

          <Grid
            args={[room.width, room.depth]}
            position={[0, 0.01, 0]}
            cellColor="#d0d0e0"
            sectionColor="#a0a0c0"
          />

          {/* الجدران الأربعة */}
          <Wall from={[-w, -d]} to={[w, -d]} height={room.height} color={room.wallColor} />
          <Wall from={[w, -d]} to={[w, d]} height={room.height} color={room.wallColor} />
          <Wall from={[w, d]} to={[-w, d]} height={room.height} color={room.wallColor} />
          <Wall from={[-w, d]} to={[-w, -d]} height={room.height} color={room.wallColor} />

          {/* اللوحات الفنية المعلّقة على الجدران */}
          {(room.objects || [])
            .filter((o) => o.type === "image")
            .map((obj) => (
              <MediaFrame
                key={obj.id}
                object={obj}
                room={room}
                selected={selectedObjectId === obj.id}
                onClick={() => onSelectObject(obj.id)}
              />
            ))}

          {/* الأثاث والمجسمات والشخصيات ثلاثية الأبعاد */}
          {(room.objects || [])
            .filter((o) => o.type === "model")
            .map((obj) => (
              <AssetRenderer
                key={obj.id}
                object={obj}
                selected={selectedObjectId === obj.id}
                onClick={() => onSelectObject(obj.id)}
              />
            ))}
        </Suspense>

        <OrbitControls
          target={[0, 1.5, 0]}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={2}
          maxDistance={40}
        />
      </Canvas>
    </div>
  );
}
