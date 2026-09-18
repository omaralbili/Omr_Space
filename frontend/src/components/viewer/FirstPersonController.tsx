import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  bounds: { width: number; depth: number };
  onMove?: (pos: THREE.Vector3) => void;
  onLockChange?: (locked: boolean) => void;
}

const SPEED = 4;

export default function FirstPersonController({ bounds, onMove, onLockChange }: Props) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(new THREE.Vector3());
  const lastEmitPos = useRef(new THREE.Vector3());

  useEffect(() => {
    camera.position.set(0, 1.6, bounds.depth / 2 - 1.5);
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    const resetKeys = () => (keys.current = {});

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", resetKeys);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", resetKeys);
    };
  }, [camera, bounds.depth]);

  useFrame((_, delta) => {
    // تحديد سقف زمني لتفادي القفزات المفاجئة عند الانتقال بين النوافذ
    const dt = Math.min(delta, 0.1);

    const dir = new THREE.Vector3();
    const front = new THREE.Vector3();
    camera.getWorldDirection(front);
    front.y = 0;
    front.normalize();

    // crossVectors(front, camera.up) هو متجه اليمين في إحداثيات Three.js
    const right = new THREE.Vector3().crossVectors(front, camera.up).normalize();

    if (keys.current["KeyW"] || keys.current["ArrowUp"]) dir.add(front);
    if (keys.current["KeyS"] || keys.current["ArrowDown"]) dir.sub(front);
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) dir.add(right);
    if (keys.current["KeyA"] || keys.current["ArrowLeft"]) dir.sub(right);

    if (dir.lengthSq() > 0) {
      dir.normalize().multiplyScalar(SPEED * dt);
      velocity.current.lerp(dir, 0.4);
    } else {
      velocity.current.lerp(new THREE.Vector3(), 0.3);
    }

    const nextX = camera.position.x + velocity.current.x;
    const nextZ = camera.position.z + velocity.current.z;
    const margin = 0.5;
    const halfW = bounds.width / 2 - margin;
    const halfD = bounds.depth / 2 - margin;

    camera.position.x = THREE.MathUtils.clamp(nextX, -halfW, halfW);
    camera.position.z = THREE.MathUtils.clamp(nextZ, -halfD, halfD);
    camera.position.y = 1.6;

    // إرسال تحديث الموضع فقط عند الحركة وبحد أدنى لتجنب إعادة تصيير الشاشة 60 مرة بالثانية
    if (velocity.current.lengthSq() > 0.0001 && camera.position.distanceToSquared(lastEmitPos.current) > 0.002) {
      lastEmitPos.current.copy(camera.position);
      onMove?.(camera.position);
    }
  });

  return (
    <PointerLockControls
      onLock={() => onLockChange?.(true)}
      onUnlock={() => onLockChange?.(false)}
    />
  );
}
