(() => {
  const root = document.documentElement;
  const intro = document.querySelector('.welcome-intro');
  if (!intro) return;

  if (!root.classList.contains('welcome-intro-pending')) {
    intro.hidden = true;
    return;
  }

  const greeting = intro.querySelector('.welcome-intro__greeting');
  const skip = intro.querySelector('.welcome-intro__skip');
  const main = document.querySelector('main');
  const previousInert = main?.inert ?? false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const greetings = ['Hello', 'Hola', 'Namaste', 'Ciao', 'Konnichiwa'];
  greeting.replaceChildren();
  const wordNodes = greetings.map((word) => {
    const wordNode = document.createElement('span');
    wordNode.className = 'welcome-intro__word';
    wordNode.setAttribute('aria-hidden', 'true');
    Array.from(word).forEach((character) => {
      const characterNode = document.createElement('span');
      characterNode.className = 'welcome-intro__character';
      characterNode.textContent = character;
      wordNode.append(characterNode);
    });
    greeting.append(wordNode);
    return wordNode;
  });

  let timeline;
  let greetingTimer;
  let finished = false;
  let activeIndex = -1;

  const fitGreeting = (index) => {
    const wordNode = wordNodes[index];
    const baseSize = Math.min(230.687, window.innerWidth * 0.2253);
    greeting.style.fontSize = `${baseSize}px`;
    const availableWidth = Math.max(160, window.innerWidth - 48);
    const renderedWidth = wordNode.getBoundingClientRect().width;
    if (renderedWidth > availableWidth) {
      greeting.style.fontSize = `${baseSize * (availableWidth / renderedWidth)}px`;
    }
  };

  const activateGreeting = (index) => {
    if (activeIndex >= 0) wordNodes[activeIndex].classList.remove('is-active');
    activeIndex = index;
    wordNodes[index].classList.add('is-active');
    greeting.setAttribute('aria-label', greetings[index]);
    fitGreeting(index);
  };

  const restartHeroEntrance = () => {
    const entrance = [
      ['.name-mark img', '0s'],
      ['.portrait-wrap', '.12s'],
      ['.portfolio-title span', '.28s'],
      ['.portfolio-title img', '1.72s'],
    ];
    entrance.forEach(([selector, delay]) => {
      const element = document.querySelector(selector);
      if (!element) return;
      element.style.animation = 'none';
      void element.offsetWidth;
      element.style.animationDelay = delay;
      element.style.removeProperty('animation');
    });
  };

  if (main) main.inert = true;
  root.classList.remove('has-custom-cursor');
  skip?.focus({ preventScroll: true });

  const restorePage = () => {
    const heading = document.querySelector('.name-mark');
    if (main) main.inert = previousInert;
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  };

  const revealWithTear = (fast) => {
    const overlay = document.querySelector('.page-tear');
    const topTear = overlay?.querySelector('.page-tear__top');
    const bottomTear = overlay?.querySelector('.page-tear__bottom');
    if (!overlay || !topTear || !bottomTear) {
      intro.hidden = true;
      intro.classList.remove('is-leaving', 'is-fast-leaving');
      root.classList.remove('welcome-intro-pending');
      restorePage();
      return;
    }

    overlay.hidden = false;
    const duration = fast ? 560 : 780;
    const finishReveal = () => {
      overlay.hidden = true;
      intro.hidden = true;
      intro.classList.remove('is-leaving', 'is-fast-leaving');
      root.classList.remove('welcome-intro-pending');
      restorePage();
    };

    if (window.gsap) {
      window.gsap.set([topTear, bottomTear], { yPercent: 0 });
      window.gsap.timeline({ onComplete: finishReveal })
        .to(topTear, { yPercent: -112, duration: duration / 1000, ease: 'power3.inOut' }, 0)
        .to(bottomTear, { yPercent: 112, duration: duration / 1000, ease: 'power3.inOut' }, 0);
      return;
    }

    const options = { duration, easing: 'cubic-bezier(.65, 0, .35, 1)', fill: 'forwards' };
    const animations = [
      topTear.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-112%)' }], options),
      bottomTear.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(112%)' }], options),
    ];
    Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      finishReveal();
      animations.forEach((animation) => animation.cancel());
    });
  };

  const finish = (fast = false) => {
    if (finished) return;
    finished = true;
    timeline?.kill();
    window.clearTimeout(greetingTimer);

    if (reducedMotion) {
      intro.hidden = true;
      intro.classList.remove('is-leaving', 'is-fast-leaving');
      root.classList.remove('welcome-intro-pending');
      restorePage();
      return;
    }

    // Start the hero entrance underneath the paper so its motion is already underway as it opens.
    restartHeroEntrance();
    if (fast) intro.classList.add('is-fast-leaving');
    intro.classList.add('is-leaving');
    // Start the tear behind the fading intro so the grid and hero art are
    // revealed together instead of flashing as an unanimated page first.
    revealWithTear(fast);
  };

  skip?.addEventListener('click', () => finish(true));
  intro.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      finish(true);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      skip?.focus();
    }
  });

  if (reducedMotion) {
    let index = 0;
    activateGreeting(index);
    const showNext = () => {
      index += 1;
      if (index >= greetings.length) {
        finish();
        return;
      }
      activateGreeting(index);
      greetingTimer = window.setTimeout(showNext, 280);
    };
    greetingTimer = window.setTimeout(showNext, 280);
    return;
  }

  if (window.gsap) {
    let startAt = 0;
    timeline = window.gsap.timeline({ onComplete: () => finish() });
    greetings.forEach((word, index) => {
      const characters = wordNodes[index].children;
      const revealDuration = characters.length * 0.075;
      timeline.call(() => activateGreeting(index), [], startAt);
      timeline.fromTo(characters,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.075, stagger: 0.075, ease: 'none', immediateRender: false },
        startAt);
      startAt += revealDuration + 0.22;
    });
    timeline.to({}, { duration: 0.01 }, startAt);
    return;
  }

  let index = 0;
  const showNext = () => {
    activateGreeting(index);
    const characters = wordNodes[index].children;
    characters.forEach((character, characterIndex) => {
      character.animate([{ opacity: 0 }, { opacity: 1 }], {
        delay: characterIndex * 75,
        duration: 75,
        easing: 'linear',
        fill: 'forwards',
      });
    });
    const holdTime = characters.length * 75 + 220;
    index += 1;
    greetingTimer = window.setTimeout(() => {
      if (index >= greetings.length) finish();
      else showNext();
    }, holdTime);
  };
  showNext();
})();
