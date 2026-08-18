import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Fixed, hand-placed layout — not randomized on each load — so the graph
// reads as one drawn object rather than a generative pattern.
const NODES: [number, number, number][] = [
  [-1.6, 0.9, 0.2],
  [-0.7, 1.4, -0.4],
  [0.4, 1.7, 0.3],
  [1.5, 1.0, -0.2],
  [-1.3, -0.3, 0.5],
  [0.0, 0.0, 0.0],
  [1.3, -0.4, 0.4],
  [-0.6, -1.4, -0.3],
  [0.8, -1.6, 0.2],
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [1, 5],
  [2, 5],
  [3, 6],
  [4, 5],
  [5, 6],
  [4, 7],
  [5, 7],
  [5, 8],
  [6, 8],
  [7, 8],
];

const STRUCTURE_COLOR = "#2A4B8D";
const SIGNAL_COLOR = "#D9581F";

function Graph({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const edgeIndex = useRef(0);
  const pause = useRef(0);
  const { pointer } = useThree();

  const nodePositions = useMemo(() => new Float32Array(NODES.flat()), []);

  const edgeGeometry = useMemo(() => {
    const positions = new Float32Array(EDGES.length * 6);
    EDGES.forEach(([a, b], i) => {
      positions.set(NODES[a], i * 6);
      positions.set(NODES[b], i * 6 + 3);
    });
    return positions;
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (group && !reducedMotion) {
      const targetY = pointer.x * 0.35;
      const targetX = -pointer.y * 0.2;
      group.rotation.y += (targetY - group.rotation.y) * Math.min(delta * 2, 1);
      group.rotation.x += (targetX - group.rotation.x) * Math.min(delta * 2, 1);
    }

    const pulse = pulseRef.current;
    if (!pulse || reducedMotion) return;

    if (pause.current > 0) {
      pause.current -= delta;
      return;
    }

    progress.current += delta / 1.1;
    if (progress.current >= 1) {
      progress.current = 0;
      edgeIndex.current = (edgeIndex.current + 1) % EDGES.length;
      pause.current = 0.5;
      pulse.visible = false;
      return;
    }

    pulse.visible = true;
    const [a, b] = EDGES[edgeIndex.current];
    const start = NODES[a];
    const end = NODES[b];
    pulse.position.set(
      THREE.MathUtils.lerp(start[0], end[0], progress.current),
      THREE.MathUtils.lerp(start[1], end[1], progress.current),
      THREE.MathUtils.lerp(start[2], end[2], progress.current),
    );
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgeGeometry, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={STRUCTURE_COLOR} transparent opacity={0.45} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={STRUCTURE_COLOR} size={0.07} sizeAttenuation transparent opacity={0.9} />
      </points>

      <mesh ref={pulseRef} visible={reducedMotion} position={NODES[0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={SIGNAL_COLOR} />
      </mesh>
    </group>
  );
}

interface NodeGraphProps {
  className?: string;
}

/**
 * Decorative only — the hero's headline and CTAs stand on their own
 * without it, so this is safe to mark aria-hidden and to fail silently
 * if WebGL is unavailable.
 */
export function NodeGraph({ className = "" }: NodeGraphProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 5.5], fov: 40 }}
      >
        <Graph reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
