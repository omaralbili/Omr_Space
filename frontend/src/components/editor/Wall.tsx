import { useMemo } from "react";
import * as THREE from "three";

interface WallProps {
  from: [number, number];
  to: [number, number];
  height: number;
  color: string;
}

// جدار مبني من نقطتي البداية والنهاية (على مستوى XZ)
export default function Wall({ from, to, height, color }: WallProps) {
  const { length, angle, midX, midZ } = useMemo(() => {
    const dx = to[0] - from[0];
    const dz = to[1] - from[1];
    return {
      length: Math.sqrt(dx * dx + dz * dz),
      angle: Math.atan2(dz, dx),
      midX: (from[0] + to[0]) / 2,
      midZ: (from[1] + to[1]) / 2,
    };
  }, [from, to]);

  return (
    <mesh position={[midX, height / 2, midZ]} rotation={[0, -angle, 0]} receiveShadow castShadow>
      <boxGeometry args={[length, height, 0.15]} />
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}
