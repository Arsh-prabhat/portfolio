const links = document.querySelectorAll('.nav a');
const sections = [...document.querySelectorAll('main section[id]')];

const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  links.forEach((link) => {
    const sectionId = link.dataset.navSection || link.hash.slice(1);
    link.classList.toggle('active', sectionId === visible.target.id);
  });
}, { rootMargin: '-30% 0px -55% 0px', threshold: [0, .2, .5] });

sections.forEach((section) => observer.observe(section));

const note = document.querySelector('.note');
const hero = document.querySelector('.hero');

if (note && hero) {
  let drag = null;
  const noteParent = note.offsetParent || hero;
  const readOffset = (name) => Number.parseFloat(note.style.getPropertyValue(name)) || 0;
  const keepNoteInsideParent = (nextX = readOffset('--note-x'), nextY = readOffset('--note-y')) => {
    const noteRect = note.getBoundingClientRect();
    const parentRect = noteParent.getBoundingClientRect();
    const x = readOffset('--note-x');
    const y = readOffset('--note-y');
    const minX = parentRect.left - (noteRect.left - x);
    const maxX = parentRect.right - (noteRect.right - x);
    const minY = parentRect.top - (noteRect.top - y);
    const maxY = parentRect.bottom - (noteRect.bottom - y);
    note.style.setProperty('--note-x', `${Math.min(maxX, Math.max(minX, nextX))}px`);
    note.style.setProperty('--note-y', `${Math.min(maxY, Math.max(minY, nextY))}px`);
  };

  note.addEventListener('pointerdown', (event) => {
    if (event.target.closest('[data-note-control], button, a, input, select, textarea')) return;
    if (event.button !== 0) return;
    const noteRect = note.getBoundingClientRect();
    const parentRect = noteParent.getBoundingClientRect();
    const x = readOffset('--note-x');
    const y = readOffset('--note-y');
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: x,
      offsetY: y,
      minX: parentRect.left - (noteRect.left - x),
      maxX: parentRect.right - (noteRect.right - x),
      minY: parentRect.top - (noteRect.top - y),
      maxY: parentRect.bottom - (noteRect.bottom - y),
    };
    note.classList.add('is-dragging');
    note.setAttribute('aria-grabbed', 'true');
    note.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  note.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const x = drag.offsetX + event.clientX - drag.startX;
    const y = drag.offsetY + event.clientY - drag.startY;
    note.style.setProperty('--note-x', `${Math.min(drag.maxX, Math.max(drag.minX, x))}px`);
    note.style.setProperty('--note-y', `${Math.min(drag.maxY, Math.max(drag.minY, y))}px`);
  });

  const endDrag = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag = null;
    note.classList.remove('is-dragging');
    note.setAttribute('aria-grabbed', 'false');
  };

  note.addEventListener('pointerup', endDrag);
  note.addEventListener('pointercancel', endDrag);
  note.addEventListener('lostpointercapture', endDrag);
  window.addEventListener('resize', () => keepNoteInsideParent());
  keepNoteInsideParent();

  note.addEventListener('keydown', (event) => {
    if (event.target.closest('[data-note-control]')) return;
    const directions = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const step = event.shiftKey ? 30 : 10;
    const x = readOffset('--note-x');
    const y = readOffset('--note-y');
    keepNoteInsideParent(x + direction[0] * step, y + direction[1] * step);
  });
}

function initDeskCamera() {
  const viewport = document.querySelector('.desk-viewport');
  const desk = viewport?.querySelector('.desk');
  const camera = desk?.querySelector('.desk-camera');
  const objects = [...(desk?.querySelectorAll('.desk-object') || [])];
  const overlay = viewport?.querySelector('.desk-glass-overlay');
  const panel = overlay?.querySelector('.desk-glass-panel');
  const resetButton = panel?.querySelector('.desk-reset');
  if (!viewport || !desk || !camera || !overlay || !panel || !resetButton || !objects.length) return;
  const designWidth = Number.parseFloat(desk.dataset.designWidth) || 1116;
  const designHeight = Number.parseFloat(desk.dataset.designHeight) || 628;

  const content = {
    website: {
      title: 'Website Design & UX',
      intro: 'A thoughtful digital experience shaped around clear journeys and useful content.',
      process: ['Discover goals and audience', 'Map the experience', 'Prototype and refine'],
      activities: ['Information architecture', 'Responsive interface design', 'Usability checks'],
    },
    mobile: {
      title: 'Mobile App Design',
      intro: 'A focused mobile experience designed for real-world use, clarity, and speed.',
      process: ['Understand user needs', 'Shape key flows', 'Prototype and validate'],
      activities: ['Navigation and task flows', 'Accessible interface patterns', 'Interactive prototypes'],
    },
    brand: {
      title: 'Logo & Brand Design',
      intro: 'A visual identity that gives a product a distinctive and consistent point of view.',
      process: ['Explore the brand story', 'Develop visual directions', 'Refine and document'],
      activities: ['Logo concepts', 'Color and type direction', 'Brand application'],
    },
    review: {
      title: 'UX Review',
      intro: 'A structured review that turns usability observations into practical design opportunities.',
      process: ['Review the current experience', 'Prioritize friction points', 'Recommend improvements'],
      activities: ['Heuristic evaluation', 'Issue prioritization', 'Actionable recommendations'],
    },
    research: {
      title: 'Research & Discovery',
      intro: 'Research helps reveal what people need before interface decisions are made.',
      process: ['Set research questions', 'Talk with users', 'Synthesize the findings'],
      activities: ['Interview planning', 'User interviews', 'Insight synthesis'],
    },
    journey: {
      title: 'User Journeys & Flows',
      intro: 'Journeys make user goals, touchpoints, and moments of friction visible to the team.',
      process: ['Define the user goal', 'Map steps and touchpoints', 'Find opportunities'],
      activities: ['Journey mapping', 'Flow diagrams', 'Experience improvements'],
    },
  };

  let selected = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fillList = (list, values) => {
    list.replaceChildren(...values.map((value) => {
      const item = document.createElement('li');
      item.textContent = value;
      return item;
    }));
  };

  const reset = () => {
    selected = null;
    objects.forEach((object) => object.setAttribute('aria-pressed', 'false'));
    camera.style.transform = 'translate(0px, 0px) scale(1)';
    camera.dataset.zoom = '1';
    panel.hidden = true;
    overlay.classList.remove('is-visible');
  };

  const focusObject = (object) => {
    const width = desk.clientWidth;
    const height = desk.clientHeight;
    if (!width || !height) return;

    const transform = getComputedStyle(object).transform;
    const transformValues = transform.match(/^matrix\(([^)]+)\)$/);
    const [a, b, c, d] = transformValues
      ? transformValues[1].split(',').map(Number)
      : [1, 0, 0, 1];
    const visualWidth = Math.abs(a) * object.offsetWidth + Math.abs(c) * object.offsetHeight;
    const visualHeight = Math.abs(b) * object.offsetWidth + Math.abs(d) * object.offsetHeight;
    const focusWidth = Number.parseFloat(object.dataset.focusWidth);
    const sourceWidth = Number.isFinite(focusWidth) && focusWidth > 0
      ? (focusWidth / designWidth) * width
      : visualWidth;
    const sourceHeight = Math.max(1, visualHeight);
    const isCompact = window.matchMedia('(max-width: 620px)').matches;
    const targetWidth = width * (isCompact ? .56 : .40);
    const targetHeight = height * (isCompact ? .78 : .84);
    const minZoom = Math.max(1, Number.parseFloat(object.dataset.cameraMinZoom) || 1);
    const scale = Math.max(minZoom, Math.min(targetWidth / Math.max(1, sourceWidth), targetHeight / sourceHeight, isCompact ? 2.8 : 3.2));
    const sourceX = Number.parseFloat(object.dataset.cameraX);
    const sourceY = Number.parseFloat(object.dataset.cameraY);
    const centerX = Number.isFinite(sourceX) ? (sourceX / designWidth) * width : object.offsetLeft + object.offsetWidth / 2;
    const centerY = Number.isFinite(sourceY) ? (sourceY / designHeight) * height : object.offsetTop + object.offsetHeight / 2;
    const focusCenterX = width * (isCompact ? .5 : .29);
    const focusCenterY = height * .5;
    const translateX = focusCenterX - centerX * scale;
    const translateY = focusCenterY - centerY * scale;
    camera.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    camera.dataset.zoom = String(scale);
  };

  const select = (object) => {
    if (selected === object) {
      reset();
      return;
    }
    selected = object;
    objects.forEach((item) => item.setAttribute('aria-pressed', item === object ? 'true' : 'false'));
    const key = object.dataset.panel;
    const details = content[key] || {
      title: (object.getAttribute('aria-label') || 'Desk object').replace(/^Focus on the /i, '').replace(/^./, (letter) => letter.toUpperCase()),
      intro: 'A working material from the design process, kept close at hand while exploring ideas.',
      process: ['Explore the context', 'Develop an approach', 'Refine the outcome'],
      activities: ['Collect references', 'Test early ideas', 'Capture useful decisions'],
    };
    panel.querySelector('.desk-glass-title').textContent = details.title;
    panel.querySelector('.desk-glass-intro').textContent = details.intro;
    fillList(panel.querySelector('.desk-glass-process'), details.process);
    fillList(panel.querySelector('.desk-glass-activities'), details.activities);
    panel.hidden = false;
    overlay.classList.add('is-visible');
    focusObject(object);
  };

  objects.forEach((object) => {
    object.addEventListener('click', (event) => {
      event.stopPropagation();
      select(object);
    });
  });
  desk.addEventListener('click', (event) => {
    if (event.target.closest('.desk-object')) return;
    if (selected) reset();
  });
  resetButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const previouslySelected = selected;
    reset();
    previouslySelected?.focus();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && selected) reset();
  });
  window.addEventListener('resize', () => {
    if (selected) focusObject(selected);
  }, { passive: true });

  if (prefersReducedMotion.matches) camera.style.transition = 'none';
}

initDeskCamera();

function initDeskScrollExpansion() {
  const section = document.querySelector('.desk-section');
  const stage = section?.querySelector('.desk-stage');
  const viewport = section?.querySelector('.desk-viewport');
  const desk = viewport?.querySelector('.desk');
  const heading = section?.querySelector('.desk-title');
  const nav = document.querySelector('.nav');
  if (!section || !stage || !viewport || !desk || !heading) return;

  section.classList.add('desk-layout-ready');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  section.classList.add('desk-scroll-active');

  let frame = 0;
  let baseRect = null;
  const update = () => {
    frame = 0;
    const sectionStart = window.scrollY + section.getBoundingClientRect().top;
    const scrollRange = Math.max(1, section.offsetHeight - stage.offsetHeight);
    const progress = Math.max(0, Math.min(1, (window.scrollY - sectionStart) / scrollRange));

    if (progress <= 0 || progress >= 1) {
      desk.style.transform = '';
      heading.style.opacity = '';
      nav?.classList.remove('is-desk-hidden');
      if (progress <= 0) baseRect = null;
      return;
    }

    // The sticky stage has reached its steady viewport position. Measure the
    // unscaled desk once, then animate from that same home position both ways.
    if (!baseRect) {
      desk.style.transform = 'none';
      baseRect = desk.getBoundingClientRect();
    }

    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = stage.getBoundingClientRect().height;
    const widthScale = viewportWidth / Math.max(1, baseRect.width);
    const heightScale = viewportHeight / Math.max(1, baseRect.height);
    // Contain, rather than cover, so the whole desktop surface stays visible.
    const targetScale = Math.min(widthScale, heightScale);
    const ease = (value) => value * value * (3 - 2 * value);
    const expandEnd = .22;
    const holdEnd = .72;
    const amount = progress < expandEnd
      ? ease(progress / expandEnd)
      : progress <= holdEnd
        ? 1
        : 1 - ease((progress - holdEnd) / (1 - holdEnd));
    const shiftX = (viewportWidth / 2 - (baseRect.left + baseRect.width / 2)) * amount;
    const shiftY = (viewportHeight / 2 - (baseRect.top + baseRect.height / 2)) * amount;
    const scale = 1 + (targetScale - 1) * amount;

    desk.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0) scale(${scale})`;
    heading.style.opacity = String(1 - amount);
    nav?.classList.toggle('is-desk-hidden', amount > .85);
  };
  const queueUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  const measure = () => {
    baseRect = null;
    queueUpdate();
  };

  window.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.visualViewport?.addEventListener('resize', measure, { passive: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(viewport);
  }
  update();
}

initDeskScrollExpansion();

function initProjectCaseStudies() {
  const dialog = document.querySelector('.case-study-window');
  const cursor = document.querySelector('.custom-cursor');
  const cards = [...document.querySelectorAll('.project-card[data-case-study]')];
  if (!dialog || !cards.length || typeof dialog.showModal !== 'function') return;

  const tags = dialog.querySelector('.case-study-tags');
  const title = dialog.querySelector('#case-study-title');
  const summary = dialog.querySelector('.case-study-summary');
  const cover = dialog.querySelector('.case-study-cover');
  const challenge = dialog.querySelector('.case-study-challenge p');
  const facts = dialog.querySelector('.case-study-facts');
  const longform = dialog.querySelector('.case-study-longform');
  const minimizeButton = dialog.querySelector('.window-control--close');
  const collapseButton = dialog.querySelector('.window-control--collapse');
  const maximizeButton = dialog.querySelector('.window-control--maximize');
  const dialogContent = dialog.querySelector('.case-study-scroll');
  let activeCard = null;
  let closeTimer = 0;

  const details = {
    matchmaking: {
      tags: ['UI/UX Design', 'Matrimonial Experience', 'Profiles & Discovery'],
      title: 'Reimagining Digital Matchmaking',
      summary: 'A more approachable matrimonial experience, with profile creation organized into clear steps and match discovery built around useful profile context.',
      challenge: 'How might we reduce onboarding friction while preserving trust and supporting traditional matchmaking workflows?',
      facts: [['Role', 'UI/UX Designer'], ['Timeline', 'Add project duration'], ['Team', 'Add team details'], ['Responsibilities', 'Profile setup, profile details, and match discovery UI']],
    },
    delivery: {
      tags: ['Product Design', 'Delivery Experience', 'Mobile UX'],
      title: 'Parcel delivery — A clearer journey from pickup to doorstep',
      summary: 'A delivery experience that makes booking, tracking, and handoff easier to understand at every step.',
      challenge: 'How might we help people book deliveries confidently and stay informed without adding friction to the process?',
      facts: [['Role', 'Product Designer'], ['Focus', 'Booking & Tracking'], ['Platform', 'Mobile App'], ['Key Focus', 'Clarity, Status, Trust']],
    },
    accessibility: {
      tags: ['Accessibility', 'Chrome Extension', 'Inclusive Design'],
      title: 'A more comfortable way to read on the web',
      summary: 'A browser extension concept that gives dyslexic students practical control over reading presentation and focus.',
      challenge: 'How might we make everyday web reading more comfortable while keeping controls simple and unobtrusive?',
      facts: [['Role', 'Product Designer'], ['Focus', 'Reading Support'], ['Platform', 'Chrome Extension'], ['Key Focus', 'Typography, Focus, Access']],
    },
  };

  const closeToCard = () => {
    if (!dialog.open) return;
    window.clearTimeout(closeTimer);
    if (activeCard) {
      const cardRect = activeCard.getBoundingClientRect();
      const dialogRect = dialog.getBoundingClientRect();
      const originX = cardRect.left + cardRect.width / 2 - dialogRect.left;
      const originY = cardRect.top + cardRect.height / 2 - dialogRect.top;
      dialog.style.setProperty('--minimize-origin', `${originX}px ${originY}px`);
    }
    if (cursor) {
      cursor.classList.add('is-hidden');
      cursor.classList.remove('is-tagged', 'is-pressed');
      document.documentElement.classList.remove('has-custom-cursor');
    }
    dialog.classList.add('is-minimizing');
    closeTimer = window.setTimeout(() => dialog.close(), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 150);
  };

  const openFor = (card) => {
    if (dialog.open) return;
    const item = details[card.dataset.caseStudy];
    if (!item) return;
    activeCard = card;
    title.textContent = item.title;
    summary.textContent = item.summary;
    challenge.textContent = item.challenge;
    cover.src = card.dataset.caseStudyCover || card.querySelector('.project-preview')?.getAttribute('src') || '';
    cover.alt = card.querySelector('.project-preview')?.alt || `${item.title} case study preview`;
    tags.replaceChildren(...item.tags.map((label) => {
      const tag = document.createElement('span');
      tag.className = 'case-study-tag';
      tag.textContent = label;
      return tag;
    }));
    facts.replaceChildren(...item.facts.map(([label, value]) => {
      const fact = document.createElement('div');
      fact.className = 'case-study-fact';
      const heading = document.createElement('strong');
      const text = document.createElement('span');
      heading.textContent = label;
      text.textContent = value;
      fact.append(heading, text);
      return fact;
    }));
    if (longform) longform.hidden = card.dataset.caseStudy !== 'matchmaking';
    dialog.classList.remove('is-minimizing', 'is-collapsed', 'is-maximized');
    dialog.style.removeProperty('--minimize-origin');
    collapseButton.setAttribute('aria-expanded', 'true');
    maximizeButton.setAttribute('aria-pressed', 'false');
    if (dialogContent) dialogContent.scrollTop = 0;
    dialog.showModal();
    // Native dialogs render in the browser's top layer. Move the custom cursor
    // into that layer while open so it stays above the case-study window.
    if (cursor) dialog.append(cursor);
    dialogContent?.focus({ preventScroll: true });
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => openFor(card));
    card.addEventListener('keydown', (event) => {
      if (event.target !== card || !['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      openFor(card);
    });
  });
  minimizeButton.addEventListener('click', closeToCard);
  collapseButton.addEventListener('click', () => {
    const collapsed = dialog.classList.toggle('is-collapsed');
    collapseButton.setAttribute('aria-expanded', String(!collapsed));
  });
  maximizeButton.addEventListener('click', () => {
    const maximized = dialog.classList.toggle('is-maximized');
    maximizeButton.setAttribute('aria-pressed', String(maximized));
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeToCard();
  });
  dialog.addEventListener('close', () => {
    window.clearTimeout(closeTimer);
    if (cursor) document.body.append(cursor);
    dialog.classList.remove('is-minimizing', 'is-collapsed', 'is-maximized');
    dialog.style.removeProperty('--minimize-origin');
    maximizeButton.setAttribute('aria-pressed', 'false');
    activeCard?.focus();
  });
}

initProjectCaseStudies();

function initParticipantCursor() {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const tag = cursor.querySelector('.custom-cursor__tag');
  const root = document.documentElement;
  root.classList.add('has-custom-cursor');
  const hideCursor = () => {
    cursor.classList.add('is-hidden');
    cursor.classList.remove('is-pressed');
    root.classList.remove('has-custom-cursor');
  };

  const updateCursor = (event) => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    if (event.clientX < 0 || event.clientY < 0 || event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) {
      hideCursor();
      return;
    }
    root.classList.add('has-custom-cursor');
    cursor.style.setProperty('--cursor-x', `${event.clientX}px`);
    cursor.style.setProperty('--cursor-y', `${event.clientY}px`);
    cursor.classList.remove('is-hidden', 'is-flipped-x', 'is-flipped-y');

    const target = event.target instanceof Element ? event.target.closest('[data-cursor-label]') : null;
    const isDraggingNote = document.querySelector('.note.is-dragging');
    const label = isDraggingNote ? 'Moving paper' : target?.dataset.cursorLabel;
    const shape = isDraggingNote ? 'hand' : target?.dataset.cursorShape;
    if (label) {
      tag.textContent = label;
      cursor.classList.add('is-tagged');
      cursor.dataset.theme = target?.dataset.cursorTheme || 'pink';
    } else {
      cursor.classList.remove('is-tagged');
      delete cursor.dataset.theme;
    }

    cursor.classList.toggle('is-hand', shape === 'hand');
    if (event.clientX > window.innerWidth - 260) cursor.classList.add('is-flipped-x');
    if (event.clientY > window.innerHeight - 70) cursor.classList.add('is-flipped-y');
  };

  document.addEventListener('pointermove', updateCursor, { passive: true });
  document.addEventListener('pointerdown', (event) => {
    cursor.classList.add('is-pressed');
    const target = event.target instanceof Element ? event.target : null;
    const noteBody = target?.closest('.note') && !target.closest('[data-note-control], button, a, input, select, textarea');
    if (noteBody) cursor.classList.add('is-hand');
  });
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  document.addEventListener('pointercancel', () => cursor.classList.remove('is-pressed'));
  document.documentElement.addEventListener('pointerleave', hideCursor);
  document.documentElement.addEventListener('mouseleave', hideCursor);
  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) hideCursor();
  });
  document.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget) hideCursor();
  });
  window.addEventListener('pointerleave', hideCursor);
  window.addEventListener('blur', hideCursor);
  window.addEventListener('pagehide', hideCursor);
}

initParticipantCursor();

function initExperienceScroll() {
  const section = document.querySelector('.experience');
  const viewport = section?.querySelector('.experience-track-viewport');
  const track = section?.querySelector('.experience-track');
  if (!section || !viewport || !track) return;

  let distance = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    const sectionStart = window.scrollY + section.getBoundingClientRect().top;
    const progress = distance > 0
      ? Math.min(1, Math.max(0, (window.scrollY - sectionStart) / distance))
      : 0;
    track.style.setProperty('--experience-x', `${-distance * progress}px`);
  };
  const queueUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  const measure = () => {
    distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
    section.style.setProperty('--experience-distance', `${distance}px`);
    section.style.height = `calc(100svh + ${distance}px)`;
    queueUpdate();
  };

  window.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
  }
  measure();
}

initExperienceScroll();
