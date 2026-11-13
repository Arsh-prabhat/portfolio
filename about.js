(() => {
  const cursor = document.querySelector('.custom-cursor');
  const root = document.documentElement;
  const scene = document.querySelector('.about-scene');
  const collage = scene?.querySelector('.collage');
  const nav = document.querySelector('.about-nav');
  const interactiveItems = [...document.querySelectorAll('[data-collage-interactive]')];
  const selectItem = (item) => {
    const nextSelected = !item.classList.contains('is-picked');
    interactiveItems.forEach((candidate) => {
      const selected = candidate === item && nextSelected;
      candidate.classList.toggle('is-picked', selected);
      candidate.setAttribute('aria-pressed', String(selected));
    });
  };
  interactiveItems.forEach((item) => {
    item.addEventListener('click', () => selectItem(item));
    item.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      item.click();
    });
  });

  // Keep hover-only doodles tied to the matching, independently positioned
  // handwritten annotations. Labels and arrows stay visible and stationary.
  const calloutPairs = [
    ['.sticker--plate', '.note--love'],
    ['.sticker--stamp', '.note--timeless'],
    ['.sticker--song', '.note--artist'],
    ['.sticker--cam', '.note--passion'],
    ['.sticker--tv', '.note--makes'],
  ];
  calloutPairs.forEach(([itemSelector, noteSelector]) => {
    const item = document.querySelector(itemSelector);
    const note = document.querySelector(noteSelector);
    if (!item || !note || note.dataset.annotationFor !== itemSelector.slice(1)) return;
    const setVisible = (visible) => {
      item.classList.toggle('is-callout-active', visible);
    };
    item.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') setVisible(true);
    });
    item.addEventListener('pointerleave', () => setVisible(item.matches(':focus-visible')));
    item.addEventListener('focusin', () => setVisible(item.matches(':focus-visible')));
    item.addEventListener('focusout', () => setVisible(false));
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compactLayout = window.matchMedia('(max-width: 1100px)').matches;
  const portraitStage = window.matchMedia('(max-width: 1100px) and (orientation: portrait)');
  const gsap = window.gsap;

  const syncAboutSceneScale = () => {
    if (!scene || !collage) return;

    const sceneRect = scene.getBoundingClientRect();
    const availableWidth = scene.clientWidth || document.documentElement.clientWidth || window.innerWidth;
    const viewportTop = Math.max(0, window.visualViewport?.offsetTop || 0);
    const navTop = nav?.getBoundingClientRect().top ?? window.innerHeight;
    const availableTop = Math.max(0, viewportTop - sceneRect.top);
    const availableBottom = Math.max(availableTop, navTop - 16 - sceneRect.top);
    const availableHeight = Math.max(0, availableBottom - availableTop);

    if (portraitStage.matches) {
      // Use one fixed portrait coordinate system for every tablet/mobile
      // element, then scale the complete stage uniformly into the nav-free area.
      const portraitWidth = 1000;
      const portraitHeight = 1600;
      const scale = Math.min(1, availableWidth / portraitWidth, availableHeight / portraitHeight);
      collage.style.width = `${portraitWidth}px`;
      collage.style.height = `${portraitHeight}px`;
      collage.style.left = `${(availableWidth - portraitWidth * scale) / 2}px`;
      collage.style.top = `${availableTop + (availableHeight - portraitHeight * scale) / 2}px`;
      collage.style.transformOrigin = 'top left';
      collage.style.transform = `scale(${scale})`;
      scene.style.setProperty('--about-scene-scale', String(scale));
      return;
    }

    // Measure the complete painted collage at its reference size. This union
    // includes rotated stickers, labels, doodles, and arrows that extend past
    // the nominal 1920 × 1080 canvas.
    collage.style.width = '1920px';
    collage.style.height = '1080px';
    collage.style.left = '0px';
    collage.style.top = '0px';
    collage.style.transformOrigin = 'top left';
    collage.style.transform = 'scale(1)';
    const stageRect = collage.getBoundingClientRect();
    let bounds = { left: 0, top: 0, right: stageRect.width, bottom: stageRect.height };
    collage.querySelectorAll('*').forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const left = rect.left - stageRect.left;
      const top = rect.top - stageRect.top;
      bounds.left = Math.min(bounds.left, left);
      bounds.top = Math.min(bounds.top, top);
      bounds.right = Math.max(bounds.right, left + rect.width);
      bounds.bottom = Math.max(bounds.bottom, top + rect.height);
    });

    // Leave room for drop shadows and the fixed navigation; the nav itself is
    // outside the transformed stage and never participates in its scale.
    const paintPad = 24;
    bounds = {
      left: bounds.left - paintPad,
      top: bounds.top - paintPad,
      right: bounds.right + paintPad,
      bottom: bounds.bottom + paintPad,
    };
    const contentWidth = bounds.right - bounds.left;
    const contentHeight = bounds.bottom - bounds.top;
    // Convert viewport coordinates to the collage's positioned ancestor's
    // local coordinates. This keeps the fit correct if the page restores a
    // non-zero scroll position or the visual viewport is offset on mobile.
    const scale = Math.min(1, availableWidth / contentWidth, availableHeight / contentHeight);
    const left = (availableWidth - contentWidth * scale) / 2 - bounds.left * scale;
    const top = availableTop + (availableHeight - contentHeight * scale) / 2 - bounds.top * scale;

    scene.style.setProperty('--about-scene-scale', String(scale));
    collage.style.left = `${left}px`;
    collage.style.top = `${top}px`;
    collage.style.transform = `scale(${scale})`;
  };
  syncAboutSceneScale();
  window.addEventListener('resize', syncAboutSceneScale, { passive: true });
  window.visualViewport?.addEventListener('resize', syncAboutSceneScale, { passive: true });
  portraitStage.addEventListener('change', syncAboutSceneScale);
  if (nav && 'ResizeObserver' in window) new ResizeObserver(syncAboutSceneScale).observe(nav);
  document.fonts?.ready.then(syncAboutSceneScale);

  if (gsap) {
    const revealItems = [...document.querySelectorAll('[data-reveal]:not(.note)')];
    const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (!reducedMotion && !compactLayout) {
      entrance.fromTo(revealItems, { autoAlpha: 0, y: 28, scale: .97 }, { autoAlpha: 1, y: 0, scale: 1, duration: .7, stagger: .07 });
    } else {
      gsap.set(revealItems, { autoAlpha: 1, clearProps: 'transform' });
    }

    const coke = document.querySelector('.sticker--plate');
    const phone = document.querySelector('.sticker--stamp');
    const song = document.querySelector('.sticker--song');
    const headphones = document.querySelector('.sticker--tv');
    const guitar = document.querySelector('.sticker--cam');
    const movingStickers = [coke, phone, song, headphones, guitar].filter(Boolean);
    const scrollBurst = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
    if (coke) scrollBurst.to(coke, { x: -28, y: -8, rotation: 10, duration: .8 }, .16);
    if (phone) scrollBurst.to(phone, { x: 28, y: -14, rotation: -23, duration: .8 }, .16);
    if (song) scrollBurst.to(song, { x: 36, y: -8, rotation: 13, duration: .8 }, .16);
    if (headphones) scrollBurst.to(headphones, { x: 24, y: 16, rotation: -10, duration: .8 }, .16);
    if (guitar) scrollBurst.to(guitar, { x: -18, y: 12, rotation: 25, duration: .8 }, .16);
    if (movingStickers.length) scrollBurst.to(movingStickers, { scale: 1.025, duration: .55, stagger: .025 }, .2);

    if (scene && !reducedMotion && !compactLayout && scene.offsetHeight > window.innerHeight + 1) {
      let frame = 0;
      const measureProgress = () => {
        frame = 0;
        const sceneTop = window.scrollY + scene.getBoundingClientRect().top;
        const scrollDistance = Math.max(1, scene.offsetHeight - window.innerHeight);
        const progress = gsap.utils.clamp(0, 1, (window.scrollY - sceneTop) / scrollDistance);
        scrollBurst.progress(progress);
      };
      const queueProgress = () => {
        if (!frame) frame = window.requestAnimationFrame(measureProgress);
      };
      window.addEventListener('scroll', queueProgress, { passive: true });
      window.addEventListener('resize', queueProgress, { passive: true });
      measureProgress();
    }
  }

  const beyondSection = document.querySelector('.beyond-section');
  const beyondCards = [...document.querySelectorAll('[data-beyond-reveal]')];
  const flagTrack = document.querySelector('.beyond-gallery__track');
  const flagRope = document.querySelector('.beyond-gallery__rope path');
  const photoFlags = [...document.querySelectorAll('.beyond-flag')];
  let flagLayoutFrame = 0;
  const syncFlagAttachments = () => {
    flagLayoutFrame = 0;
    if (!flagTrack || !flagRope || !flagRope.getScreenCTM) return;
    const matrix = flagRope.getScreenCTM();
    const pathLength = flagRope.getTotalLength();
    if (!matrix || !pathLength) return;
    const toScreen = (distance) => {
      const point = flagRope.getPointAtLength(distance);
      return {
        x: matrix.a * point.x + matrix.c * point.y + matrix.e,
        y: matrix.b * point.x + matrix.d * point.y + matrix.f,
      };
    };
    const trackRect = flagTrack.getBoundingClientRect();
    photoFlags.forEach((flag) => {
      const tie = flag.querySelector('.beyond-flag__tie');
      if (!tie) return;
      const isOmArtwork = flag.classList.contains('beyond-flag--om-art');
      const anchorX = trackRect.left + flag.offsetLeft + flag.offsetWidth / 2;
      // The supplied OM artwork's top edge is slanted inside its transparent
      // canvas, so end the tie where that edge meets the centered hanger.
      const anchorY = trackRect.top + flag.offsetTop + (isOmArtwork ? flag.offsetWidth * (29 / 484) : 0);
      let low = 0;
      let high = pathLength;
      for (let step = 0; step < 22; step += 1) {
        const middle = (low + high) / 2;
        if (toScreen(middle).x < anchorX) low = middle;
        else high = middle;
      }
      const ropePoint = toScreen((low + high) / 2);
      const ropeDelta = ropePoint.y - anchorY;
      const tieTop = Math.min(0, ropeDelta);
      tie.style.setProperty('--tie-top', `${tieTop}px`);
      tie.style.setProperty('--tie-height', `${Math.abs(ropeDelta)}px`);
      tie.style.setProperty('--tie-loop-y', `${ropeDelta - tieTop}px`);
    });
  };
  const queueFlagAttachmentSync = () => {
    if (!flagLayoutFrame) flagLayoutFrame = window.requestAnimationFrame(syncFlagAttachments);
  };
  if (flagTrack && flagRope) {
    queueFlagAttachmentSync();
    window.addEventListener('resize', queueFlagAttachmentSync, { passive: true });
    document.querySelector('.beyond-gallery')?.addEventListener('scroll', queueFlagAttachmentSync, { passive: true });
  }
  if (beyondSection && beyondCards.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    beyondSection.classList.add('beyond-section--motion-ready');
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });
    beyondCards.forEach((card) => cardObserver.observe(card));
  }

  if (!cursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const tag = cursor.querySelector('.custom-cursor__tag');
  const hideCursor = () => {
    cursor.classList.add('is-hidden');
    cursor.classList.remove('is-tagged');
    root.classList.remove('has-custom-cursor');
  };
  document.addEventListener('pointermove', (event) => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    if (event.clientX < 0 || event.clientY < 0 || event.clientX >= innerWidth || event.clientY >= innerHeight) {
      hideCursor();
      return;
    }
    cursor.style.setProperty('--cursor-x', `${event.clientX}px`);
    cursor.style.setProperty('--cursor-y', `${event.clientY}px`);
    cursor.classList.remove('is-hidden', 'is-flipped-x', 'is-flipped-y');
    root.classList.add('has-custom-cursor');
    const target = event.target instanceof Element ? event.target.closest('[data-cursor-label]') : null;
    if (target) {
      tag.textContent = target.dataset.cursorLabel;
      cursor.dataset.theme = target.dataset.cursorTheme || 'pink';
      cursor.classList.add('is-tagged');
    } else {
      cursor.classList.remove('is-tagged');
      delete cursor.dataset.theme;
    }
    if (event.clientX > innerWidth - 260) cursor.classList.add('is-flipped-x');
    if (event.clientY > innerHeight - 70) cursor.classList.add('is-flipped-y');
  }, { passive: true });
  document.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'));
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  window.addEventListener('blur', hideCursor);
  document.documentElement.addEventListener('pointerleave', hideCursor);
})();
