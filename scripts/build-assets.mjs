import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const root = process.cwd();
const dist = path.join(root, "dist");
const cache = path.join(root, ".asset-cache");
const frameRoot = path.join(dist, "frames");
const mediaRoot = path.join(dist, "media");

fs.mkdirSync(cache, { recursive: true });
fs.mkdirSync(frameRoot, { recursive: true });
fs.mkdirSync(mediaRoot, { recursive: true });

const sources = {
  s1a: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/9465094d-cc5a-4099-867e-af9ad41b71ae.mp4",
  s1b: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/c6ef431f-2da6-45f1-8d69-b2877222db1d.mp4",
  s2a: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/c7ff744e-e76c-4634-bcd6-dea0804dca6b.mp4",
  s2b: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/9431ba2b-ce8a-4c6c-ad80-3e17ad7c6c5d.mp4",
  s3a: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/390ec3b7-c87e-4d3a-8fe2-b4279d520a0c.mp4",
  s3b: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/d7a0f443-e311-4395-83ee-cff7f8d222c7.mp4",
  s4a: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/3ae6c012-0e1a-4b4e-83de-811b5771435b.mp4",
  s4b: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/7e053290-4833-4a0a-8457-16c37f1b56cd.mp4",
  s4c: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/c6c97dbe-c546-49b9-a652-b2562d5445b6.mp4",
  s5a: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/9230cd84-1fa7-4854-a8a4-2324d49e6da1.mp4",
  s5b: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/9479ab57-021e-4283-9dcb-4de23aafb3d3.mp4",
  s6v: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/99ea9d2d-a476-4f72-ada4-97b8b52d6492.mp4",
  f04c: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/762c9b75-8e6c-4ef5-bcf8-29b571c48256.png",
  bridge: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/8ba72dde-8199-4bca-9bd8-e740b7e84ec4.png",
  f05d: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/9f8fc27d-21b1-46a6-8ffc-c08c44438fab.png",
  f06a: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/e56ef5ae-866f-455e-9b59-aeaf790af0b6.png",
  f06b: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/c4e2daf3-0567-454c-934d-8bc062e54630.png",
  f06c: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/4404fb9e-2bd0-4267-a61e-2c2e7320f119.png",
  logo: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/3c5ea8a7-4beb-4027-960f-be44b60947c2.png",
  pack: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/bcacf491-4343-4bce-a042-451d6fb6fe22.png",
  catalogue: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JuwRTklINaVTtX8Q7R1ITnZ900/5f6ba435-0f46-4f42-8fa4-702c898389c6.pdf"
};

async function download(key, url) {
  const ext = path.extname(new URL(url).pathname) || ".bin";
  const out = path.join(cache, key + ext);
  if (fs.existsSync(out) && fs.statSync(out).size > 1024) return out;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${key}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(out, buf);
  return out;
}

function run(args) {
  const result = spawnSync(ffmpegPath, args, { stdio: "inherit" });
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${args.join(" ")}`);
}

function cleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function numberedFiles(dir) {
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".webp"))
    .sort()
    .map((f) => "/" + path.relative(dist, path.join(dir, f)).replaceAll(path.sep, "/"));
}

function extractConcat(sceneId, files) {
  const out = path.join(frameRoot, sceneId);
  cleanDir(out);
  const args = [];
  files.forEach((f) => args.push("-i", f));
  const chains = files.map((_, i) =>
    `[${i}:v]fps=24,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1[v${i}]`
  );
  const inputs = files.map((_, i) => `[v${i}]`).join("");
  const filter = chains.join(";") + ";" + inputs + `concat=n=${files.length}:v=1:a=0[v]`;
  args.push(
    "-filter_complex", filter,
    "-map", "[v]",
    "-an",
    "-vsync", "0",
    "-c:v", "libwebp",
    "-quality", "78",
    path.join(out, "%04d.webp")
  );
  run(args);
  return numberedFiles(out);
}

function extractSingle(sceneId, file, startSeconds = null) {
  const out = path.join(frameRoot, sceneId);
  cleanDir(out);
  const args = [];
  if (startSeconds != null) args.push("-ss", String(startSeconds));
  args.push(
    "-i", file,
    "-vf", "fps=24,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1",
    "-an",
    "-vsync", "0",
    "-c:v", "libwebp",
    "-quality", "78",
    path.join(out, "%04d.webp")
  );
  run(args);
  return numberedFiles(out);
}

function makeConnector(a, b) {
  const outDir = path.join(frameRoot, "connector");
  cleanDir(outDir);
  run([
    "-loop", "1", "-t", "1.35", "-i", a,
    "-loop", "1", "-t", "1.35", "-i", b,
    "-filter_complex",
    "[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1[a];" +
    "[1:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1[b];" +
    "[a][b]xfade=transition=fade:duration=0.55:offset=0.80,fps=24[v]",
    "-map", "[v]",
    "-an",
    "-c:v", "libwebp",
    "-quality", "80",
    path.join(outDir, "%04d.webp")
  ]);
  return numberedFiles(outDir);
}

function copyMedia(src, name) {
  fs.copyFileSync(src, path.join(mediaRoot, name));
  return "/media/" + name;
}

const local = {};
for (const [key, url] of Object.entries(sources)) {
  local[key] = await download(key, url);
}

const manifest = {
  version: 2,
  width: 1280,
  height: 720,
  fps: 24,
  scenes: [],
  connector: [],
  stills: {},
  media: {}
};

manifest.scenes.push({
  id: "awakening",
  label: "Awakening",
  title: "Where character begins.",
  kicker: "From leaf to cup",
  body: "A leaf, a drop, a quiet beginning. Paras follows tea from natural texture into the first signs of character.",
  align: "right",
  scrollWeight: 1.55,
  frames: extractConcat("s01", [local.s1a, local.s1b]),
  mapping: "linear"
});

manifest.scenes.push({
  id: "transformation",
  label: "Transformation",
  title: "Shaped by aroma.",
  kicker: "The Paras Spiral",
  body: "Tea lifts, turns and gathers into a controlled spiral. The material changes, but the story never breaks.",
  align: "left",
  scrollWeight: 1.55,
  frames: extractConcat("s02", [local.s2a, local.s2b]),
  mapping: "linear"
});

manifest.scenes.push({
  id: "golden-tea",
  label: "Golden Tea",
  title: "Golden by character.",
  kicker: "The first reveal",
  body: "The amber core resolves deliberately into Golden Tea, then holds long enough for the product to breathe.",
  align: "left",
  scrollWeight: 2.15,
  frames: extractConcat("s03", [local.s3a, local.s3b]),
  mapping: "slow-final-reveal"
});

manifest.scenes.push({
  id: "brew",
  label: "Brew",
  title: "Colour comes alive.",
  kicker: "Granular infusion",
  body: "Leaf fragments become granules, enter water and release an amber bloom. Weak AI ranges are traversed quickly, not deleted.",
  align: "right",
  scrollWeight: 2.15,
  frames: extractConcat("s04", [local.s4a, local.s4b, local.s4c]),
  mapping: "brew-corrected"
});

manifest.connector = makeConnector(local.f04c, local.bridge);

manifest.scenes.push({
  id: "pour",
  label: "Pour",
  title: "A ritual in motion.",
  kicker: "The long pour",
  body: "The brew resolves into a teapot. The golden stream stays on screen as a real reading moment before the cup is revealed.",
  align: "left",
  scrollWeight: 3.15,
  frames: extractConcat("s05", [local.s5a, local.s5b]),
  mapping: "long-pour"
});

manifest.scenes.push({
  id: "doodh-patti",
  label: "Doodh Patti",
  title: "Two become one.",
  kicker: "Milk + tea",
  body: "Steam organizes first. Milk and tea then materialize, intertwine, marble and resolve into one creamy-golden Doodh Patti state.",
  align: "left",
  scrollWeight: 2.65,
  frames: extractSingle("s06-motion", local.s6v, 1.65),
  mapping: "doodh-patti-staged"
});

manifest.stills = {
  f05d: copyMedia(local.f05d, "scene-05d-final-cup.png"),
  f06a: copyMedia(local.f06a, "scene-06a-steam.png"),
  f06b: copyMedia(local.f06b, "scene-06b-intertwine.png"),
  f06c: copyMedia(local.f06c, "scene-06c-merge.png")
};

manifest.media = {
  logo: copyMedia(local.logo, "paras-logo.png"),
  pack: copyMedia(local.pack, "golden-tea-pack.png"),
  catalogue: copyMedia(local.catalogue, "paras-tea-catalogue.pdf")
};

fs.writeFileSync(path.join(dist, "asset-manifest.json"), JSON.stringify(manifest));
console.log("Paras asset build complete.");
console.log(manifest.scenes.map((s) => ({ id: s.id, frames: s.frames.length })));
