import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const BASE = import.meta.env.BASE_URL || "/";
const $ = (sel, root = document) => root.querySelector(sel);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, v) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

document.querySelector("#app").innerHTML = `
  <div class="loader" id="loader">
    <div class="loader__mark">PARAS</div>
    <div class="loader__bar"><span id="loaderBar"></span></div>
    <div class="loader__copy"><span>Preparing the journey</span><strong id="loaderPct">0%</strong></div>
  </div>

  <header class="site-header">
    <a class="brand" href="#cinematic" aria-label="Paras Tea home">
      <img id="brandLogo" alt="" />
      <span>PARAS TEA</span>
    </a>
    <nav class="desktop-nav">
      <a href="#cinematic">Home</a>
      <a id="catalogueNav" target="_blank" rel="noreferrer">Catalogue</a>
      <a href="#collections">Collections</a>
      <a href="#about">About Us</a>
      <a href="#contact">Contact Us</a>
    </nav>
    <a class="header-cta" href="#contact">Contact Paras</a>
    <button class="menu-button" id="menuButton" type="button" aria-expanded="false">Menu</button>
  </header>
  <div class="mobile-nav" id="mobileNav">
    <a href="#cinematic">Home</a>
    <a id="catalogueMobile" target="_blank" rel="noreferrer">Catalogue</a>
    <a href="#collections">Collections</a>
    <a href="#about">About Us</a>
    <a href="#contact">Contact Us</a>
  </div>

  <main>
    <section id="cinematic" class="cinematic">
      <div class="cinematic__stage" id="stage">
        <canvas id="sceneCanvas" aria-label="Paras Tea cinematic journey"></canvas>
        <div class="scene-shade" id="sceneShade"></div>
        <div class="depth-word" id="depthWord">AWAKEN</div>
        <img class="authentic-pack" id="authenticPack" alt="Paras Golden Tea pack" />
        <div class="pour-mask" id="pourMask"></div>
        <article class="scene-copy scene-copy--left" id="sceneCopy">
          <p class="scene-kicker" id="sceneKicker"></p>
          <h1 id="sceneTitle"></h1>
          <p class="scene-body" id="sceneBody"></p>
        </article>
        <div class="journey-index">
          <span id="sceneNumber">01</span><i></i><span id="sceneLabel">Awakening</span>
        </div>
        <div class="scroll-hint"><span>Scroll to brew</span><i></i></div>
      </div>
    </section>

    <section class="collection" id="collections">
      <div class="collection__ghost" aria-hidden="true">PARAS</div>
      <div class="collection__copy">
        <p class="eyebrow">Our blends</p>
        <h2>A family built around the cup.</h2>
        <p>From the bold character of Golden Tea to the creamy ritual of Doodh Patti, Paras offers blends shaped for different tea moments.</p>
        <a class="text-cta" id="catalogueCTA" target="_blank" rel="noreferrer">View catalogue <span>↗</span></a>
      </div>
      <div class="product-stage">
        <div class="orbit orbit--a"></div>
        <div class="orbit orbit--b"></div>
        <img id="collectionPack" alt="Paras Golden Tea pack" />
      </div>
      <div class="blend-list">
        <a id="blend1" target="_blank"><span>Golden Tea</span><b>↗</b></a>
        <a id="blend2" target="_blank"><span>Special Tea</span><b>↗</b></a>
        <a id="blend3" target="_blank"><span>Doodh Patti Chai</span><b>↗</b></a>
        <a id="blend4" target="_blank"><span>ParasGold Tea</span><b>↗</b></a>
        <a id="blend5" target="_blank"><span>Sona Tea</span><b>↗</b></a>
        <a id="blend6" target="_blank"><span>Super Golden</span><b>↗</b></a>
      </div>
    </section>

    <section class="origin" id="about">
      <div>
        <p class="eyebrow">From Khuzdar</p>
        <h2>The journey began with Golden Tea.</h2>
      </div>
      <div class="origin__body">
        <p>Paras Tea says its Golden Tea journey began in Khuzdar, Balochistan, before growing in popularity across Pakistan.</p>
        <p>The official catalogue describes Golden Tea leaves as hand-picked from Kenya's mountains, processed the same day to preserve aroma, then blended for colour and taste.</p>
        <div class="facts">
          <div><span>Origin story</span><strong>Khuzdar, Balochistan</strong></div>
          <div><span>Leaf source</span><strong>Kenyan mountains</strong></div>
          <div><span>Brand focus</span><strong>Aroma, colour, flavour</strong></div>
        </div>
      </div>
    </section>

    <section class="contact" id="contact">
      <p class="eyebrow">Paras Tea</p>
      <h2>Let the next cup begin.</h2>
      <p class="contact__intro">For distribution, product and trade enquiries, connect directly with the Paras Tea team in Khuzdar.</p>
      <div class="contact-grid">
        <a href="mailto:info@parastea.com.pk"><span>Email</span><strong>info@parastea.com.pk</strong></a>
        <a href="tel:+92848413201"><span>Phone</span><strong>+92 848 413201</strong></a>
        <a href="https://www.parastea.com.pk" target="_blank" rel="noreferrer"><span>Website</span><strong>parastea.com.pk</strong></a>
      </div>
      <address>Ibrahim Shah Complex, Masjid Road, Khuzdar 89100, Pakistan</address>
      <div class="contact-actions">
        <a class="solid-cta" href="mailto:info@parastea.com.pk">Contact Paras</a>
        <a class="text-cta" id="catalogueContact" target="_blank" rel="noreferrer">View catalogue <span>↗</span></a>
      </div>
    </section>
  </main>

  <footer>
    <div class="footer-brand"><img id="footerLogo" alt="" /><span>PARAS TEA</span></div>
    <p>From leaf to cup, the Paras way.</p>
    <span>© 2026 Paras Tea</span>
  </footer>
`;

function asset(path) {
  return BASE + String(path || "").replace(/^\//, "");
}

const canvas = $("#sceneCanvas");
const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
const stage = $("#stage");
const cinematic = $("#cinematic");
const loader = $("#loader");
const loaderBar = $("#loaderBar");
const loaderPct = $("#loaderPct");
const copy = $("#sceneCopy");
const titleEl = $("#sceneTitle");
const kickerEl = $("#sceneKicker");
const bodyEl = $("#sceneBody");
const numberEl = $("#sceneNumber");
const labelEl = $("#sceneLabel");
const depthWord = $("#depthWord");
const packEl = $("#authenticPack");
const pourMask = $("#pourMask");
const sceneShade = $("#sceneShade");

let manifest;
let segments = [];
let progress = 0;
let activeSegment = -1;
let activeSceneIndex = -1;
let renderRequested = true;
let lastDrawKey = "";
let dpr = Math.min(2, window.devicePixelRatio || 1);

const bitmapCache = new Map();
const inFlight = new Map();
const MAX_BITMAPS = window.innerWidth < 800 ? 28 : 52;

function resizeCanvas() {
  dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, window.innerWidth);
  const h = Math.max(1, window.innerHeight);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  renderRequested = true;
}

function evictIfNeeded() {
  while (bitmapCache.size > MAX_BITMAPS) {
    const [key, bmp] = bitmapCache.entries().next().value;
    bitmapCache.delete(key);
    if (bmp && typeof bmp.close === "function") bmp.close();
  }
}

async function loadBitmap(url) {
  const full = asset(url);
  if (bitmapCache.has(full)) {
    const bmp = bitmapCache.get(full);
    bitmapCache.delete(full);
    bitmapCache.set(full, bmp);
    return bmp;
  }
  if (inFlight.has(full)) return inFlight.get(full);
  const promise = fetch(full, { cache: "force-cache" })
    .then((r) => {
      if (!r.ok) throw new Error("Frame fetch failed " + r.status);
      return r.blob();
    })
    .then((blob) => createImageBitmap(blob))
    .then((bmp) => {
      bitmapCache.set(full, bmp);
      inFlight.delete(full);
      evictIfNeeded();
      renderRequested = true;
      return bmp;
    })
    .catch((err) => {
      inFlight.delete(full);
      console.warn(err);
      return null;
    });
  inFlight.set(full, promise);
  return promise;
}

function preloadAround(frames, index, radius = 8) {
  if (!frames?.length) return;
  const order = [0];
  for (let i = 1; i <= radius; i++) order.push(i, -i);
  order.forEach((delta) => {
    const idx = Math.max(0, Math.min(frames.length - 1, index + delta));
    loadBitmap(frames[idx]);
  });
}

async function warmNetwork(frames, concurrency = 5) {
  if (!frames?.length) return;
  let cursor = 0;
  const workers = new Array(concurrency).fill(0).map(async () => {
    while (cursor < frames.length) {
      const i = cursor++;
      try {
        await fetch(asset(frames[i]), { cache: "force-cache", priority: "low" });
      } catch {}
    }
  });
  await Promise.all(workers);
}

function drawCover(bitmap, alpha = 1) {
  if (!bitmap) return;
  const cw = canvas.width;
  const ch = canvas.height;
  const sw = bitmap.width;
  const sh = bitmap.height;
  const scale = Math.max(cw / sw, ch / sh);
  const w = sw * scale;
  const h = sh * scale;
  const x = (cw - w) * 0.5;
  const y = (ch - h) * 0.5;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(bitmap, x, y, w, h);
  ctx.restore();
}

function piecewise(p, points) {
  p = clamp(p);
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, f0] = points[i];
    const [p1, f1] = points[i + 1];
    if (p <= p1) return mix(f0, f1, clamp((p - p0) / (p1 - p0)));
  }
  return points[points.length - 1][1];
}

function mappedFraction(scene, p) {
  switch (scene.mapping) {
    case "slow-final-reveal":
      return piecewise(p, [[0,0],[0.45,0.65],[1,1]]);
    case "brew-corrected":
      return piecewise(p, [[0,0],[0.18,0.16],[0.21,0.23],[0.40,0.42],[0.43,0.48],[1,1]]);
    case "long-pour":
      return piecewise(p, [[0,0],[0.30,0.50],[0.45,0.715],[0.82,0.845],[0.95,1],[1,1]]);
    default:
      return p;
  }
}

function sceneFrame(scene, p) {
  const fraction = mappedFraction(scene, p);
  return Math.round(clamp(fraction) * (scene.frames.length - 1));
}

function setSceneCopy(scene, index, local, connector = false) {
  if (connector) {
    copy.classList.add("is-hidden");
    depthWord.textContent = "INSIDE THE BREW";
    numberEl.textContent = "04";
    labelEl.textContent = "Brew → Pour";
    packEl.style.opacity = "0";
    return;
  }

  copy.classList.remove("is-hidden");
  const changed = activeSceneIndex !== index;
  if (changed) {
    activeSceneIndex = index;
    kickerEl.textContent = scene.kicker || "";
    titleEl.textContent = scene.title;
    bodyEl.textContent = scene.body || "";
    numberEl.textContent = String(index + 1).padStart(2, "0");
    labelEl.textContent = scene.label;
    copy.classList.toggle("scene-copy--right", scene.align === "right");
    copy.classList.toggle("scene-copy--left", scene.align !== "right");
    depthWord.textContent = ["AWAKEN","TRANSFORM","GOLDEN","BREW","POUR","DOODH PATTI"][index] || scene.label.toUpperCase();
  }

  const fadeIn = smoothstep(0.02, 0.14, local);
  const fadeOut = 1 - smoothstep(0.84, 0.98, local);
  const opacity = Math.min(fadeIn, fadeOut);
  copy.style.setProperty("--copy-opacity", opacity.toFixed(3));
  const drift = (0.5 - local) * 34;
  copy.style.setProperty("--copy-drift", drift.toFixed(2) + "px");
  depthWord.style.opacity = String(0.10 * Math.min(smoothstep(0.03, 0.18, local), 1 - smoothstep(0.82, 0.98, local)));

  if (index === 2) {
    const a = smoothstep(0.88, 0.98, local);
    packEl.style.opacity = a.toFixed(3);
    packEl.style.transform = `translate3d(0,${mix(28,0,a)}px,0) scale(${mix(.965,1,a)})`;
  } else {
    packEl.style.opacity = "0";
  }

  if (index === 4) {
    const hide = 1 - smoothstep(0.68, 0.84, local);
    pourMask.style.opacity = (hide * smoothstep(0.36, 0.48, local)).toFixed(3);
  } else {
    pourMask.style.opacity = "0";
  }

  if (index === 3) {
    const problemA = 1 - Math.min(1, Math.abs(local - 0.195) / 0.05);
    const problemB = 1 - Math.min(1, Math.abs(local - 0.415) / 0.035);
    sceneShade.style.setProperty("--problem-mask", String(Math.max(0, problemA, problemB) * 0.42));
  } else {
    sceneShade.style.setProperty("--problem-mask", "0");
  }
}

function buildSegments() {
  const items = [];
  manifest.scenes.forEach((scene, i) => {
    items.push({ type: "scene", scene, sceneIndex: i, weight: scene.scrollWeight || 1 });
    if (i === 3 && manifest.connector?.length) {
      items.push({ type: "connector", frames: manifest.connector, weight: 0.62 });
    }
  });
  const total = items.reduce((sum, s) => sum + s.weight, 0);
  let cursor = 0;
  segments = items.map((item) => {
    const start = cursor / total;
    cursor += item.weight;
    const end = cursor / total;
    return { ...item, start, end };
  });
  cinematic.style.height = `${Math.round(total * 150 + 100)}vh`;
}

function locateSegment(p) {
  p = clamp(p);
  const idx = Math.min(
    segments.length - 1,
    Math.max(0, segments.findIndex((s) => p >= s.start && p <= s.end))
  );
  const segment = segments[idx < 0 ? segments.length - 1 : idx];
  const local = clamp((p - segment.start) / (segment.end - segment.start));
  return { segment, local, index: idx };
}

async function renderStagedDoodh(scene, local) {
  const stills = [
    manifest.stills.f05d,
    manifest.stills.f06a,
    manifest.stills.f06b,
    manifest.stills.f06c
  ];

  if (local < 0.56) {
    const stageP = local / 0.56;
    const scaled = stageP * (stills.length - 1);
    const i = Math.min(stills.length - 2, Math.floor(scaled));
    const t = clamp(scaled - i);
    const a = await loadBitmap(stills[i]);
    const b = await loadBitmap(stills[i + 1]);
    ctx.fillStyle = "#07130d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCover(a, 1);
    drawCover(b, smoothstep(0.18, 0.82, t));
    return "still:" + i + ":" + Math.round(t * 30);
  }

  const motionP = (local - 0.56) / 0.44;
  const index = Math.round(clamp(motionP) * (scene.frames.length - 1));
  preloadAround(scene.frames, index, 9);
  const bmp = await loadBitmap(scene.frames[index]);
  ctx.fillStyle = "#07130d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawCover(bmp, 1);

  const earlyMask = 1 - smoothstep(0.56, 0.76, local);
  if (earlyMask > 0.01) {
    const g = ctx.createLinearGradient(0, canvas.height * .62, 0, canvas.height);
    g.addColorStop(0, "rgba(7,19,13,0)");
    g.addColorStop(.45, `rgba(7,19,13,${0.50 * earlyMask})`);
    g.addColorStop(1, `rgba(7,19,13,${0.92 * earlyMask})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, canvas.height * .55, canvas.width, canvas.height * .45);
  }
  return "motion:" + index;
}

async function renderFrame() {
  if (!manifest || !segments.length) return;
  const { segment, local, index: segIndex } = locateSegment(progress);
  if (segIndex !== activeSegment) {
    activeSegment = segIndex;
    if (segment.type === "scene") {
      warmNetwork(segment.scene.frames).catch(() => {});
      const next = segments[segIndex + 1];
      if (next?.type === "scene") setTimeout(() => warmNetwork(next.scene.frames).catch(() => {}), 900);
    }
  }

  let drawKey;
  if (segment.type === "connector") {
    setSceneCopy(null, activeSceneIndex, local, true);
    const fi = Math.round(local * (segment.frames.length - 1));
    preloadAround(segment.frames, fi, 8);
    const bmp = await loadBitmap(segment.frames[fi]);
    drawKey = "connector:" + fi;
    if (drawKey !== lastDrawKey && bmp) {
      ctx.fillStyle = "#07130d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawCover(bmp);
      lastDrawKey = drawKey;
    }
    return;
  }

  const scene = segment.scene;
  setSceneCopy(scene, segment.sceneIndex, local, false);

  if (scene.mapping === "doodh-patti-staged") {
    drawKey = await renderStagedDoodh(scene, local);
    lastDrawKey = drawKey;
    return;
  }

  const fi = sceneFrame(scene, local);
  drawKey = scene.id + ":" + fi;
  preloadAround(scene.frames, fi, 10);

  if (drawKey === lastDrawKey && !renderRequested) return;
  const bmp = await loadBitmap(scene.frames[fi]);
  if (!bmp) return;

  ctx.fillStyle = "#07130d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawCover(bmp);
  lastDrawKey = drawKey;
}

function configureStaticMedia() {
  const logo = asset(manifest.media.logo);
  const pack = asset(manifest.media.pack);
  const catalogue = asset(manifest.media.catalogue);
  ["brandLogo","footerLogo"].forEach((id) => $("#" + id).src = logo);
  ["authenticPack","collectionPack"].forEach((id) => $("#" + id).src = pack);
  ["catalogueNav","catalogueMobile","catalogueCTA","catalogueContact","blend1","blend2","blend3","blend4","blend5","blend6"]
    .forEach((id) => $("#" + id).href = catalogue);
}

async function initialLoad() {
  manifest = await fetch(asset("asset-manifest.json"), { cache: "no-cache" }).then((r) => r.json());
  configureStaticMedia();
  buildSegments();
  resizeCanvas();

  const first = manifest.scenes[0].frames;
  const prime = [];
  const count = Math.min(20, first.length);
  for (let i = 0; i < count; i++) prime.push(first[Math.round((i / Math.max(1, count - 1)) * Math.min(first.length - 1, 60))]);

  let loaded = 0;
  for (const url of prime) {
    await loadBitmap(url);
    loaded++;
    const pct = Math.round((loaded / prime.length) * 100);
    loaderBar.style.width = pct + "%";
    loaderPct.textContent = pct + "%";
  }

  await renderFrame();
  loader.classList.add("is-done");
  document.body.classList.add("is-ready");
  setTimeout(() => loader.remove(), 900);

  warmNetwork(manifest.scenes[0].frames).catch(() => {});
  setTimeout(() => warmNetwork(manifest.scenes[1].frames).catch(() => {}), 1200);
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lenis = new Lenis({
  autoRaf: false,
  smoothWheel: !reducedMotion,
  lerp: reducedMotion ? 1 : 0.095,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.0
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
  if (renderRequested) {
    renderRequested = false;
    renderFrame();
  }
});

ScrollTrigger.create({
  trigger: cinematic,
  start: "top top",
  end: "bottom bottom",
  onUpdate(self) {
    progress = self.progress;
    renderRequested = true;
  }
});

window.addEventListener("resize", () => {
  resizeCanvas();
  ScrollTrigger.refresh();
});

$("#menuButton").addEventListener("click", () => {
  const btn = $("#menuButton");
  const nav = $("#mobileNav");
  const open = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("is-open", !open);
});

$("#mobileNav").addEventListener("click", (e) => {
  if (e.target.matches("a")) {
    $("#mobileNav").classList.remove("is-open");
    $("#menuButton").setAttribute("aria-expanded", "false");
  }
});

initialLoad().catch((error) => {
  console.error(error);
  loader.querySelector(".loader__mark").textContent = "PARAS TEA";
  loader.querySelector(".loader__copy span").textContent = "Unable to prepare cinematic assets";
  loaderPct.textContent = "Retry";
});
