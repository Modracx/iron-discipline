"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MUSCLE_REGISTRY, type MuscleId } from "@/data/calisthenics-data";

interface Props {
  selectedMuscle: MuscleId | null;
  onSelectMuscle: (muscleId: MuscleId | null) => void;
  className?: string;
}

interface MuscleItem {
  muscleId: MuscleId;
  mesh: THREE.Mesh;
  mat: THREE.MeshStandardMaterial;
  origColor: THREE.Color;
}

// Map medical anatomy node names to our 15 canonical muscle groups
function mapAnatomicalNodeToMuscle(name: string): MuscleId | null {
  const n = name.toLowerCase();
  if (n.includes("pectoralis") || n.includes("subclavius")) return "chest";
  if (n.includes("latissimus")) return "lats";
  if (n.includes("trapezius") || n.includes("rhomboid") || n.includes("levator scapulae")) return "traps";
  if (
    n.includes("deltoid") ||
    n.includes("supraspinatus") ||
    n.includes("infraspinatus") ||
    n.includes("subscapularis") ||
    n.includes("teres")
  ) {
    return "deltoids";
  }
  if (n.includes("biceps brachii") || n.includes("brachialis") || n.includes("coracobrachialis")) {
    return "biceps";
  }
  if (n.includes("triceps brachii") || n.includes("anconeus")) return "triceps";
  if (
    n.includes("brachioradialis") ||
    n.includes("pronator") ||
    n.includes("carpi") ||
    n.includes("digitorum") ||
    n.includes("palmaris") ||
    n.includes("supinator") ||
    n.includes("abductor pollicis")
  ) {
    return "forearms";
  }
  if (n.includes("rectus abdominis") || n.includes("transversus abdominis") || n.includes("pyramidalis")) {
    return "abs";
  }
  if (n.includes("obliquus") || n.includes("serratus anterior") || n.includes("external abdominal")) {
    return "obliques";
  }
  if (
    n.includes("quadriceps") ||
    n.includes("rectus femoris") ||
    n.includes("vastus") ||
    n.includes("sartorius") ||
    n.includes("tensor fasciae latae") ||
    n.includes("pectineus") ||
    n.includes("gracilis") ||
    n.includes("adductor")
  ) {
    return "quads";
  }
  if (n.includes("biceps femoris") || n.includes("semitendinosus") || n.includes("semimembranosus")) {
    return "hamstrings";
  }
  if (
    n.includes("gastrocnemius") ||
    n.includes("soleus") ||
    n.includes("tibialis") ||
    n.includes("fibularis") ||
    n.includes("peroneus") ||
    n.includes("plantaris")
  ) {
    return "calves";
  }
  if (
    n.includes("gluteus") ||
    n.includes("piriformis") ||
    n.includes("obturator") ||
    n.includes("gemellus") ||
    n.includes("quadratus femoris")
  ) {
    return "glutes";
  }
  if (
    n.includes("erector spinae") ||
    n.includes("multifidus") ||
    n.includes("longissimus") ||
    n.includes("iliocostalis") ||
    n.includes("splenius") ||
    n.includes("quadratus lumborum") ||
    n.includes("spinalis")
  ) {
    return "lower_back";
  }
  if (
    n.includes("sternocleidomastoid") ||
    n.includes("scalenus") ||
    n.includes("platysma") ||
    n.includes("omohyoid") ||
    n.includes("sternohyoid")
  ) {
    return "neck";
  }
  return null;
}

export default function InteractiveBody3D({
  selectedMuscle,
  onSelectMuscle,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleId | null>(null);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [cameraDistance, setCameraDistance] = useState<number>(2.5);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bodyGroupRef = useRef<THREE.Group | null>(null);
  const muscleItemsRef = useRef<MuscleItem[]>([]);
  const targetRotationYRef = useRef<number>(0);

  // Tactical Palette
  const COLOR_IDLE = new THREE.Color(0x19211a); // Dark tactical carbon olive
  const COLOR_BASE = new THREE.Color(0x111612); // Graphite connective tissue / hands / feet
  const COLOR_HOVER = new THREE.Color(0x22c55e); // Bright Tactical Green
  const COLOR_SELECTED = new THREE.Color(0xf97316); // Amber Ember Orange

  // Mouse drag interaction
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  // Update materials when hover or selection changes
  const updateMaterials = useCallback(
    (hover: MuscleId | null, sel: MuscleId | null) => {
      const items = muscleItemsRef.current;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (sel && item.muscleId === sel) {
          item.mat.color.copy(COLOR_SELECTED);
          item.mat.emissive.setHex(0x7c2d12);
          item.mat.emissiveIntensity = 0.55;
        } else if (hover && item.muscleId === hover) {
          item.mat.color.copy(COLOR_HOVER);
          item.mat.emissive.setHex(0x14532d);
          item.mat.emissiveIntensity = 0.45;
        } else {
          item.mat.color.copy(COLOR_IDLE);
          item.mat.emissive.setHex(0x000000);
          item.mat.emissiveIntensity = 0;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    updateMaterials(hoveredMuscle, selectedMuscle);
  }, [hoveredMuscle, selectedMuscle, updateMaterials]);

  // Rotate towards front or back depending on whether muscle is posterior
  useEffect(() => {
    if (!selectedMuscle) return;
    const info = MUSCLE_REGISTRY[selectedMuscle];
    if (info && info.isPosterior) {
      targetRotationYRef.current = Math.PI;
    } else {
      targetRotationYRef.current = 0;
    }
  }, [selectedMuscle]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // Camera framed so 1.85m human is visible from head to toe
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.05, cameraDistance);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. High-Contrast Tactical Lighting for Muscular Sculpting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 3, 3);
    scene.add(keyLight);

    const rimLightBack = new THREE.DirectionalLight(0x84cc16, 1.4);
    rimLightBack.position.set(-3, 2, -3.5);
    scene.add(rimLightBack);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    fillLight.position.set(-3, -1, 2);
    scene.add(fillLight);

    // Floor Tactical Grid
    const polarGrid = new THREE.PolarGridHelper(1.5, 16, 8, 32, 0xf97316, 0x222e23);
    polarGrid.position.y = -1.02;
    scene.add(polarGrid);

    // Body container group
    const bodyGroup = new THREE.Group();
    bodyGroupRef.current = bodyGroup;
    scene.add(bodyGroup);

    // 3. Load 3D Muscular Anatomy Model via DRACOLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const items: MuscleItem[] = [];
    muscleItemsRef.current = items;

    gltfLoader.load(
      "/models/muscular_male.glb",
      (gltf) => {
        const root = gltf.scene;

        // Traverse and categorize all anatomical meshes
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const nodeName = mesh.name || mesh.parent?.name || "";
            const muscleId = mapAnatomicalNodeToMuscle(nodeName);

            if (muscleId) {
              const mat = new THREE.MeshStandardMaterial({
                color: COLOR_IDLE.clone(),
                roughness: 0.38,
                metalness: 0.15,
                flatShading: false,
              });
              mesh.material = mat;
              mesh.userData = { muscleId };
              items.push({
                muscleId,
                mesh,
                mat,
                origColor: COLOR_IDLE.clone(),
              });
            } else {
              // Base anatomical connective structure (hands, feet, head cranium, fascia)
              mesh.material = new THREE.MeshStandardMaterial({
                color: COLOR_BASE.clone(),
                roughness: 0.65,
                metalness: 0.1,
              });
            }
          }
        });

        // Compute Bounding Box and Center Model precisely
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Reposition center of model to (0, 0, 0)
        root.position.x = -center.x;
        root.position.y = -center.y;
        root.position.z = -center.z;

        // Scale to 1.88m height in 3D units
        const targetHeight = 1.88;
        const scale = targetHeight / (size.y || 1);
        root.scale.set(scale, scale, scale);

        bodyGroup.add(root);
        setIsLoaded(true);
        setLoadProgress(100);

        // Apply initial selection
        if (selectedMuscle) {
          updateMaterials(null, selectedMuscle);
        }
      },
      (xhr) => {
        if (xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(pct);
        }
      },
      (error) => {
        console.warn("GLB load failed, building procedural anatomical fallback", error);
        // Fallback anatomical mannequin
        buildProceduralAnatomy(bodyGroup, items);
        setIsLoaded(true);
      }
    );

    // 4. Raycasting for hover & click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Handle dragging rotation
      if (isDraggingRef.current && bodyGroupRef.current) {
        const deltaX = e.clientX - prevMousePosRef.current.x;
        bodyGroupRef.current.rotation.y += deltaX * 0.008;
        targetRotationYRef.current = bodyGroupRef.current.rotation.y;
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      // Raycast muscle meshes
      if (cameraRef.current && items.length > 0) {
        raycaster.setFromCamera(mouse, cameraRef.current);
        const meshes = items.map((it) => it.mesh);
        const intersects = raycaster.intersectObjects(meshes, false);

        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as THREE.Mesh;
          const mId = hitMesh.userData?.muscleId as MuscleId | undefined;
          if (mId) {
            setHoveredMuscle(mId);
            container.style.cursor = "pointer";
            return;
          }
        }
        setHoveredMuscle(null);
        container.style.cursor = "grab";
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDraggingRef.current = true;
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };
        container.style.cursor = "grabbing";
      }
    };

    const handlePointerUp = (e: MouseEvent) => {
      const wasDrag =
        Math.abs(e.clientX - prevMousePosRef.current.x) > 4 ||
        Math.abs(e.clientY - prevMousePosRef.current.y) > 4;

      isDraggingRef.current = false;
      container.style.cursor = "grab";

      // If clicked without dragging, select the hovered muscle
      if (!wasDrag && hoveredMuscle) {
        onSelectMuscle(selectedMuscle === hoveredMuscle ? null : hoveredMuscle);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newDist = Math.max(1.4, Math.min(4.2, cameraRef.current.position.z + e.deltaY * 0.0025));
      cameraRef.current.position.z = newDist;
      setCameraDistance(newDist);
    };

    const domElem = renderer.domElement;
    domElem.addEventListener("mousemove", handlePointerMove);
    domElem.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mouseup", handlePointerUp);
    domElem.addEventListener("wheel", handleWheel, { passive: false });

    // 5. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (bodyGroupRef.current) {
        if (autoRotate && !isDraggingRef.current) {
          bodyGroupRef.current.rotation.y += 0.006;
          targetRotationYRef.current = bodyGroupRef.current.rotation.y;
        } else if (!isDraggingRef.current) {
          // Smoothly interpolate towards target rotation angle
          const currentY = bodyGroupRef.current.rotation.y;
          const targetY = targetRotationYRef.current;
          bodyGroupRef.current.rotation.y += (targetY - currentY) * 0.08;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // 6. Responsive Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      domElem.removeEventListener("mousemove", handlePointerMove);
      domElem.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mouseup", handlePointerUp);
      domElem.removeEventListener("wheel", handleWheel);
      dracoLoader.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Zoom controls
  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const newDist = Math.max(1.4, Math.min(4.2, cameraRef.current.position.z + delta));
    cameraRef.current.position.z = newDist;
    setCameraDistance(newDist);
  };

  const setAngle = (rad: number) => {
    targetRotationYRef.current = rad;
  };

  const resetView = () => {
    targetRotationYRef.current = 0;
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.05, 2.5);
      setCameraDistance(2.5);
    }
    setAutoRotate(false);
  };

  const currentMuscleInfo = (selectedMuscle || hoveredMuscle)
    ? MUSCLE_REGISTRY[(selectedMuscle || hoveredMuscle)!]
    : null;

  return (
    <div className={`relative border-2 border-line bg-night ${className}`}>
      {/* ── TOP HEADER / HUD BAR ───────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-line bg-pit px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-ember animate-pulse" />
          <div>
            <span className="font-cond text-xs font-bold tracking-[0.25em] text-drab">
              3D ANATOMICAL SCANNER // HOVER TO HIGHLIGHT MUSCLES
            </span>
            <div className="font-cond text-[11px] text-[#86957c]">
              MEDICAL-GRADE BIOMECHANICAL SYSTEM · 1,388 ANATOMICAL VOLUMES
            </div>
          </div>
        </div>

        {/* View Angle Presets & Auto Rotate */}
        <div className="flex flex-wrap items-center gap-1.5 font-cond text-xs font-bold">
          <button
            type="button"
            onClick={() => setAngle(0)}
            className="cursor-pointer border border-line bg-night px-2.5 py-1 text-drab hover:border-ember hover:text-bone transition-colors"
          >
            FRONT
          </button>
          <button
            type="button"
            onClick={() => setAngle(Math.PI)}
            className="cursor-pointer border border-line bg-night px-2.5 py-1 text-drab hover:border-ember hover:text-bone transition-colors"
          >
            BACK
          </button>
          <button
            type="button"
            onClick={() => setAngle(Math.PI * 0.25)}
            className="cursor-pointer border border-line bg-night px-2.5 py-1 text-drab hover:border-ember hover:text-bone transition-colors"
          >
            45° ANGLE
          </button>
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`cursor-pointer border px-2.5 py-1 transition-colors ${
              autoRotate
                ? "border-ember bg-ember/20 text-ember"
                : "border-line bg-night text-drab hover:border-ember hover:text-bone"
            }`}
          >
            {autoRotate ? "ROTATION: ON" : "ROTATE"}
          </button>
          <button
            type="button"
            onClick={resetView}
            className="cursor-pointer border border-line bg-night px-2.5 py-1 text-drab hover:border-ember hover:text-bone transition-colors"
            title="Reset to default framing"
          >
            ↺ RESET
          </button>
        </div>
      </div>

      {/* ── 3D VIEWPORT CONTAINER ─────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative w-full h-[520px] sm:h-[580px] overflow-hidden bg-gradient-to-b from-[#0e140f] via-night to-[#0a0e0b]"
      >
        {/* Loading HUD Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-night/95 backdrop-blur-sm p-6 text-center">
            <div className="font-stencil text-2xl tracking-widest text-ember animate-pulse mb-3">
              INITIALIZING ANATOMICAL BIOMETRIC SCAN
            </div>
            <div className="font-cond text-sm text-drab mb-4 tracking-wider">
              LOADING 3D MUSCULOSKELETAL ASSETS · {loadProgress}% COMPLETE
            </div>
            <div className="w-64 h-2 border border-line bg-pit overflow-hidden">
              <div
                className="h-full bg-ember transition-all duration-300"
                style={{ width: `${Math.max(5, loadProgress)}%` }}
              />
            </div>
            <div className="font-cond text-xs text-drab/60 mt-3">
              PARSING HIGH-RESOLUTION ANATOMICAL TISSUE MESHES...
            </div>
          </div>
        )}

        {/* Viewport Crosshair Accents */}
        <div className="pointer-events-none absolute top-3 left-3 font-cond text-[10px] tracking-widest text-drab/50">
          ┌ TAC-3D-ANATOMY // RECON
        </div>
        <div className="pointer-events-none absolute top-3 right-3 font-cond text-[10px] tracking-widest text-drab/50">
          GRID: 38° FOV ┐
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 font-cond text-[10px] tracking-widest text-drab/50">
          └ INTERACTION: DRAG TO ROTATE · SCROLL TO ZOOM
        </div>

        {/* Floating Zoom Buttons */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 font-cond text-xs font-bold">
          <button
            type="button"
            onClick={() => handleZoom(-0.35)}
            className="cursor-pointer border-2 border-line bg-night/90 p-2 text-bone hover:border-ember hover:bg-ember hover:text-night transition-colors"
            title="Zoom In"
          >
            [+]
          </button>
          <button
            type="button"
            onClick={() => handleZoom(0.35)}
            className="cursor-pointer border-2 border-line bg-night/90 p-2 text-bone hover:border-ember hover:bg-ember hover:text-night transition-colors"
            title="Zoom Out"
          >
            [−]
          </button>
        </div>

        {/* Live Hover/Selected Telemetry Tag */}
        {currentMuscleInfo && (
          <div className="absolute top-4 left-4 z-10 max-w-sm border-2 border-ember bg-night/95 p-3.5 shadow-xl backdrop-blur-sm pointer-events-none">
            <div className="flex items-center justify-between gap-2 border-b border-line pb-1.5 mb-2">
              <span className="font-stencil text-base text-ember tracking-wide">
                {currentMuscleInfo.name}
              </span>
              <span className="font-cond text-[10px] font-bold text-drab tracking-widest uppercase bg-pit px-1.5 py-0.5 border border-line">
                {currentMuscleInfo.isPosterior ? "POSTERIOR" : "ANTERIOR"}
              </span>
            </div>
            <div className="font-cond text-xs italic text-drab mb-1">
              {currentMuscleInfo.latinName}
            </div>
            <div className="font-cond text-xs text-bone leading-relaxed">
              {currentMuscleInfo.description}
            </div>
            <div className="mt-2 font-cond text-[11px] font-bold text-ember border-t border-line/60 pt-1.5">
              CALISTHENICS FUNCTION:
              <span className="font-normal text-[#c7ccb8] ml-1">
                {currentMuscleInfo.calisthenicsFunction}
              </span>
            </div>
            <div className="mt-2 font-cond text-[10px] text-drab tracking-widest">
              {selectedMuscle === currentMuscleInfo.id
                ? "● LOCKED ON TARGET · SHOWING DRILLS BELOW"
                : "▲ CLICK TO LOCK MUSCLE · HOVER TO INSPECT"}
            </div>
          </div>
        )}
      </div>

      {/* ── MUSCLE SELECTOR ROW ────────────────────────────────────── */}
      <div className="border-t-2 border-line bg-pit p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="font-cond text-xs font-bold tracking-[0.2em] text-drab">
            TARGET ANATOMICAL MUSCLE GROUPS:
          </span>
          {selectedMuscle && (
            <button
              type="button"
              onClick={() => onSelectMuscle(null)}
              className="cursor-pointer font-cond text-xs font-bold text-ember hover:underline"
            >
              CLEAR TARGET SELECTION [✕]
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.values(MUSCLE_REGISTRY).map((m) => {
            const isSel = selectedMuscle === m.id;
            const isHov = hoveredMuscle === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectMuscle(isSel ? null : m.id)}
                onMouseEnter={() => setHoveredMuscle(m.id)}
                onMouseLeave={() => setHoveredMuscle(null)}
                className={`cursor-pointer border px-2.5 py-1 font-cond text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isSel
                    ? "border-ember bg-ember text-night font-bold shadow-md"
                    : isHov
                    ? "border-green-500 bg-green-500/20 text-green-400"
                    : "border-line bg-night text-drab hover:border-ember hover:text-bone"
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Fallback procedural mannequin if GLB fails to load
function buildProceduralAnatomy(group: THREE.Group, items: MuscleItem[]) {
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x141a15, roughness: 0.5 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), baseMat);
  head.position.y = 0.78;
  group.add(head);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.65, 16), baseMat);
  torso.position.y = 0.35;
  group.add(torso);
}
