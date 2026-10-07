/* Routing, case-study rendering, reveal animation, theme toggle, menu, analytics.
   Case-study data (SECTIONS, frame, PROJECTS) comes from assets/projects.js. */

const SB = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
const BASE_TITLE = document.title;

/* ---------- theme ---------- */
(function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (_) {}
  if (saved === "dark" || saved === "light") document.documentElement.dataset.theme = saved;
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const paint = () => {
    const dark =
      document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    btn.textContent = dark ? "Light" : "Dark";
    btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  };
  btn.addEventListener("click", () => {
    const dark =
      document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (_) {}
    paint();
  });
  paint();
})();

/* ---------- menu ---------- */
function closeMenu() {
  const n = document.getElementById("navlinks");
  if (!n) return;
  n.classList.remove("open");
  const b = document.querySelector(".burger");
  if (b) b.setAttribute("aria-expanded", "false");
}
function toggleMenu(btn) {
  const n = document.getElementById("navlinks");
  n.classList.toggle("open");
  btn.setAttribute("aria-expanded", n.classList.contains("open") ? "true" : "false");
}

/* ---------- reveal ---------- */
let io;
function observeReveal() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"));
    return;
  }
  if (!io)
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
  document.querySelectorAll(".rv:not(.in)").forEach((el, i) => {
    el.style.transitionDelay = Math.min(i, 6) * 45 + "ms";
    io.observe(el);
  });
}

/* ---------- case studies ---------- */
function renderProject(id) {
  const host = document.getElementById(id);
  const p = PROJECTS[id];
  if (!host || !p || host.dataset.built) return;
  let nav = "";
  let body = "";
  SECTIONS.forEach((s, i) => {
    const slug = id + "-s" + i;
    const n = String(i + 1).padStart(2, "0");
    nav += `<button data-target="${slug}">${n} · ${s}</button>`;
    body += `<div class="s-block" id="${slug}"><div class="num">${n} / ${SECTIONS.length}</div><h3>${s}</h3>${
      p.body[s] || "<p>—</p>"
    }</div>`;
  });
  const facts = p.facts
    .map((f) => `<div class="fact"><div class="fl">${f[0]}</div><div class="fv">${f[1]}</div></div>`)
    .join("");
  host.innerHTML = `
    <div class="cs-hero"><div class="wrap">
      <button class="back" data-home>← All work</button>
      <span class="eyebrow">Case study</span>
      <h1>${p.title}</h1>
      <p class="sub">${p.sub}</p>
      <div class="cs-facts">${facts}</div>
    </div></div>
    <div class="wrap"><div class="cs-layout">
      <nav class="sidenav" aria-label="Sections">${nav}</nav>
      <div class="cs-content">${body}</div>
    </div></div>
    <div class="cs-cta"><div class="wrap">
      <h2 style="font-size:1.6rem">Interested in this kind of work?</h2>
      <a class="btn btn-primary" href="mailto:Druva.akhil@gmail.com" style="margin-top:18px">Get in touch →</a>
    </div></div>`;
  host.dataset.built = "1";
  host.querySelector("[data-home]").addEventListener("click", () => {
    go("home");
    scrollToId("other-work");
  });
  host.querySelectorAll(".sidenav button").forEach((b) =>
    b.addEventListener("click", () => {
      document.getElementById(b.dataset.target).scrollIntoView({ behavior: SB });
    }),
  );
  // Highlight the section in view.
  if ("IntersectionObserver" in window) {
    const buttons = [...host.querySelectorAll(".sidenav button")];
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          buttons.forEach((b) => b.classList.toggle("active", b.dataset.target === e.target.id));
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    host.querySelectorAll(".s-block").forEach((s) => spy.observe(s));
  }
}

/* ---------- router ---------- */
function routeId() {
  const h = location.hash || "";
  if (h.indexOf("#/") === 0) {
    const id = h.slice(2);
    if (PROJECTS[id]) return id;
  }
  return "home";
}
function show(id) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  const target = document.getElementById(id) || document.getElementById("home");
  if (id !== "home") renderProject(id);
  target.classList.add("active");
  document.title = id === "home" ? BASE_TITLE : `${PROJECTS[id].title} · ${BASE_TITLE}`;
  window.scrollTo({ top: 0, behavior: "auto" });
  closeMenu();
  observeReveal();
  if (window.va && id !== "home") {
    try {
      window.va("event", { name: "project_open", data: { id } });
    } catch (_) {}
  }
}
function go(id) {
  const h = id === "home" ? "#" : "#/" + id;
  if (location.hash !== h) {
    try {
      history.pushState(null, "", h);
    } catch (_) {
      location.hash = h;
    }
  }
  show(id);
}
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: SB });
  closeMenu();
}
window.addEventListener("hashchange", () => show(routeId()));
window.addEventListener("popstate", () => show(routeId()));

/* ---------- wire up ---------- */
document.querySelectorAll("[data-go]").forEach((el) =>
  el.addEventListener("click", (e) => {
    e.preventDefault();
    go("home");
    scrollToId(el.dataset.go);
  }),
);
document.querySelectorAll("a[href^='#/']").forEach((a) =>
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(2);
    if (PROJECTS[id]) {
      e.preventDefault();
      go(id);
    }
  }),
);
document.querySelector(".burger")?.addEventListener("click", function () {
  toggleMenu(this);
});

show(routeId());
setTimeout(() => document.querySelectorAll(".rv:not(.in)").forEach((el) => el.classList.add("in")), 2500);

/* outbound click analytics (Vercel Web Analytics, when enabled) */
document.addEventListener(
  "click",
  (e) => {
    const a = e.target.closest && e.target.closest('a[target="_blank"][href^="http"]');
    if (a && window.va) {
      try {
        window.va("event", {
          name: "outbound_click",
          data: { href: a.getAttribute("href"), label: (a.textContent || "").trim().slice(0, 60) },
        });
      } catch (_) {}
    }
  },
  true,
);
