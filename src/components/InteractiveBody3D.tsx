"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from "three-mesh-bvh";

// BVH-accelerated raycasting: 2.3M triangles would otherwise freeze on hover
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;
import { MUSCLE_REGISTRY, type MuscleId } from "@/data/calisthenics-data";

interface Props {
  selectedMuscle: MuscleId | null;
  onSelectMuscle: (muscleId: MuscleId | null) => void;
  className?: string;
}

/**
 * The GLB is the Z-Anatomy muscular system: ~1,400 named meshes.
 *   "<name>.l" / "<name>.r"        → muscle bodies (what we render)
 *   "<name>.ol/.or/.o1l …"         → origin marker patches   (hidden)
 *   "<name>.el/.er/.e1l …"         → insertion marker patches (hidden)
 * Fasciae, bursae and sheaths wrap the muscles like a skin and must be
 * hidden or the model reads as a smooth mannequin.
 */
const MARKER_SUFFIX = /\.[oe]\d*[lr]$/i;
const HIDDEN_PART =
  /fascia|bursa|sheath|retinacul|septum|tarsus|trochlea|pharyng|arytenoid|epiglott|cricothyroid|thyro-|palato|constrictor|genioglossus|hyoglossus|diaphragm|intercostal|levator ani|coccygeus|sphincter|pubo-analis|transversus thoracis|levator palpebrae|superior oblique muscle|inferior oblique muscle|superior rectus|inferior rectus|lateral rectus|medial rectus|pterygoid|common tendinous ring|iliopectineal|inguinal/i;
const TENDON_PART = /tendon|aponeurosis|tract|linea alba|ligament/i;

// Map Z-Anatomy names to our 15 canonical muscle groups
function mapAnatomicalNodeToMuscle(name: string): MuscleId | null {
  const n = name.toLowerCase();
  if (n.includes("pectoralis") || n.includes("subclavius")) return "chest";
  if (n.includes("latissimus") || n.includes("teres major")) return "lats";
  if (n.includes("trapezius") || n.includes("rhomboid") || n.includes("levator scapulae")) return "traps";
  if (
    n.includes("deltoid") ||
    n.includes("supraspinatus") ||
    n.includes("infraspinatus") ||
    n.includes("subscapularis") ||
    n.includes("teres minor")
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
    n.includes("digitorum superficialis") ||
    n.includes("digitorum profundus") ||
    n.includes("extensor digitorum") ||
    n.includes("extensor digiti") ||
    n.includes("extensor indicis") ||
    n.includes("pollicis") ||
    n.includes("palmaris") ||
    n.includes("supinator") ||
    n.includes("of hand") ||
    n.includes("palmar interossei")
  ) {
    return "forearms";
  }
  if (n.includes("rectus abdominis") || n.includes("transversus abdominis") || n.includes("pyramidalis")) {
    return "abs";
  }
  if (n.includes("abdominal oblique") || n.includes("serratus anterior")) return "obliques";
  if (
    n.includes("quadriceps") ||
    n.includes("rectus femoris") ||
    n.includes("vastus") ||
    n.includes("sartorius") ||
    n.includes("tensor fasciae latae") ||
    n.includes("pectineus") ||
    n.includes("gracilis") ||
    n.includes("adductor longus") ||
    n.includes("adductor brevis") ||
    n.includes("adductor magnus") ||
    n.includes("adductor minimus") ||
    n.includes("iliacus") ||
    n.includes("psoas") ||
    n.includes("articularis genus")
  ) {
    return "quads";
  }
  if (
    n.includes("biceps femoris") ||
    n.includes("semitendinosus") ||
    n.includes("semimembranosus") ||
    n.includes("popliteus")
  ) {
    return "hamstrings";
  }
  if (
    n.includes("gastrocnemius") ||
    n.includes("soleus") ||
    n.includes("triceps surae") ||
    n.includes("tibialis") ||
    n.includes("fibularis") ||
    n.includes("peroneus") ||
    n.includes("plantaris") ||
    n.includes("hallucis") ||
    n.includes("of foot") ||
    n.includes("digitorum longus") ||
    n.includes("digitorum brevis") ||
    n.includes("quadratus plantae") ||
    n.includes("plantar interossei")
  ) {
    return "calves";
  }
  if (
    n.includes("gluteus") ||
    n.includes("piriformis") ||
    n.includes("obturator") ||
    n.includes("gemellus") ||
    n.includes("quadratus femoris") ||
    n.includes("trochanteric")
  ) {
    return "glutes";
  }
  if (
    n.includes("erector spinae") ||
    n.includes("multifidus") ||
    n.includes("longissimus") ||
    n.includes("iliocostalis") ||
    n.includes("spinalis") ||
    n.includes("semispinalis") ||
    n.includes("quadratus lumborum") ||
    n.includes("interspinales") ||
    n.includes("intertransversarii") ||
    n.includes("rotatores") ||
    n.includes("levatores") ||
    n.includes("serratus posterior")
  ) {
    return "lower_back";
  }
  if (
    n.includes("sternocleidomastoid") ||
    n.includes("scalenus") ||
    n.includes("platysma") ||
    n.includes("hyoid") ||
    n.includes("splenius") ||
    n.includes("longus co") ||
    n.includes("longus capitis") ||
    n.includes("capitis") ||
    n.includes("digastric")
  ) {
    return "neck";
  }
  return null;
}

type GroupMats = Record<string, THREE.MeshPhysicalMaterial>;

// Tactical palette
const MUSCLE_COLOR = new THREE.Color(0x7a2a24); // desaturated muscle red
const MUSCLE_DIM = new THREE.Color(0x2a1a17); // muted when another target is locked
const TENDON_COLOR = new THREE.Color(0x9a9078); // bone-white connective tissue
const HOVER_EMISSIVE = new THREE.Color(0x22c55e); // tactical green
const SELECT_EMISSIVE = new THREE.Color(0xf97316); // ember orange

function makeMuscleMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: MUSCLE_COLOR.clone(),
    roughness: 0.5,
    metalness: 0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
    sheen: 0.35,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color(0xff7a5c),
    envMapIntensity: 0.9,
  });
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
  const [meshCount, setMeshCount] = useState<number>(0);
  const [frameMs, setFrameMs] = useState<number>(0);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const bodyGroupRef = useRef<THREE.Group | null>(null);
  const groupMatsRef = useRef<GroupMats>({});
  const targetRotationYRef = useRef<number>(0);
  const targetDistanceRef = useRef<number>(2.5);
  const autoRotateRef = useRef<boolean>(false);
  const hoveredRef = useRef<MuscleId | null>(null);
  const selectedRef = useRef<MuscleId | null>(null);
  const onSelectRef = useRef(onSelectMuscle);
  onSelectRef.current = onSelectMuscle;
  autoRotateRef.current = autoRotate;
  selectedRef.current = selectedMuscle;

  // Highlight state is applied to the 15 shared group materials, not to meshes
  const applyHighlight = (hover: MuscleId | null, sel: MuscleId | null) => {
    const mats = groupMatsRef.current;
    for (const id in mats) {
      const m = mats[id];
      if (sel && id === sel) {
        m.color.copy(MUSCLE_COLOR).lerp(SELECT_EMISSIVE, 0.35);
        m.emissive.copy(SELECT_EMISSIVE);
        m.emissiveIntensity = 0.5;
        m.clearcoat = 0.8;
      } else if (hover && id === hover) {
        m.color.copy(MUSCLE_COLOR).lerp(HOVER_EMISSIVE, 0.25);
        m.emissive.copy(HOVER_EMISSIVE);
        m.emissiveIntensity = 0.35;
        m.clearcoat = 0.7;
      } else if (sel) {
        m.color.copy(MUSCLE_DIM);
        m.emissive.setHex(0x000000);
        m.emissiveIntensity = 0;
        m.clearcoat = 0.2;
      } else {
        m.color.copy(MUSCLE_COLOR);
        m.emissive.setHex(0x000000);
        m.emissiveIntensity = 0;
        m.clearcoat = 0.3;
      }
    }
  };

  useEffect(() => {
    hoveredRef.current = hoveredMuscle;
    applyHighlight(hoveredMuscle, selectedMuscle);
  }, [hoveredMuscle, selectedMuscle]);

  // Turn to face the camera at the side the muscle lives on
  useEffect(() => {
    if (!selectedMuscle) return;
    const info = MUSCLE_REGISTRY[selectedMuscle];
    targetRotationYRef.current = info?.isPosterior ? Math.PI : 0;
  }, [selectedMuscle]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Renderer, scene, camera
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.05, targetDistanceRef.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Image-based lighting — gives the muscle striations their contrast
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    pmrem.dispose();

    const keyLight = new THREE.DirectionalLight(0xfff1e0, 2.4);
    keyLight.position.set(2.5, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.camera.left = keyLight.shadow.camera.bottom = -1.4;
    keyLight.shadow.camera.right = keyLight.shadow.camera.top = 1.4;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf97316, 1.1);
    rimLight.position.set(-3, 1.5, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x7aa0c8, 0.35);
    fillLight.position.set(-3, -0.5, 2.5);
    scene.add(fillLight);

    scene.add(new THREE.HemisphereLight(0x99a184, 0x0a0e0b, 0.25));

    // 3. Ground: contact shadow + tactical polar grid
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(1.6, 48),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.6 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const polarGrid = new THREE.PolarGridHelper(1.5, 16, 8, 32, 0xf97316, 0x222e23);
    scene.add(polarGrid);

    const bodyGroup = new THREE.Group();
    bodyGroupRef.current = bodyGroup;
    scene.add(bodyGroup);

    // 4. Post: MSAA render target + soft bloom so the locked muscle glows
    const target = new THREE.WebGLRenderTarget(width, height, {
      type: THREE.HalfFloatType,
      samples: 2,
    });
    const composer = new EffectComposer(renderer, target);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.45, 0.4, 0.9);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // 5. Materials — one shared material per muscle group
    const groupMats: GroupMats = {};
    for (const id of Object.keys(MUSCLE_REGISTRY)) groupMats[id] = makeMuscleMaterial();
    groupMats.__other = makeMuscleMaterial();
    groupMatsRef.current = groupMats;
    const tendonMat = new THREE.MeshPhysicalMaterial({
      color: TENDON_COLOR,
      roughness: 0.7,
      metalness: 0,
      clearcoat: 0,
      envMapIntensity: 0.35,
    });

    // 6. Load the anatomical model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const pickable: THREE.Mesh[] = [];
    let groundY = -0.94;

    gltfLoader.load(
      "/models/muscular_lean.glb",
      (gltf) => {
        const root = gltf.scene;
        root.updateMatrixWorld(true);
        // GLTFLoader strips "." from node names, which would hide the
        // ".l/.r/.ol/.el" suffixes — read the raw names from the parser.
        const nodeDefs = (gltf.parser.json as { nodes?: { name?: string }[] }).nodes ?? [];
        const rawName = (obj: THREE.Object3D): string => {
          const assoc = gltf.parser.associations.get(obj) as { nodes?: number } | undefined;
          const raw = assoc?.nodes !== undefined ? nodeDefs[assoc.nodes]?.name : undefined;
          return raw ?? obj.name ?? "";
        };

        // Bucket every muscle body by group, then merge each bucket into one
        // mesh: 411 draw calls → ~17, and one BVH per group for picking.
        const buckets: Record<string, THREE.BufferGeometry[]> = {};
        let visible = 0;
        root.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const mesh = child as THREE.Mesh;
          const name = rawName(mesh) || rawName(mesh.parent ?? mesh) || "";
          if (MARKER_SUFFIX.test(name) || HIDDEN_PART.test(name)) return;
          visible++;
          const key = TENDON_PART.test(name)
            ? "__tendon"
            : mapAnatomicalNodeToMuscle(name) ?? "__other";
          const g = mesh.geometry.clone();
          g.applyMatrix4(mesh.matrixWorld);
          for (const attr of Object.keys(g.attributes)) {
            if (attr !== "position" && attr !== "normal") g.deleteAttribute(attr);
          }
          (buckets[key] ??= []).push(g);
        });
        // The loaded scene graph is no longer needed once geometry is merged
        root.traverse((child) => {
          const m = child as THREE.Mesh;
          if (m.isMesh) m.geometry.dispose();
        });

        const merged = new THREE.Group();
        for (const [key, geoms] of Object.entries(buckets)) {
          const geom = mergeGeometries(geoms, false);
          geoms.forEach((g) => g.dispose());
          if (!geom) continue;
          geom.computeBoundsTree();
          const mesh = new THREE.Mesh(geom, key === "__tendon" ? tendonMat : groupMats[key]);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (key in MUSCLE_REGISTRY) {
            mesh.userData = { muscleId: key };
            pickable.push(mesh);
          }
          merged.add(mesh);
        }

        // Center the model and scale to 1.88 m
        const box = new THREE.Box3().setFromObject(merged);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const scale = 1.88 / (size.y || 1);
        merged.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        merged.scale.setScalar(scale);
        groundY = (-size.y * scale) / 2;
        ground.position.y = groundY;
        polarGrid.position.y = groundY - 0.005;

        bodyGroup.add(merged);
        setMeshCount(visible);
        setIsLoaded(true);
        setLoadProgress(100);
        applyHighlight(hoveredRef.current, selectedRef.current);
      },
      (xhr) => {
        if (xhr.total > 0) setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
      },
      (error) => {
        console.warn("GLB load failed, building procedural fallback", error);
        buildProceduralAnatomy(bodyGroup, groupMats.__other);
        setIsLoaded(true);
      }
    );

    // 7. Pointer interaction — rotate on drag, raycast on hover, select on click
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragging = false;
    let downX = 0;
    let downY = 0;
    let lastX = 0;

    raycaster.firstHitOnly = true;
    let pendingHover: { x: number; y: number } | null = null;

    const pick = (clientX: number, clientY: number): MuscleId | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickable, false)[0];
      return (hit?.object.userData?.muscleId as MuscleId | undefined) ?? null;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragging) {
        bodyGroup.rotation.y += (e.clientX - lastX) * 0.008;
        targetRotationYRef.current = bodyGroup.rotation.y;
        lastX = e.clientX;
        return;
      }
      if (e.pointerType !== "mouse" || pickable.length === 0) return;
      pendingHover = { x: e.clientX, y: e.clientY };
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      downX = lastX = e.clientX;
      downY = e.clientY;
      container.style.cursor = "grabbing";
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      container.style.cursor = "grab";
      const moved = Math.abs(e.clientX - downX) > 4 || Math.abs(e.clientY - downY) > 4;
      if (moved) return;
      const id = pick(e.clientX, e.clientY);
      if (id) onSelectRef.current(selectedRef.current === id ? null : id);
    };

    const onPointerLeave = () => {
      if (hoveredRef.current) setHoveredMuscle(null);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetDistanceRef.current = THREE.MathUtils.clamp(
        targetDistanceRef.current + e.deltaY * 0.0025,
        1.2,
        4.2
      );
    };

    const dom = renderer.domElement;
    dom.style.touchAction = "pan-y";
    dom.addEventListener("pointermove", onPointerMove);
    dom.addEventListener("pointerdown", onPointerDown);
    dom.addEventListener("pointerup", onPointerUp);
    dom.addEventListener("pointercancel", onPointerUp);
    dom.addEventListener("pointerleave", onPointerLeave);
    dom.addEventListener("wheel", onWheel, { passive: false });

    // 8. Render loop
    let animId = 0;
    let frames = 0;
    let frameClock = performance.now();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      frames++;
      const now = performance.now();
      if (now - frameClock > 1000) {
        setFrameMs(Math.round((now - frameClock) / frames));
        frames = 0;
        frameClock = now;
      }

      if (autoRotateRef.current && !dragging) {
        bodyGroup.rotation.y += 0.005;
        targetRotationYRef.current = bodyGroup.rotation.y;
      } else if (!dragging) {
        bodyGroup.rotation.y += (targetRotationYRef.current - bodyGroup.rotation.y) * 0.08;
      }
      camera.position.z += (targetDistanceRef.current - camera.position.z) * 0.12;

      if (pendingHover) {
        const id = pick(pendingHover.x, pendingHover.y);
        pendingHover = null;
        if (id !== hoveredRef.current) setHoveredMuscle(id);
        container.style.cursor = id ? "pointer" : "grab";
      }

      composer.render();
    };
    animate();

    // 9. Resize
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w, h);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      dom.removeEventListener("pointermove", onPointerMove);
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("pointerup", onPointerUp);
      dom.removeEventListener("pointercancel", onPointerUp);
      dom.removeEventListener("pointerleave", onPointerLeave);
      dom.removeEventListener("wheel", onWheel);
      dracoLoader.dispose();
      composer.dispose();
      target.dispose();
      scene.environment?.dispose();
      bodyGroup.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.disposeBoundsTree?.();
          m.geometry.dispose();
        }
      });
      Object.values(groupMats).forEach((m) => m.dispose());
      tendonMat.dispose();
      renderer.dispose();
      if (container.contains(dom)) container.removeChild(dom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleZoom = (delta: number) => {
    targetDistanceRef.current = THREE.MathUtils.clamp(targetDistanceRef.current + delta, 1.2, 4.2);
  };

  const setAngle = (rad: number) => {
    setAutoRotate(false);
    targetRotationYRef.current = rad;
  };

  const resetView = () => {
    targetRotationYRef.current = 0;
    targetDistanceRef.current = 2.5;
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
              MEDICAL-GRADE MUSCULAR SYSTEM · {meshCount > 0 ? meshCount.toLocaleString() : "—"} MUSCLE VOLUMES · FASCIA STRIPPED
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
        className="relative w-full h-[520px] sm:h-[580px] overflow-hidden bg-[radial-gradient(ellipse_at_center,_#1a2119_0%,_#10140f_55%,_#080b08_100%)]"
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
          {frameMs > 0 && `FRAME ${frameMs}MS · `}GRID: 38° FOV ┐
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 font-cond text-[10px] tracking-widest text-drab/50">
          └ INTERACTION: DRAG TO ROTATE · SCROLL TO ZOOM · CLICK A MUSCLE TO LOCK
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

// Fallback procedural mannequin if the GLB fails to load
function buildProceduralAnatomy(group: THREE.Group, mat: THREE.Material) {
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), mat);
  head.position.y = 0.78;
  group.add(head);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.65, 16), mat);
  torso.position.y = 0.35;
  group.add(torso);
}
