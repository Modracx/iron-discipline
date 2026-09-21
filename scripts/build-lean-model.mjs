/**
 * Builds public/models/muscular_lean.glb from the full Z-Anatomy muscular
 * model: drops the meshes InteractiveBody3D never renders (fasciae, bursae,
 * origin/insertion marker patches, internal muscles), simplifies what is
 * left and re-compresses with Draco. 12 MB / 3.3M tris → ~2.3 MB / 540k tris.
 *
 *   node scripts/build-lean-model.mjs [source.glb] [ratio] [error]
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { simplify, weld, prune, draco } from "@gltf-transform/functions";

const OUT = "public/models/muscular_lean.glb";
import { MeshoptSimplifier } from "meshoptimizer";
import draco3d from "draco3dgltf";

const MARKER = /\.[oe]\d*[lr]$/i;
const HIDDEN = /fascia|bursa|sheath|retinacul|septum|tarsus|trochlea|pharyng|arytenoid|epiglott|cricothyroid|thyro-|palato|constrictor|genioglossus|hyoglossus|diaphragm|intercostal|levator ani|coccygeus|sphincter|pubo-analis|transversus thoracis|levator palpebrae|superior oblique muscle|inferior oblique muscle|superior rectus|inferior rectus|lateral rectus|medial rectus|pterygoid|common tendinous ring|iliopectineal|inguinal/i;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "draco3d.decoder": await draco3d.createDecoderModule(),
  "draco3d.encoder": await draco3d.createEncoderModule(),
});
const doc = await io.read(process.argv[2] ?? "assets-src/muscular_male.glb");
let removed = 0;
for (const node of doc.getRoot().listNodes()) {
  const n = node.getName();
  if (node.getMesh() && (MARKER.test(n) || HIDDEN.test(n))) { node.dispose(); removed++; }
}
console.log("removed nodes", removed);
await doc.transform(
  prune(),
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: Number(process.argv[3] ?? 0.3), error: Number(process.argv[4] ?? 0.004) }),
  draco({ method: "edgebreaker", quantizePosition: 14, quantizeNormal: 10 }),
);
await io.write(OUT, doc);
const b = (await import("fs")).readFileSync(OUT);
const len = b.readUInt32LE(12); const j = JSON.parse(b.toString("utf8", 20, 20 + len));
let tri = 0; for (const m of j.meshes) for (const p of m.primitives) tri += j.accessors[p.indices].count / 3;
console.log(OUT, (b.length / 1e6).toFixed(2), "MB, tris", tri, "meshes", j.meshes.length);
