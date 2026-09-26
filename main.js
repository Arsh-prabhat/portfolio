/* ------------------------------------------------------------
   Front page → tear-open on scroll
   ------------------------------------------------------------ */
(function () {
  "use strict";

  var stage = document.querySelector(".layer--paper");
  var paper = document.getElementById("paper");
  var track = document.querySelector(".scroll-track");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var smallScreen = window.matchMedia("(max-width: 820px), (max-height: 540px)").matches;

  /* ---------- deterministic jagged tear profile ---------- */
  // one shared profile => the two torn edges line up perfectly at rest
  function buildTearProfile(segments, seed) {
    var s = seed || 7;
    function rnd() {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    }
    var pts = [];
    for (var i = 0; i <= segments; i++) {
      var x = (i / segments) * 100;
      var edge = i === 0 || i === segments;
      var base = 49;
      var amp = edge ? 1.5 : 5.5;
      var micro = (rnd() - 0.5) * 2.2; // small fibre jitter
      var y = base + (rnd() - 0.5) * 2 * amp + micro;
      pts.push([x, Math.max(38, Math.min(60, y))]);
    }
    return pts;
  }

  function clipTop(pts) {
    // extend the top half ~1.4% past the tear line so the two halves overlap
    // and no hairline of the background shows through the seam at rest
    var line = pts
      .slice()
      .reverse()
      .map(function (p) { return p[0].toFixed(2) + "% " + (p[1] + 1.4).toFixed(2) + "%"; })
      .join(", ");
    return "polygon(0% -2%, 100% -2%, " + line + ")";
  }

  function clipBottom(pts) {
    var line = pts
      .map(function (p) { return p[0].toFixed(2) + "% " + p[1].toFixed(2) + "%"; })
      .join(", ");
    return "polygon(" + line + ", 100% 102%, 0% 102%)";
  }

  /* ---------- pill: nudge the scroll so the tear plays ---------- */
  function wireUnwrap() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".unwrap");
      if (!btn) return;
      if (fallback()) {
        var t = document.querySelector("#next");
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: window.innerHeight * 1.35, behavior: "smooth" });
      }
    });
  }

  function fallback() {
    return reduceMotion || smallScreen || !window.gsap || !window.ScrollTrigger ||
      !stage || !paper || !track;
  }

  /* ---------- build the effect ---------- */
  function init() {
    wireUnwrap();

    if (fallback()) return;

    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);

    /* ===== ACT 1 — build the two torn newspaper halves ===== */
    var layer = document.createElement("div");
    layer.className = "tear-layer";

    var top = document.createElement("div");
    top.className = "piece piece--top";
    var bottom = document.createElement("div");
    bottom.className = "piece piece--bottom";

    top.appendChild(paper.cloneNode(true));
    bottom.appendChild(paper.cloneNode(true));
    layer.appendChild(top);
    layer.appendChild(bottom);
    stage.appendChild(layer);
    layer.querySelectorAll("[id]").forEach(function (n) { n.removeAttribute("id"); });

    var profile = buildTearProfile(46, 21);
    top.style.clipPath = clipTop(profile);
    bottom.style.clipPath = clipBottom(profile);
    paper.classList.add("is-torn");

    /* ===== ACT 3 setup — collapse the whole collage into the portrait ===== */
    var frame = document.querySelector(".sticker--frame");
    var nav = document.querySelector(".cnav");
    var burst = [].slice.call(
      document.querySelectorAll(".sticker:not(.sticker--frame), .collage .note")
    );

    // remember each element's offset to the portrait's "head" point
    function measure() {
      var f = frame.getBoundingClientRect();
      var cx = f.left + f.width * 0.5;
      var cy = f.top + f.height * 0.4;
      burst.forEach(function (el) {
        var r = el.getBoundingClientRect();
        el.__dx = cx - (r.left + r.width * 0.5) - (Number(gsap.getProperty(el, "x")) || 0);
        el.__dy = cy - (r.top + r.height * 0.5) - (Number(gsap.getProperty(el, "y")) || 0);
      });
    }
    measure();

    gsap.set(burst, {
      x: function (i, el) { return el.__dx; },
      y: function (i, el) { return el.__dy; },
      scale: 0.12,
      autoAlpha: 0,
      transformOrigin: "50% 50%",
      rotation: function () { return gsap.utils.random(-150, 150); }
    });
    gsap.set(nav, { autoAlpha: 0, y: -14 });

    /* ===== one scrubbed timeline: tear -> crack -> burst ===== */
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".collage-hero-section",
        start: "top top",
        end: "+=120%",
        pin: true,
        pinSpacing: true,
        scrub: 0.7,
        onRefresh: measure,
        onUpdate: function (self) {
          var p = self.progress;
          layer.classList.toggle("is-tearing", p > 0.002 && p < 0.24);
          stage.style.pointerEvents = p > 0.2 ? "none" : "";
          stage.classList.toggle("tear-done", p > 0.26);
        }
      }
    });

    // --- act 1: the paper tears apart (0 -> 1.0) ---
    tl.to(top, { yPercent: -120, xPercent: -8, rotation: -6, ease: "power2.in" }, 0)
      .to(bottom, { yPercent: 122, xPercent: 7, rotation: 5, ease: "power2.in" }, 0)
      .to(layer.querySelectorAll(".unwrap"), { autoAlpha: 0, duration: 0.15, ease: "none" }, 0)
      .to([top, bottom], { autoAlpha: 0, duration: 0.16, ease: "none" }, 0.84);

    // --- act 2: the portrait cracks open (1.0 -> 1.6) ---
    tl.to(".crack__line", { strokeDashoffset: 0, duration: 0.45, ease: "none", stagger: 0.04 }, 1.05)
      .fromTo(".crack__flash",
        { autoAlpha: 0 },
        { autoAlpha: 0.9, duration: 0.06, ease: "none", yoyo: true, repeat: 1 }, 1.2)
      .to(frame, { keyframes: { x: [0, -6, 6, -4, 4, -2, 0] }, duration: 0.3, ease: "none" }, 1.14)
      .to(frame, { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" }, 1.14);

    // --- act 3: everything bursts out of the portrait (1.4 -> 2.5) ---
    tl.to(burst, {
      x: 0, y: 0, scale: 1, autoAlpha: 1,
      rotation: function (i, el) { return parseFloat(el.dataset.rot || "0"); },
      ease: "back.out(1.5)",
      duration: 0.8,
      stagger: { each: 0.03, from: "random" }
    }, 1.45)
      .to(".crack__line", { autoAlpha: 0, duration: 0.35, ease: "none" }, 1.75)
      .to(nav, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 2.15);

    // handle smooth click links for all internal section anchors
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (!href || href === "#") return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    window.addEventListener("resize", function () { ST.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ST.refresh(); });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


/* ------------------------------------------------------------
   Collage — springy hover + doodle strokes + editable text
   ------------------------------------------------------------ */
(function () {
  "use strict";

  function start() {
    var gsap = window.gsap;
    var hasGsap = !!gsap;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasGsap) document.documentElement.classList.add("no-gsap");

    /* ---- editable text: remember edits per browser ---- */
    document.querySelectorAll(".edit[data-key]").forEach(function (el) {
      var key = "arsh_collage_" + el.dataset.key;
      try {
        var saved = localStorage.getItem(key);
        if (saved !== null) el.textContent = saved;
      } catch (e) {}
      el.addEventListener("input", function () {
        try { localStorage.setItem(key, el.textContent); } catch (e) {}
      });
      // don't let a stray Enter create newlines in single-line labels
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !el.classList.contains("art-song__lyric")) {
          e.preventDefault();
          el.blur();
        }
      });
    });

    /* ---- springy hover on every sticker ---- */
    if (!hasGsap || reduce) return; // CSS fallback handles the rest

    var rand = gsap.utils.random;

    document.querySelectorAll(".sticker").forEach(function (el) {
      var baseRot = parseFloat(el.dataset.rot || "0");
      // NOTE: initial rotation/position is owned by the tear→burst timeline in
      // the first IIFE; don't gsap.set() it here or it fights the collapse state.

      var enter = function () {
        el.classList.add("is-active");
        gsap.to(el, {
          rotate: baseRot + rand(-7, 7),
          y: -16,
          scale: 1.045,
          duration: 0.7,
          ease: "elastic.out(1, 0.35)"
        });
      };
      var leave = function () {
        el.classList.remove("is-active");
        gsap.to(el, {
          rotate: baseRot,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out"
        });
      };

      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      el.addEventListener("focusin", enter);
      el.addEventListener("focusout", leave);
    });

    /* (no idle float — stickers stay put once they land) */
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();


/* ------------------------------------------------------------
   Apple-Style Case Study Overlay Modal
   ------------------------------------------------------------ */
(function () {
  "use strict";

  var caseStudies = {
    "1": {
      title: "Weddingzon — Matrimonial Platform UX Redesign",
      subtitle: "Redesigning matrimonial onboarding around value-before-commitment, progressive profile creation, and trust-building discovery.",
      tags: ["UI/UX Design", "Matrimonial SaaS", "Trust & Discovery"],
      image: "assets/project-card-1.png",
      metric1Val: "+45%", metric1Lbl: "Onboarding Completion",
      metric2Val: "8+ Client", metric2Lbl: "Products Shipped",
      metric3Val: "4.9 ★", metric3Lbl: "User Satisfaction",
      lead: "Analyzed matrimonial platforms including Shaadi.com, Jeevansathi, and BharatMatrimony across onboarding, profile creation, discovery, communication, and trust-building experiences.",
      body: "Redesigned onboarding around a value-before-commitment approach, enabling users to explore potential matches before completing detailed profiles. Designed progressive profile creation with categorized steps, auto-saved progress, progress indicators, deferred optional fields, and contextual completion nudges. Explored a Bureau System to digitize traditional matchmaking workflows and designed permission-based communication from match requests to chat.",
      bullets: [
        "Value-Before-Commitment Onboarding: Allowed users to explore potential matches before filling lengthy forms.",
        "Progressive Profile Creation: Categorized steps, auto-save progress, and contextual completion nudges.",
        "Trust & Verification: Identity verification, compatibility indicators, and verified-profile badges.",
        "Bureau System: Digitized traditional matchmaking workflows with permission-based chat."
      ]
    },
    "2": {
      title: "Tympe — QR Delivery Booking & Driver Logistics Workflows",
      subtitle: "Streamlining delivery booking via QR auto-fill and designing driver floor-charge and document storage flows.",
      tags: ["Logistics UX", "Mobile Application", "Driver Workflows"],
      image: "assets/project-card-2.png",
      metric1Val: "80%", metric1Lbl: "Faster Booking Flow",
      metric2Val: "0", metric2Lbl: "Manual Data Redundancy",
      metric3Val: "100%", metric3Lbl: "Driver Compliance",
      lead: "Designed a QR-based delivery booking flow that auto-populates user details, allowing customers to select a vehicle and book deliveries with minimal manual entry.",
      body: "Worked across requirement analysis, user flows, information architecture, wireframing, UI design, prototyping, design systems, and developer handoff. Designed driver workflows including floor-charge handling when lift access is unavailable and in-app document storage for quick access during verification checks.",
      bullets: [
        "QR Delivery Booking: Auto-populates customer details for fast vehicle selection and checkout.",
        "Driver Floor-Charge Handling: Clear workflow when lift access is unavailable in multi-story deliveries.",
        "In-App Document Storage: Secure and instant access for drivers during verification checks."
      ]
    },
    "3": {
      title: "Adaptive Reading Platform — Personalised Learning & Accessibility UX",
      subtitle: "Designing personalized typography, dynamic text chunking, and reader engagement controls for diverse learning needs.",
      tags: ["EdTech", "Adaptive UX", "Accessibility"],
      image: "assets/project-card-3.png",
      metric1Val: "3.5x", metric1Lbl: "Reading Focus Rate",
      metric2Val: "88%", metric2Lbl: "Comprehension Retention",
      metric3Val: "4.9 ★", metric3Lbl: "User Satisfaction Rating",
      lead: "Readers with varying comprehension levels, dyslexia, or focus challenges often struggle with standard monolithic digital text layouts and rigid typography.",
      body: "Designed an adaptive reading interface that dynamically adjusts line height, font sizing, contrast themes, and bionic reading highlights based on user comprehension metrics. Created wireframes, interactive prototypes, and usability-tested responsive reader controls for seamless multi-device engagement.",
      bullets: [
        "Dynamic Typography & Layouts: Adaptive line spacing, variable font weights, and customizable high-contrast color themes.",
        "Bionic Reading & Focus Mode: Highlighting initial letters to improve reading speed, visual pacing, and text retention.",
        "Comprehension & Vocabulary Cues: Inline instant tooltips, audio synchronization, and visual progress tracking."
      ]
    }
  };

  function initCaseStudyModal() {
    var overlay = document.getElementById("csOverlay");
    var modal = document.getElementById("csModal");
    var closeBtn = document.getElementById("csCloseBtn");

    if (!overlay || !modal) return;

    function openModal(projectId) {
      var data = caseStudies[projectId] || caseStudies["1"];
      
      // Update elements
      var titleEl = document.getElementById("csTitle");
      var subEl = document.getElementById("csSubtitle");
      var tag1El = document.getElementById("csTag1");
      var tag2El = document.getElementById("csTag2");
      var tag3El = document.getElementById("csTag3");
      var heroImg = document.getElementById("csHeroImg");
      var showcaseImg = document.getElementById("csShowcaseImg");
      var m1Val = document.getElementById("csMetricVal1");
      var m1Lbl = document.getElementById("csMetricLbl1");
      var m2Val = document.getElementById("csMetricVal2");
      var m2Lbl = document.getElementById("csMetricLbl2");
      var m3Val = document.getElementById("csMetricVal3");
      var m3Lbl = document.getElementById("csMetricLbl3");
      var leadEl = document.getElementById("csLead");
      var bodyEl = document.getElementById("csBody");
      var bulletsEl = document.querySelector(".cs-bullets");

      if (titleEl) titleEl.textContent = data.title;
      if (subEl) subEl.textContent = data.subtitle;
      if (tag1El && data.tags[0]) tag1El.textContent = data.tags[0];
      if (tag2El && data.tags[1]) tag2El.textContent = data.tags[1];
      if (tag3El && data.tags[2]) tag3El.textContent = data.tags[2];
      if (heroImg) heroImg.src = data.image;
      if (showcaseImg) showcaseImg.src = data.image;

      if (m1Val) m1Val.textContent = data.metric1Val;
      if (m1Lbl) m1Lbl.textContent = data.metric1Lbl;
      if (m2Val) m2Val.textContent = data.metric2Val;
      if (m2Lbl) m2Lbl.textContent = data.metric2Lbl;
      if (m3Val) m3Val.textContent = data.metric3Val;
      if (m3Lbl) m3Lbl.textContent = data.metric3Lbl;

      if (leadEl) leadEl.textContent = data.lead;
      if (bodyEl) bodyEl.textContent = data.body;

      if (bulletsEl && data.bullets) {
        bulletsEl.innerHTML = data.bullets.map(function(b) {
          var parts = b.split(': ');
          if (parts.length > 1) {
            return '<li><strong>' + parts[0] + ':</strong> ' + parts.slice(1).join(': ') + '</li>';
          }
          return '<li>' + b + '</li>';
        }).join('');
      }

      overlay.setAttribute("aria-hidden", "false");
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    // Attach click listeners to cards
    document.querySelectorAll(".project-card").forEach(function (card) {
      card.addEventListener("click", function (e) {
        // don't open modal if user is editing editable title text
        if (e.target.closest(".edit[contenteditable='true']")) return;
        var id = card.dataset.projectId || "1";
        openModal(id);
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCaseStudyModal);
  } else {
    initCaseStudyModal();
  }
})();
