/* Food Saver landing page
   ---------------------------------------------------------------------------
   Change these values when you publish a new APK or move the web app.
   Everything on the page (buttons, version text, links) is filled in from here. */
const CONFIG = {
  // The APK, hosted with this site. Download buttons point here, so the file downloads
  // straight away. (Drive can't do that: signed-in visitors get its "can't scan" page.)
  APK_URL: "downloads/food-saver-v1.1.3.apk",
  // Backup copy on Google Drive, linked as "Open in Google Drive". Shared as "Anyone with the link".
  DRIVE_URL: "https://drive.google.com/file/d/1T5UZ30qV-8bKNedRzMd1Q-939sXJRwia/view?usp=sharing",
  WEB_APP_URL: "https://donateforgood.vercel.app",
  APK_VERSION: "1.1.3",
  APK_SIZE: "57 MB",
  MIN_ANDROID: "Android 7.0 or newer",
};

/* Only used when APK_URL is empty: a Drive download link. Signed-out visitors get the
   file directly; signed-in Google users may still see Drive's warning page first. */
function driveDownloadUrl(shareUrl) {
  const match = shareUrl.match(/\/d\/([\w-]{10,})/) || shareUrl.match(/[?&]id=([\w-]{10,})/);
  if (!match) return shareUrl;
  return `https://drive.usercontent.google.com/download?id=${match[1]}&export=download&confirm=t`;
}

const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Links and text from CONFIG ---------- */
const meta = `Version ${CONFIG.APK_VERSION} · ${CONFIG.APK_SIZE} · ${CONFIG.MIN_ANDROID}`;
$$("[data-download]").forEach((a) => {
  if (CONFIG.APK_URL) {
    a.href = CONFIG.APK_URL;
    a.setAttribute("download", CONFIG.APK_URL.split("/").pop());
  } else {
    a.href = driveDownloadUrl(CONFIG.DRIVE_URL);
    a.removeAttribute("download");
  }
});
$$("[data-drive]").forEach((a) => { a.href = CONFIG.DRIVE_URL; });
$$("[data-webapp]").forEach((a) => { a.href = CONFIG.WEB_APP_URL; });
$$("[data-meta]").forEach((el) => { el.textContent = meta; });
$$("[data-size]").forEach((el) => { el.textContent = CONFIG.APK_SIZE; });
$$("[data-min]").forEach((el) => { el.textContent = CONFIG.MIN_ANDROID; });
$$("[data-version]").forEach((el) => { el.textContent = CONFIG.APK_VERSION; });
$$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

/* ---------- iPhone / iPad: no APK, point to the web app ---------- */
const ua = navigator.userAgent;
const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
if (isIOS) document.documentElement.classList.add("is-ios");

/* ---------- Nav border once the page scrolls ---------- */
const nav = document.querySelector("[data-nav]");
const onScrollNav = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
onScrollNav();
window.addEventListener("scroll", onScrollNav, { passive: true });

/* ---------- Reveal on scroll ---------- */
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  $$(".reveal").forEach((el) => revealer.observe(el));
} else {
  $$(".reveal").forEach((el) => el.classList.add("is-in"));
}

/* ---------- How it works: the sticky phone follows the step in view ---------- */
const steps = $$("[data-step]");
const stageImages = $$(".phone--stage img");
if (steps.length && "IntersectionObserver" in window) {
  const setStep = (index) => {
    steps.forEach((step, i) => step.classList.toggle("is-active", i === index));
    stageImages.forEach((img, i) => img.classList.toggle("is-active", i === index));
  };
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setStep(Number(entry.target.dataset.step));
    });
  }, { rootMargin: "-48% 0px -48% 0px" });
  steps.forEach((step) => stepObserver.observe(step));

  // The stage images are lazy; start loading them once the section is close.
  const how = document.getElementById("how");
  const preload = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    stageImages.forEach((img) => { img.loading = "eager"; });
    preload.disconnect();
  }, { rootMargin: "600px 0px" });
  preload.observe(how);
}

/* ---------- Handoff code types itself in ---------- */
const code = document.querySelector("[data-code]");
const codeStatus = document.querySelector("[data-code-status]");
if (code && "IntersectionObserver" in window && !reducedMotion) {
  const boxes = $$(".code__box", code);
  code.setAttribute("data-armed", "");
  const typeCode = () => {
    boxes.forEach((box, i) => {
      setTimeout(() => {
        boxes.forEach((b) => b.classList.remove("is-caret"));
        box.classList.add("is-typed", "is-caret");
      }, 260 + i * 210);
    });
    setTimeout(() => {
      boxes.forEach((b) => b.classList.remove("is-caret"));
      code.classList.add("is-done");
      codeStatus.classList.add("is-shown");
    }, 260 + boxes.length * 210 + 260);
  };
  const codeObserver = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    typeCode();
    codeObserver.disconnect();
  }, { threshold: 0.6 });
  codeObserver.observe(code);
} else if (code) {
  code.classList.add("is-done");
  codeStatus.classList.add("is-shown");
}

/* ---------- Gentle parallax on the hero phones (desktop only) ---------- */
const parallaxEls = $$("[data-parallax]");
const desktop = window.matchMedia("(min-width: 960px)");
if (parallaxEls.length && !reducedMotion) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    parallaxEls.forEach((el) => {
      // `translate` stacks with the entry animation's `transform` instead of fighting it
      el.style.translate = desktop.matches && y < 1200 ? `0 ${(y * Number(el.dataset.parallax)).toFixed(1)}px` : "";
    });
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  desktop.addEventListener("change", update);
}
