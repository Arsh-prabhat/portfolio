(() => {
  const root = document.documentElement;
  const intro = document.querySelector('.welcome-intro');
  if (!intro) return;

  const active = root.classList.contains('welcome-intro-pending');
  if (!active) {
    intro.hidden = true;
    return;
  }

  const greeting = intro.querySelector('.welcome-intro__greeting');
  const skip = intro.querySelector('.welcome-intro__skip');
  const main = document.querySelector('main');
  const previousInert = main?.inert ?? false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const greetings = ['Hello', 'Hola', 'Namaste', 'Bonjour', 'Salaam', 'Ciao', 'Konnichiwa', 'Jambo'];
  let timeline;
  let greetingTimer;
  let finished = false;

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

  const finish = (fast = false) => {
    if (finished) return;
    finished = true;
    if (timeline) timeline.kill();
    if (greetingTimer) window.clearInterval(greetingTimer);

    const revealPage = () => {
      intro.hidden = true;
      intro.classList.remove('is-leaving', 'is-fast-leaving');
      root.classList.remove('welcome-intro-pending');
      if (main) main.inert = previousInert;
      const heading = document.querySelector('.name-mark');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    };

    if (reducedMotion) {
      revealPage();
      return;
    }

    // Begin while the intro is fading so the portfolio never sits still first.
    restartHeroEntrance();
    if (fast) intro.classList.add('is-fast-leaving');
    intro.classList.add('is-leaving');
    const duration = fast ? 260 : 480;
    window.setTimeout(revealPage, duration);
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
    greeting.textContent = greetings[0];
    greetingTimer = window.setInterval(() => {
      index += 1;
      if (index >= greetings.length) {
        window.clearInterval(greetingTimer);
        greetingTimer = undefined;
        finish();
      } else {
        greeting.textContent = greetings[index];
      }
    }, 250);
    return;
  }

  if (window.gsap) {
    timeline = window.gsap.timeline({ onComplete: () => finish() });
    greetings.forEach((word, index) => {
      const at = index * .34;
      timeline.call(() => { greeting.textContent = word; }, [], at);
      timeline.fromTo(greeting,
        { autoAlpha: 0, y: 18, scale: .95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: .2, ease: 'power3.out' }, at);
      if (index < greetings.length - 1) {
        timeline.to(greeting, { autoAlpha: 0, y: -10, scale: 1.02, duration: .12, ease: 'power2.in' }, at + .22);
      }
    });
    timeline.to({}, { duration: .2 });
    return;
  }

  let index = 0;
  greetingTimer = window.setInterval(() => {
    index += 1;
    if (index >= greetings.length) {
      window.clearInterval(greetingTimer);
      greetingTimer = undefined;
      finish();
      return;
    }
    greeting.textContent = greetings[index];
  }, 320);
})();
