import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 1. زائر يتأمل اللوحات (مع حركة تنفس والتفات رأس طبيعية)
export function StandingVisitor() {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // حركة تنفس ناعمة للجذع
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.95 + Math.sin(t * 2) * 0.012;
      bodyRef.current.rotation.z = Math.sin(t * 0.8) * 0.01;
    }
    // حركة التفات وتأمل بالرأس
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.7) * 0.35;
      headRef.current.rotation.x = -0.1 + Math.sin(t * 1.2) * 0.08;
    }
    // حركة ذراعين خفيفة
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t * 2) * 0.04;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = -Math.sin(t * 2) * 0.04;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* الحذاء والقدمان */}
      <mesh position={[-0.12, 0.04, 0.02]} castShadow>
        <boxGeometry args={[0.11, 0.08, 0.22]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.12, 0.04, 0.02]} castShadow>
        <boxGeometry args={[0.11, 0.08, 0.22]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* الساقان (البنطال) */}
      <mesh position={[-0.12, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.055, 0.82]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      <mesh position={[0.12, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.055, 0.82]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* الجذع والقميص */}
      <group ref={bodyRef} position={[0, 0.95, 0]}>
        <mesh position={[0, 0.26, 0]} castShadow>
          <boxGeometry args={[0.38, 0.52, 0.22]} />
          <meshStandardMaterial color="#0284c7" roughness={0.6} />
        </mesh>

        {/* الذراع اليسرى */}
        <group ref={leftArmRef} position={[-0.23, 0.44, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.5]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, -0.52, 0]} castShadow>
            <sphereGeometry args={[0.042, 12, 12]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.4} />
          </mesh>
        </group>

        {/* الذراع اليمنى */}
        <group ref={rightArmRef} position={[0.23, 0.44, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.5]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, -0.52, 0]} castShadow>
            <sphereGeometry args={[0.042, 12, 12]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.4} />
          </mesh>
        </group>

        {/* الرقبة والرأس */}
        <group ref={headRef} position={[0, 0.56, 0]}>
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.1]} />
            <meshStandardMaterial color="#fbcfe8" />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.4} />
          </mesh>
          {/* الشعر */}
          <mesh position={[0, 0.25, -0.02]} castShadow>
            <sphereGeometry args={[0.135, 16, 16]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// 2. زائر يتجول ويمشي (دورة مشي كاملة بحركة أذرع وأرجل)
export function WalkingVisitor() {
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 3.5;
    const stride = Math.sin(t) * 0.45;

    // تأرجح الأرجل
    if (leftLegRef.current) leftLegRef.current.rotation.x = stride;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -stride;

    // تأرجح الأذرع عكس اتجاه الأرجل
    if (leftArmRef.current) leftArmRef.current.rotation.x = -stride * 0.8;
    if (rightArmRef.current) rightArmRef.current.rotation.x = stride * 0.8;

    // حركة طفيفة لارتفاع الجسم أثناء المشي
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.95 + Math.abs(Math.sin(t)) * 0.035;
      bodyRef.current.rotation.y = Math.sin(t) * 0.06;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* الساق اليسرى المحورية */}
      <group ref={leftLegRef} position={[-0.12, 0.85, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.05, 0.8]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.82, 0.06]} castShadow>
          <boxGeometry args={[0.11, 0.08, 0.22]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* الساق اليمنى المحورية */}
      <group ref={rightLegRef} position={[0.12, 0.85, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.05, 0.8]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.82, 0.06]} castShadow>
          <boxGeometry args={[0.11, 0.08, 0.22]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* الجزء العلوي */}
      <group ref={bodyRef} position={[0, 0.95, 0]}>
        <mesh position={[0, 0.26, 0]} castShadow>
          <boxGeometry args={[0.38, 0.52, 0.22]} />
          <meshStandardMaterial color="#10b981" roughness={0.5} />
        </mesh>

        {/* الذراع اليسرى */}
        <group ref={leftArmRef} position={[-0.23, 0.44, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.5]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <mesh position={[0, -0.52, 0]} castShadow>
            <sphereGeometry args={[0.042, 12, 12]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
        </group>

        {/* الذراع اليمنى */}
        <group ref={rightArmRef} position={[0.23, 0.44, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.5]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <mesh position={[0, -0.52, 0]} castShadow>
            <sphereGeometry args={[0.042, 12, 12]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
        </group>

        {/* الرأس والنظارة العصرية */}
        <group position={[0, 0.56, 0]}>
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.1]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.26, -0.02]} castShadow>
            <sphereGeometry args={[0.135, 16, 16]} />
            <meshStandardMaterial color="#1e1b4b" roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// 3. مرشد المتحف (إشارة باليد وشرح حي للجمهور)
export function MuseumGuide() {
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // إشارة اليد اليمنى المرفوعة للشرح والتوجيه
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.4 + Math.sin(t * 1.6) * 0.18;
      rightArmRef.current.rotation.x = -0.8 + Math.cos(t * 1.6) * 0.15;
    }
    // التفاتة المرشد للزوار واللوحات
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.2) * 0.3;
      headRef.current.rotation.x = Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* القدمان */}
      <mesh position={[-0.12, 0.04, 0]} castShadow>
        <boxGeometry args={[0.11, 0.08, 0.22]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0.12, 0.04, 0]} castShadow>
        <boxGeometry args={[0.11, 0.08, 0.22]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {/* بنطال رسمي */}
      <mesh position={[-0.12, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.055, 0.82]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.12, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.055, 0.82]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* بليزر رسمي للمرشد مع شارة التعريف */}
      <group position={[0, 0.95, 0]}>
        <mesh position={[0, 0.26, 0]} castShadow>
          <boxGeometry args={[0.38, 0.52, 0.22]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
        </mesh>
        {/* شارة المتحف VIP */}
        <mesh position={[0.11, 0.36, 0.115]}>
          <planeGeometry args={[0.06, 0.08]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} />
        </mesh>

        {/* الذراع اليسرى الثابتة بأناقة */}
        <group position={[-0.23, 0.44, 0]} rotation={[0, 0, 0.1]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.5]} />
            <meshStandardMaterial color="#1e3a8a" />
          </mesh>
          <mesh position={[0, -0.52, 0]} castShadow>
            <sphereGeometry args={[0.042, 12, 12]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
        </group>

        {/* الذراع اليمنى المتحركة بالإشارة */}
        <group ref={rightArmRef} position={[0.23, 0.44, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.5]} />
            <meshStandardMaterial color="#1e3a8a" />
          </mesh>
          <mesh position={[0, -0.52, 0]} castShadow>
            <sphereGeometry args={[0.042, 12, 12]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
        </group>

        {/* الرأس */}
        <group ref={headRef} position={[0, 0.56, 0]}>
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.1]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
          <mesh position={[0, 0.26, -0.02]} castShadow>
            <sphereGeometry args={[0.135, 16, 16]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// 4. حارس أمن المعرض (وقفة حازمة مع تفقد وانتباه)
export function SecurityGuard() {
  const headRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // تفقد وحركة مراقبة بالأعين والرأس يميناً ويساراً
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.9) * 0.45;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* الحذاء العسكري الأسود */}
      <mesh position={[-0.14, 0.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.24]} />
        <meshStandardMaterial color="#09090b" roughness={0.3} />
      </mesh>
      <mesh position={[0.14, 0.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.24]} />
        <meshStandardMaterial color="#09090b" roughness={0.3} />
      </mesh>

      {/* بنطال الأمن */}
      <mesh position={[-0.14, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.82]} />
        <meshStandardMaterial color="#18181b" roughness={0.8} />
      </mesh>
      <mesh position={[0.14, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.82]} />
        <meshStandardMaterial color="#18181b" roughness={0.8} />
      </mesh>

      {/* الجذع وزي الحراسة مع الحزام */}
      <group position={[0, 0.95, 0]}>
        {/* الحزام والأصفاد/الجهاز */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <boxGeometry args={[0.42, 0.08, 0.24]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[0.15, 0.03, 0.13]} castShadow>
          <boxGeometry args={[0.06, 0.1, 0.05]} />
          <meshStandardMaterial color="#27272a" />
        </mesh>

        {/* قميص الأمن الأبيض */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.4, 0.48, 0.23]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>

        {/* كتافيات الأمن */}
        <mesh position={[-0.18, 0.51, 0]} castShadow>
          <boxGeometry args={[0.12, 0.03, 0.16]} />
          <meshStandardMaterial color="#09090b" />
        </mesh>
        <mesh position={[0.18, 0.51, 0]} castShadow>
          <boxGeometry args={[0.12, 0.03, 0.16]} />
          <meshStandardMaterial color="#09090b" />
        </mesh>

        {/* الذراعان متماسكتان خلف الظهر */}
        <group position={[-0.22, 0.42, -0.04]} rotation={[0.4, 0, 0.2]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.48]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
        <group position={[0.22, 0.42, -0.04]} rotation={[0.4, 0, -0.2]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.48]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>

        {/* الرأس والقبعة الرسمية */}
        <group ref={headRef} position={[0, 0.56, 0]}>
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.05, 0.1]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
          {/* قبعة الحارس العسكرية */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.14, 0.08, 16]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <mesh position={[0, 0.27, 0.1]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.18, 0.02, 0.1]} />
            <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

