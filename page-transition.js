(() => {
  const aboutLink = document.querySelector('[data-page-transition][href="about.html"]');
  const overlay = document.querySelector('.page-tear');
  const cursor = document.querySelector('.custom-cursor');
  if (!aboutLink || !overlay) return;

  let isNavigating = false;
  aboutLink.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (isNavigating) return;
    isNavigating = true;

    if (cursor) {
      cursor.classList.add('is-hidden');
      document.documentElement.classList.remove('has-custom-cursor');
    }
    overlay.hidden = false;
    const topTear = overlay.querySelector('.page-tear__top');
    const bottomTear = overlay.querySelector('.page-tear__bottom');
    const destination = aboutLink.href;
    const navigate = () => window.location.assign(destination);

    if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate();
      return;
    }

    window.gsap.set([topTear, bottomTear], { yPercent: 0 });
    window.gsap.timeline({ onComplete: navigate })
      .to(topTear, { yPercent: -112, duration: .78, ease: 'power3.inOut' }, 0)
      .to(bottomTear, { yPercent: 112, duration: .78, ease: 'power3.inOut' }, 0);
  });
})();
