import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 1. مكتب استقبال وتحرير خشبي
export function MuseumDesk() {
  return (
    <group position={[0, 0, 0]}>
      {/* سطح المكتب الرئيسي */}
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial color="#452a1a" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* الجانب الأيمن */}
      <mesh position={[0.7, 0.36, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.72, 0.76]} />
        <meshStandardMaterial color="#352014" roughness={0.4} />
      </mesh>
      {/* الجانب الأيسر */}
      <mesh position={[-0.7, 0.36, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.72, 0.76]} />
        <meshStandardMaterial color="#352014" roughness={0.4} />
      </mesh>
      {/* اللوح الخلفي */}
      <mesh position={[0, 0.36, -0.36]} castShadow receiveShadow>
        <boxGeometry args={[1.36, 0.65, 0.04]} />
        <meshStandardMaterial color="#352014" roughness={0.5} />
      </mesh>

      {/* شاشة الحاسوب */}
      <mesh position={[0.2, 0.98, 0]} castShadow>
        <boxGeometry args={[0.45, 0.28, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* واجهة الشاشة المضيئة */}
      <mesh position={[0.2, 0.98, 0.012]}>
        <planeGeometry args={[0.41, 0.24]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>
      {/* حامل الشاشة */}
      <mesh position={[0.2, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.12]} />
        <meshStandardMaterial color="#333333" metalness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.01]} />
        <meshStandardMaterial color="#333333" metalness={0.9} />
      </mesh>

      {/* لوحة المفاتيح والكتيبات */}
      <mesh position={[0.2, 0.77, 0.2]} castShadow>
        <boxGeometry args={[0.3, 0.01, 0.12]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
      <mesh position={[-0.35, 0.77, 0.1]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.22, 0.02, 0.3]} />
        <meshStandardMaterial color="#d97706" roughness={0.6} />
      </mesh>
    </group>
  );
}

// 2. كرسي معرض حديث
export function GalleryChair() {
  return (
    <group position={[0, 0, 0]}>
      {/* وسادة المقعد */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.08, 0.48]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.7} />
      </mesh>
      {/* ظهر الكرسي */}
      <mesh position={[0, 0.82, -0.21]} rotation={[0.05, 0, 0]} castShadow>
        <boxGeometry args={[0.44, 0.45, 0.06]} />
        <meshStandardMaterial color="#2563eb" roughness={0.7} />
      </mesh>
      {/* الأرجل الخشبية الأربعة */}
      {[
        [-0.19, -0.19],
        [0.19, -0.19],
        [-0.19, 0.19],
        [0.19, 0.19],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.22, z]} rotation={[z * 0.15, 0, -x * 0.15]} castShadow>
          <cylinderGeometry args={[0.02, 0.015, 0.44]} />
          <meshStandardMaterial color="#b45309" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// 3. مقعد زوار جلدي طويل (Bench)
export function MuseumBench() {
  return (
    <group position={[0, 0, 0]}>
      {/* وسادة الجلوس المزدوجة */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.14, 0.6]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>
      {/* إطار المقعد السفلي */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[1.76, 0.04, 0.56]} />
        <meshStandardMaterial color="#92400e" roughness={0.3} />
      </mesh>
      {/* الأرجل المعدنية الحديثة */}
      <mesh position={[-0.75, 0.18, 0]} castShadow>
        <boxGeometry args={[0.06, 0.36, 0.52]} />
        <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.75, 0.18, 0]} castShadow>
        <boxGeometry args={[0.06, 0.36, 0.52]} />
        <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 4. قاعدة عرض مع تمثال فني ذهبي دوار
export function DisplayPedestal() {
  const sculptureRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (sculptureRef.current) {
      sculptureRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* قاعدة العمود الرخامية */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 1.1, 0.55]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.05} />
      </mesh>
      {/* حواف قاعدة العرض العلوية والسفلية */}
      <mesh position={[0, 1.12, 0]} castShadow>
        <boxGeometry args={[0.62, 0.05, 0.62]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.03, 0]} castShadow>
        <boxGeometry args={[0.65, 0.06, 0.65]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
      </mesh>

      {/* تمثال ذهبي دوار في الأعلى */}
      <group ref={sculptureRef} position={[0, 1.45, 0]}>
        <mesh castShadow>
          <torusKnotGeometry args={[0.18, 0.05, 64, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.9}
            roughness={0.15}
            emissive="#d97706"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}

// 5. طاولة عرض زجاجية مضيئة (Showcase)
export function GlassShowcase() {
  const gemRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (gemRef.current) {
      gemRef.current.rotation.y += delta * 0.7;
      gemRef.current.rotation.x += delta * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* القاعدة السفلية */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.8, 0.7]} />
        <meshStandardMaterial color="#18181b" roughness={0.4} />
      </mesh>

      {/* الغطاء الزجاجي الشفاف */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.68, 0.7, 0.68]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
          ior={1.5}
          color="#e0f2fe"
        />
      </mesh>

      {/* إطار الزجاج المعدني العلوي */}
      <mesh position={[0, 1.51, 0]}>
        <boxGeometry args={[0.7, 0.02, 0.7]} />
        <meshStandardMaterial color="#27272a" metalness={0.8} />
      </mesh>

      {/* حامل القطعة المعروضة وإضاءة موجهة */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.1, 24]} />
        <meshStandardMaterial color="#27272a" roughness={0.3} metalness={0.5} />
      </mesh>
      <pointLight position={[0, 1.25, 0]} color="#38bdf8" intensity={1.5} distance={1.2} />

      {/* الجوهرة المعروضة بالداخل */}
      <mesh ref={gemRef} position={[0, 1.05, 0]} castShadow>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// 6. نبتة زينة داخلية مع أصيص سيراميك
export function IndoorPlant() {
  return (
    <group position={[0, 0, 0]}>
      {/* حوض السيراميك الأبيض */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.18, 0.56, 24]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.05} />
      </mesh>
      {/* التربة */}
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.03, 24]} />
        <meshStandardMaterial color="#382216" roughness={0.9} />
      </mesh>

      {/* الساق والأوراق الاستوائية */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 0.6]} />
        <meshStandardMaterial color="#15803d" roughness={0.6} />
      </mesh>

      {/* طبقات أوراق الشجر بزوايا طبيعية */}
      {[
        [0, 0.7, 0.18, 0.6, 0, 0],
        [0.18, 0.85, 0, 0, 0, -0.6],
        [0, 1.0, -0.2, -0.6, 0, 0],
        [-0.18, 0.92, 0, 0, 0, 0.6],
        [0.12, 1.12, 0.12, 0.4, 0.4, -0.4],
        [-0.12, 1.18, -0.12, -0.4, 0.4, 0.4],
      ].map(([x, y, z, rx, ry, rz], i) => (
        <group key={i} position={[x, y, z]} rotation={[rx, ry, rz]}>
          <mesh castShadow>
            <coneGeometry args={[0.18, 0.45, 5]} />
            <meshStandardMaterial color="#16a34a" roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 7. أعمدة حواجز أمان مع حبل مخملي أحمر
export function BarrierStanchion() {
  return (
    <group position={[0, 0, 0]}>
      {/* العمود الأيمن */}
      <mesh position={[0.7, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.06, 24]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.95, 16]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, 0.98, 0]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* العمود الأيسر */}
      <mesh position={[-0.7, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.06, 24]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.7, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.95, 16]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.7, 0.98, 0]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* الحبل المخملي الأحمر المنحني بين العمودين */}
      <mesh position={[0, 0.78, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.4, 16]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.8} />
      </mesh>
    </group>
  );
}

